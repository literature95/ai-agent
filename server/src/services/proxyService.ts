import http from "http";
import https from "https";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { PATHS } from "../utils/paths.js";
import type { ProxyStatus, ProxyConfig, ActiveTarget, ProviderHealth, FailoverQueueItem, CircuitBreakerConfig, AppId } from "../types/index.js";

const DATA_DIR = PATHS.aiAgentData;

// Default configs
const DEFAULT_PROXY_PORT = 11434;
const DEFAULT_CIRCUIT_BREAKER: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeoutMs: 30000,
  halfOpenMaxRequests: 3,
};

// Proxy state
let server: http.Server | null = null;
let isRunning = false;
let startTime = 0;
let totalRequests = 0;
let activeConnections = 0;
let activeTargets: ActiveTarget[] = [];
let takeover: Partial<Record<AppId, boolean>> = {};
let config: ProxyConfig = {
  enabled: false,
  port: DEFAULT_PROXY_PORT,
  address: "127.0.0.1",
  logRequests: false,
  takeover: {},
};

// Health state
const providerHealth: Map<string, ProviderHealth> = new Map();
const circuitBreakerState: Map<string, { failures: number; openUntil: number; halfOpen: boolean }> = new Map();
const failoverQueues: Map<AppId, FailoverQueueItem[]> = new Map();
let circuitBreakerConfig: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER;

// ============================================================
// Config persistence
// ============================================================

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function getProxyConfig(): ProxyConfig {
  ensureDir();
  const fp = join(DATA_DIR, "proxy_config.json");
  if (existsSync(fp)) {
    config = { ...config, ...JSON.parse(readFileSync(fp, "utf-8")) };
  }
  return config;
}

export function setProxyConfig(updates: Partial<ProxyConfig>): ProxyConfig {
  config = { ...config, ...updates };
  ensureDir();
  writeFileSync(join(DATA_DIR, "proxy_config.json"), JSON.stringify(config, null, 2), "utf-8");
  if (updates.takeover) takeover = { ...takeover, ...updates.takeover };
  return config;
}

export function getCircuitBreakerConfig(): CircuitBreakerConfig {
  return circuitBreakerConfig;
}

export function setCircuitBreakerConfig(updates: Partial<CircuitBreakerConfig>): CircuitBreakerConfig {
  circuitBreakerConfig = { ...circuitBreakerConfig, ...updates };
  return circuitBreakerConfig;
}

// ============================================================
// Proxy server
// ============================================================

export function getProxyStatus(): ProxyStatus {
  return {
    running: isRunning,
    port: config.port,
    address: config.address,
    uptime: isRunning ? Date.now() - startTime : 0,
    activeTargets,
    totalRequests,
    activeConnections,
  };
}

export function getTakeoverStatus(): Partial<Record<AppId, boolean>> {
  return { ...takeover };
}

export function setTakeover(app: AppId, enabled: boolean): void {
  takeover[app] = enabled;
  config.takeover = takeover;
  writeFileSync(join(DATA_DIR, "proxy_config.json"), JSON.stringify(config, null, 2), "utf-8");
}

export function setActiveTarget(appType: AppId, providerId: string, providerName: string): void {
  const idx = activeTargets.findIndex((t) => t.appType === appType);
  if (idx >= 0) {
    activeTargets[idx] = { appType, providerId, providerName };
  } else {
    activeTargets.push({ appType, providerId, providerName });
  }
}

async function handleProxyRequest(clientReq: http.IncomingMessage, clientRes: http.ServerResponse): Promise<void> {
  activeConnections++;
  totalRequests++;

  // Determine target app from request path or headers
  const appType = (clientReq.headers["x-cc-app"] as AppId) || "claude";
  const target = activeTargets.find((t) => t.appType === appType);

  if (!target) {
    clientRes.writeHead(502, { "Content-Type": "application/json" });
    clientRes.end(JSON.stringify({ error: "No active provider for this app" }));
    activeConnections--;
    return;
  }

  // Read provider config
  const providerFile = join(DATA_DIR, `providers_${appType}.json`);
  let provider: { baseUrl: string; apiKey: string; apiFormat: string } | null = null;
  try {
    if (existsSync(providerFile)) {
      const providers = JSON.parse(readFileSync(providerFile, "utf-8"));
      provider = providers.find((p: any) => p.id === target.providerId) || null;
    }
  } catch { /* ignore */ }

  if (!provider) {
    clientRes.writeHead(502, { "Content-Type": "application/json" });
    clientRes.end(JSON.stringify({ error: "Provider not found" }));
    activeConnections--;
    return;
  }

  const targetUrl = new URL(provider.baseUrl.replace(/\/+$/, ""));
  const targetPath = clientReq.url?.replace(/^\/proxy/, "") || "/chat/completions";

  const options: https.RequestOptions = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
    path: targetPath,
    method: clientReq.method,
    headers: {
      "Content-Type": "application/json",
      ...(provider.apiFormat === "anthropic"
        ? { "x-api-key": provider.apiKey, "anthropic-version": "2023-06-01" }
        : { Authorization: `Bearer ${provider.apiKey}` }),
    },
  };

  const transport = targetUrl.protocol === "https:" ? https : http;
  const proxyReq = transport.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on("error", (err) => {
    clientRes.writeHead(502, { "Content-Type": "application/json" });
    clientRes.end(JSON.stringify({ error: "Proxy error", details: err.message }));
    activeConnections--;
  });

  clientReq.pipe(proxyReq);

  clientRes.on("close", () => {
    activeConnections--;
  });
}

export function startProxy(): ProxyStatus {
  if (isRunning) return getProxyStatus();

  server = http.createServer(handleProxyRequest);
  server.listen(config.port, config.address, () => {
    isRunning = true;
    startTime = Date.now();
  });

  return getProxyStatus();
}

export function stopProxy(): Promise<ProxyStatus> {
  if (!isRunning || !server) return Promise.resolve(getProxyStatus());

  return new Promise<ProxyStatus>((resolve) => {
    server!.close(() => {
      isRunning = false;
      server = null;
      resolve(getProxyStatus());
    });
  });
}

// ============================================================
// Health checking
// ============================================================

export async function checkProviderHealth(providerId: string, baseUrl: string, apiKey: string): Promise<ProviderHealth> {
  const startMs = Date.now();
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15000),
    });
    const health: ProviderHealth = {
      providerId,
      status: resp.ok ? "operational" : "degraded",
      lastCheck: Date.now(),
      latencyMs: Date.now() - startMs,
    };
    providerHealth.set(providerId, health);
    resetCircuitBreaker(providerId);
    return health;
  } catch (err) {
    const health: ProviderHealth = {
      providerId,
      status: "failed",
      lastCheck: Date.now(),
      latencyMs: Date.now() - startMs,
      errorMessage: err instanceof Error ? err.message : String(err),
    };
    providerHealth.set(providerId, health);
    recordFailure(providerId);
    return health;
  }
}

export function getProviderHealthStatus(providerId: string): ProviderHealth | undefined {
  return providerHealth.get(providerId);
}

export function getAllProviderHealth(): ProviderHealth[] {
  return Array.from(providerHealth.values());
}

// ============================================================
// Circuit breaker
// ============================================================

function recordFailure(providerId: string): void {
  const cb = circuitBreakerState.get(providerId) || { failures: 0, openUntil: 0, halfOpen: false };
  cb.failures++;
  if (cb.failures >= circuitBreakerConfig.failureThreshold) {
    cb.openUntil = Date.now() + circuitBreakerConfig.recoveryTimeoutMs;
    if (providerHealth.has(providerId)) {
      providerHealth.get(providerId)!.status = "failed";
    }
  }
  circuitBreakerState.set(providerId, cb);
}

function resetCircuitBreaker(providerId: string): void {
  circuitBreakerState.set(providerId, { failures: 0, openUntil: 0, halfOpen: false });
}

export function resetCircuitBreakerManually(providerId: string): void {
  resetCircuitBreaker(providerId);
  const h = providerHealth.get(providerId);
  if (h) h.status = "operational";
}

export function isCircuitOpen(providerId: string): boolean {
  const cb = circuitBreakerState.get(providerId);
  if (!cb) return false;
  return Date.now() < cb.openUntil;
}

export function getCircuitBreakerStats(): Map<string, { failures: number; openUntil: number; isOpen: boolean }> {
  const result = new Map<string, { failures: number; openUntil: number; isOpen: boolean }>();
  for (const [id, cb] of circuitBreakerState) {
    result.set(id, { failures: cb.failures, openUntil: cb.openUntil, isOpen: Date.now() < cb.openUntil });
  }
  return result;
}

// ============================================================
// Failover queue
// ============================================================

export function getFailoverQueue(app: AppId): FailoverQueueItem[] {
  return failoverQueues.get(app) || [];
}

export function setFailoverQueue(app: AppId, items: FailoverQueueItem[]): void {
  failoverQueues.set(app, items);
}

export function addToFailoverQueue(app: AppId, item: FailoverQueueItem): void {
  const queue = failoverQueues.get(app) || [];
  queue.push(item);
  failoverQueues.set(app, queue);
}

export function removeFromFailoverQueue(app: AppId, providerId: string): void {
  const queue = failoverQueues.get(app) || [];
  failoverQueues.set(app, queue.filter((i) => i.providerId !== providerId));
}

export function getNextFailoverProvider(app: AppId): FailoverQueueItem | null {
  const queue = failoverQueues.get(app) || [];
  const sorted = [...queue].sort((a, b) => a.priority - b.priority);
  return sorted.find((i) => !isCircuitOpen(i.providerId)) || null;
}
