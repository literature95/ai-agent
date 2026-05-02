// ============================================================
// MCP (Model Context Protocol) Types
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

export interface McpServersMap {
  [serverId: string]: McpServer;
}

export interface McpStatus {
  claude?: { configPath: string; exists: boolean; serverCount: number };
  codex?: { configPath: string; exists: boolean; serverCount: number };
  gemini?: { configPath: string; exists: boolean; serverCount: number };
}

export interface McpImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

// ============================================================
// Prompts Types
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
// Skills Types
// ============================================================

export interface InstalledSkill {
  id: string;
  name: string;
  description?: string;
  version?: string;
  repo?: string;
  directory: string;
  enabledApps: Partial<Record<AppId, boolean>>;
  installedAt: number;
  updatedAt: number;
}

export interface DiscoverableSkill {
  name: string;
  description?: string;
  repo: string;
  directory: string;
  branch?: string;
  version?: string;
}

export interface UnmanagedSkill {
  name: string;
  directory: string;
  app: AppId;
}

export interface ImportSkillSelection {
  name: string;
  directory: string;
  enabledApps: AppId[];
}

export interface SkillBackupEntry {
  id: string;
  skillName: string;
  backupPath: string;
  createdAt: number;
}

export interface SkillUpdateInfo {
  skillId: string;
  skillName: string;
  currentVersion?: string;
  latestVersion?: string;
  hasUpdate: boolean;
}

export interface SkillsShSearchResult {
  results: DiscoverableSkill[];
  total: number;
}

export interface SkillRepo {
  owner: string;
  name: string;
  branch?: string;
  addedAt: number;
}

// ============================================================
// Sessions Types
// ============================================================

export interface SessionMeta {
  id: string;
  providerId: string;
  title?: string;
  sourcePath: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
  app: AppId;
}

export interface SessionMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

export interface DeleteSessionOptions {
  providerId: string;
  sessionId: string;
  sourcePath: string;
}

export interface DeleteSessionResult {
  sessionId: string;
  success: boolean;
  error?: string;
}

// ============================================================
// Workspace Types
// ============================================================

export interface DailyMemoryFileInfo {
  filename: string;
  date: string;
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface DailyMemorySearchResult {
  filename: string;
  date: string;
  snippet: string;
  lineNumber: number;
}

// ============================================================
// Agents Types
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
// OpenClaw Types
// ============================================================

export interface OpenClawAgentsDefaults {
  primaryModel?: string;
  fallbackModels?: string[];
  workspace?: string;
  timeout?: number;
  contextTokens?: number;
  maxConcurrent?: number;
}

export interface OpenClawEnvConfig {
  [key: string]: string;
}

export interface OpenClawToolsConfig {
  profile?: string;
  allowList?: string[];
  denyList?: string[];
}

export interface OpenClawHealthWarning {
  type: string;
  message: string;
  severity: "warning" | "error";
}

export interface OpenClawWriteOutcome {
  success: boolean;
  error?: string;
}

// ============================================================
// Hermes Types
// ============================================================

export type HermesMemoryKind = "memory" | "user";

export interface HermesMemoryLimits {
  memory: { maxChars: number; current: number };
  user: { maxChars: number; current: number };
}

// ============================================================
// Usage/Cost Tracking Types
// ============================================================

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface UsageSummary {
  totalRequests: number;
  totalCost: number;
  totalTokens: TokenUsage;
  successRate: number;
  periodStart: number;
  periodEnd: number;
}

export interface DailyStats {
  date: string;
  requests: number;
  cost: number;
  tokens: TokenUsage;
}

export interface ProviderStats {
  providerId: string;
  providerName: string;
  requests: number;
  cost: number;
  tokens: TokenUsage;
  successRate: number;
  avgLatencyMs: number;
}

export interface ModelStats {
  modelId: string;
  providerId: string;
  requests: number;
  cost: number;
  tokens: TokenUsage;
  successRate: number;
  avgLatencyMs: number;
}

export interface RequestLog {
  requestId: string;
  providerId: string;
  modelId: string;
  appType: string;
  timestamp: number;
  status: "success" | "error";
  latencyMs: number;
  tokens?: TokenUsage;
  cost?: number;
  errorMessage?: string;
}

export interface PaginatedLogs {
  logs: RequestLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ModelPricing {
  modelId: string;
  inputPricePer1k: number;
  outputPricePer1k: number;
  currency: string;
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
  tray?: boolean;
  minimize?: boolean;
  launchOnStartup?: boolean;
  silentStartup?: boolean;
  [key: string]: unknown;
}

export interface BackupEntry {
  filename: string;
  createdAt: number;
  size: number;
}

// ============================================================
// Deep Link Types
// ============================================================

export type ResourceType = "provider" | "prompt" | "mcp" | "skill";

export interface DeepLinkImportRequest {
  resourceType: ResourceType;
  app?: AppId;
  name?: string;
  config?: Record<string, unknown>;
  content?: string;
  repo?: string;
  directory?: string;
  branch?: string;
  url?: string;
}

export type ImportResult =
  | { type: "provider"; id: string; name: string }
  | { type: "prompt"; id: string; name: string }
  | { type: "mcp"; id: string; name: string }
  | { type: "skill"; id: string; name: string }
  | { type: "error"; message: string };

// ============================================================
// Re-export AppId from paths
// ============================================================

import type { AppId } from "../utils/paths";
export type { AppId };
