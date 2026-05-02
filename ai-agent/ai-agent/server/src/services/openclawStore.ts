import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { PATHS } from "../utils/paths.js";
import type { OpenClawAgentsDefaults, OpenClawEnvConfig, OpenClawToolsConfig, OpenClawHealthWarning, OpenClawWriteOutcome } from "../types/migrated.js";

const CONFIG_FILE = PATHS.openclawConfigFile("openclaw.json");

function ensureDir(): void {
  const dir = PATHS.openclawConfig;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readConfig(): Record<string, unknown> {
  ensureDir();
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeConfig(config: Record<string, unknown>): OpenClawWriteOutcome {
  try {
    ensureDir();
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export function getAgentsDefaults(): OpenClawAgentsDefaults | null {
  const config = readConfig();
  return (config.agents as any)?.defaults || null;
}

export function setAgentsDefaults(defaults: OpenClawAgentsDefaults): OpenClawWriteOutcome {
  const config = readConfig();
  if (!config.agents) config.agents = {};
  (config.agents as any).defaults = defaults;
  return writeConfig(config);
}

export function getEnv(): OpenClawEnvConfig {
  const config = readConfig();
  return (config.env as OpenClawEnvConfig) || {};
}

export function setEnv(env: OpenClawEnvConfig): OpenClawWriteOutcome {
  const config = readConfig();
  config.env = env;
  return writeConfig(config);
}

export function getTools(): OpenClawToolsConfig {
  const config = readConfig();
  return (config.tools as OpenClawToolsConfig) || {};
}

export function setTools(tools: OpenClawToolsConfig): OpenClawWriteOutcome {
  const config = readConfig();
  config.tools = tools;
  return writeConfig(config);
}

export function scanHealth(): OpenClawHealthWarning[] {
  const warnings: OpenClawHealthWarning[] = [];
  const config = readConfig();

  if (!config.agents) {
    warnings.push({ type: "missing_agents", message: "agents section is missing", severity: "warning" });
  }

  try {
    const env = config.env as Record<string, unknown> | undefined;
    if (env && typeof env === "object") {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string" && value.trim() === "") {
          warnings.push({ type: "empty_env_var", message: `Environment variable "${key}" is empty`, severity: "warning" });
        }
      }
    }
  } catch {
    warnings.push({ type: "parse_error", message: "Failed to parse openclaw.json", severity: "error" });
  }

  return warnings;
}
