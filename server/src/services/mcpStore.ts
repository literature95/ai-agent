import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { PATHS, type AppId } from "../utils/paths.js";
import type { McpServer, McpServersMap, McpServerSpec, McpStatus, McpImportResult } from "../types/migrated.js";

const DATA_DIR = PATHS.aiAgentData;
const MCP_FILE = join(DATA_DIR, "mcp_servers.json");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readServers(): McpServersMap {
  ensureDir();
  if (!existsSync(MCP_FILE)) {
    writeFileSync(MCP_FILE, "{}", "utf-8");
    return {};
  }
  return JSON.parse(readFileSync(MCP_FILE, "utf-8"));
}

function writeServers(servers: McpServersMap): void {
  ensureDir();
  writeFileSync(MCP_FILE, JSON.stringify(servers, null, 2), "utf-8");
}

export function getAllServers(): McpServersMap {
  return readServers();
}

export function getServer(id: string): McpServer | undefined {
  return readServers()[id];
}

export function createServer(data: { name: string; enabledApps?: Partial<Record<AppId, boolean>>; spec: McpServerSpec; configType?: "toml" | "json"; rawConfig?: string }): McpServer {
  const servers = readServers();
  const now = Date.now();
  const server: McpServer = {
    id: uuid(),
    name: data.name,
    enabledApps: data.enabledApps || {},
    spec: data.spec,
    configType: data.configType || "json",
    rawConfig: data.rawConfig,
    createdAt: now,
    updatedAt: now,
  };
  servers[server.id] = server;
  writeServers(servers);
  return server;
}

export function updateServer(id: string, updates: Partial<McpServer>): McpServer | null {
  const servers = readServers();
  if (!servers[id]) return null;
  servers[id] = { ...servers[id], ...updates, updatedAt: Date.now() };
  writeServers(servers);
  return servers[id];
}

export function deleteServer(id: string): boolean {
  const servers = readServers();
  if (!servers[id]) return false;
  delete servers[id];
  writeServers(servers);
  return true;
}

export function toggleApp(id: string, app: AppId, enabled: boolean): McpServer | null {
  const servers = readServers();
  if (!servers[id]) return null;
  servers[id].enabledApps[app] = enabled;
  servers[id].updatedAt = Date.now();
  writeServers(servers);
  return servers[id];
}

// Scan app config directories for existing MCP servers and import them
export function importFromApps(apps?: AppId[]): McpImportResult {
  const targetApps = apps || (["claude", "codex", "gemini"] as AppId[]);
  const servers = readServers();
  let importedCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];

  for (const app of targetApps) {
    const mcpDir = PATHS.mcpServers(app);
    if (!existsSync(mcpDir)) continue;
    // This is a simplified import — real implementation would parse TOML/JSON configs
    // For now, just return the structure
  }

  return { importedCount, skippedCount, errors };
}

export function getMcpStatus(): McpStatus {
  const status: McpStatus = {};
  for (const app of ["claude", "codex", "gemini"] as AppId[]) {
    const configPath = PATHS.mcpServers(app);
    status[app as keyof McpStatus] = {
      configPath,
      exists: existsSync(configPath),
      serverCount: existsSync(configPath) ? Object.keys(readServers()).filter((id) => readServers()[id].enabledApps[app]).length : 0,
    };
  }
  return status;
}

// Validate TOML config for MCP server
export function validateTomlConfig(config: string): { valid: boolean; spec?: McpServerSpec; error?: string } {
  try {
    // Simple JSON-based validation for now (TOML parsing requires smol-toml dependency)
    const parsed = JSON.parse(config);
    return {
      valid: true,
      spec: {
        type: parsed.type,
        command: parsed.command,
        args: parsed.args,
        env: parsed.env,
        url: parsed.url,
      },
    };
  } catch (e) {
    return { valid: false, error: String(e) };
  }
}
