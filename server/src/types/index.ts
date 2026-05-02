export type ApiFormat = "openai" | "anthropic" | "openai-compatible";

// ============================================================
// App Types
// ============================================================

export type AppId = "claude" | "codex" | "gemini" | "opencode" | "openclaw" | "hermes";

export const ALL_APPS: AppId[] = ["claude", "codex", "gemini", "opencode", "openclaw", "hermes"];

// ============================================================
// Provider Types
// ============================================================

export type ProviderCategory = "official" | "partner" | "community" | "custom";

export interface Provider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  apiFormat: ApiFormat;
  websiteUrl?: string;
  notes?: string;
  icon?: string;
  iconColor?: string;
  createdAt: number;
  isActive: boolean;

  // Per-app fields (from cc-switch)
  appId?: AppId;
  settingsConfig?: Record<string, unknown>;
  category?: ProviderCategory;
  sortIndex?: number;
  meta?: Record<string, unknown>;
  isOfficial?: boolean;
  isPartner?: boolean;
}

export interface ProviderPreset {
  name: string;
  nameKey?: string;
  websiteUrl: string;
  apiKeyUrl?: string;
  settingsConfig: Record<string, unknown>;
  isOfficial?: boolean;
  isPartner?: boolean;
  category?: ProviderCategory;
  apiKeyField?: "ANTHROPIC_AUTH_TOKEN" | "ANTHROPIC_API_KEY";
  icon?: string;
  iconColor?: string;
}

// ============================================================
// Chat Types
// ============================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  providerId: string;
  model: string;
  systemPrompt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatCompletionRequest {
  providerId: string;
  model: string;
  messages: { role: string; content: string }[];
  systemPrompt?: string;
  stream?: boolean;
}

export interface FetchedModel {
  id: string;
  ownedBy: string | null;
}

// ============================================================
// Proxy Types
// ============================================================

export interface ProxyStatus {
  running: boolean;
  port: number;
  address: string;
  uptime: number;
  activeTargets: ActiveTarget[];
  totalRequests: number;
  activeConnections: number;
}

export interface ActiveTarget {
  appType: AppId;
  providerId: string;
  providerName: string;
}

export interface ProxyConfig {
  enabled: boolean;
  port: number;
  address: string;
  logRequests: boolean;
  takeover: Partial<Record<AppId, boolean>>;
}

export interface ProviderHealth {
  providerId: string;
  status: "operational" | "degraded" | "failed";
  lastCheck: number;
  latencyMs: number;
  errorMessage?: string;
}

export interface FailoverQueueItem {
  providerId: string;
  priority: number;
  appType: AppId;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
  halfOpenMaxRequests: number;
}

// ============================================================
// MCP Types
// ============================================================

export interface McpServerSpec {
  type?: "stdio" | "http" | "sse";
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}

export interface McpServer {
  id: string;
  name: string;
  enabledApps: Partial<Record<AppId, boolean>>;
  spec: McpServerSpec;
  configType: "toml" | "json";
  rawConfig?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// Prompt Types
// ============================================================

export interface Prompt {
  id: string;
  app: AppId;
  name: string;
  description?: string;
  content: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// Agent Types
// ============================================================

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: "custom" | "preset";
  config: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// Settings Types
// ============================================================

export interface AppSettings {
  theme?: "light" | "dark" | "system";
  language?: "zh" | "en" | "ja";
  activeProviderId?: string | null;
  enableLocalProxy?: boolean;
  enableFailoverToggle?: boolean;
  visibleApps?: Partial<Record<AppId, boolean>>;
  preferredTerminal?: string;
  useAppWindowControls?: boolean;
  proxy?: ProxyConfig;
  circuitBreaker?: CircuitBreakerConfig;
  [key: string]: unknown;
}
