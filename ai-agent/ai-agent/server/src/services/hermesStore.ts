import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { PATHS } from "../utils/paths.js";
import type { HermesMemoryKind, HermesMemoryLimits } from "../types/migrated.js";

const HERMES_DIR = PATHS.hermesConfig;

function ensureDir(): void {
  if (!existsSync(HERMES_DIR)) mkdirSync(HERMES_DIR, { recursive: true });
}

function getMemoryPath(kind: HermesMemoryKind): string {
  return join(HERMES_DIR, kind === "memory" ? "MEMORY.md" : "USER.md");
}

export function getMemory(kind: HermesMemoryKind): string {
  ensureDir();
  const fp = getMemoryPath(kind);
  if (!existsSync(fp)) return "";
  return readFileSync(fp, "utf-8");
}

export function setMemory(kind: HermesMemoryKind, content: string): void {
  ensureDir();
  writeFileSync(getMemoryPath(kind), content, "utf-8");
}

export function getMemoryEnabled(kind: HermesMemoryKind): boolean {
  const configPath = join(HERMES_DIR, "config.json");
  if (!existsSync(configPath)) return true;
  try {
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    return config[kind]?.enabled !== false;
  } catch {
    return true;
  }
}

export function setMemoryEnabled(kind: HermesMemoryKind, enabled: boolean): void {
  ensureDir();
  const configPath = join(HERMES_DIR, "config.json");
  let config: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try { config = JSON.parse(readFileSync(configPath, "utf-8")); } catch { /* use default */ }
  }
  if (!config[kind]) config[kind] = {};
  (config[kind] as any).enabled = enabled;
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export function getMemoryLimits(): HermesMemoryLimits {
  return {
    memory: { maxChars: 100000, current: getMemory("memory").length },
    user: { maxChars: 50000, current: getMemory("user").length },
  };
}
