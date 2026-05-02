import os from "os";
import path from "path";

const HOME = os.homedir();

export const PATHS = {
  /** cc-switch data directory */
  ccSwitchData: path.join(HOME, ".cc-switch"),

  /** ai-agent data directory */
  aiAgentData: path.join(HOME, ".ai-agent"),

  /** App config directories */
  claudeConfig: path.join(HOME, ".claude"),
  codexConfig: path.join(HOME, ".codex"),
  geminiConfig: path.join(HOME, ".gemini"),
  opencodeConfig: path.join(HOME, ".opencode"),
  openclawConfig: path.join(HOME, ".openclaw"),
  hermesConfig: path.join(HOME, ".hermes"),

  /** App-specific subdirectories */
  mcpServers: (app: string) => path.join(HOME, `.${app}`, "mcp_servers"),
  prompts: (app: string) => path.join(HOME, `.${app}`, "prompts"),
  sessions: (app: string) => path.join(HOME, `.${app}`, "sessions"),

  /** Skills directories */
  skillsDir: path.join(HOME, ".cc-switch", "skills"),
  skillsBackupDir: path.join(HOME, ".cc-switch", "skills_backups"),

  /** Workspace */
  openclawWorkspace: path.join(HOME, ".openclaw", "workspace"),
  openclawMemory: path.join(HOME, ".openclaw", "memory"),

  /** OpenClaw/Hermes config */
  openclawConfigFile: (file: string) => path.join(HOME, ".openclaw", file),
  hermesConfigFile: (file: string) => path.join(HOME, ".hermes", file),

  /** Usage data */
  usageData: path.join(HOME, ".cc-switch", "usage"),
} as const;

export const APP_NAMES = [
  "claude",
  "codex",
  "gemini",
  "opencode",
  "openclaw",
  "hermes",
] as const;

export type AppId = (typeof APP_NAMES)[number];
