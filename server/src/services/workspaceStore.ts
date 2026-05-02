import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { join, basename } from "path";
import { PATHS } from "../utils/paths.js";
import type { DailyMemoryFileInfo, DailyMemorySearchResult } from "../types/migrated.js";

const WORKSPACE_DIR = PATHS.openclawWorkspace;
const MEMORY_DIR = PATHS.openclawMemory;

const WORKSPACE_FILES = [
  "AGENTS.md",
  "SOUL.md",
  "USER.md",
  "IDENTITY.md",
  "TOOLS.md",
  "MEMORY.md",
  "HEARTBEAT.md",
  "BOOTSTRAP.md",
  "BOOT.md",
];

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// --- Workspace Files ---

export function readWorkspaceFile(filename: string): string | null {
  if (!WORKSPACE_FILES.includes(filename)) return null;
  const fp = join(WORKSPACE_DIR, filename);
  if (!existsSync(fp)) return null;
  return readFileSync(fp, "utf-8");
}

export function writeWorkspaceFile(filename: string, content: string): boolean {
  if (!WORKSPACE_FILES.includes(filename)) return false;
  ensureDir(WORKSPACE_DIR);
  writeFileSync(join(WORKSPACE_DIR, filename), content, "utf-8");
  return true;
}

export function checkWorkspaceFiles(): Record<string, boolean> {
  ensureDir(WORKSPACE_DIR);
  const result: Record<string, boolean> = {};
  for (const f of WORKSPACE_FILES) {
    result[f] = existsSync(join(WORKSPACE_DIR, f));
  }
  return result;
}

// --- Daily Memory ---

export function listDailyMemory(): DailyMemoryFileInfo[] {
  ensureDir(MEMORY_DIR);
  const files = readdirSync(MEMORY_DIR).filter((f) => f.endsWith(".md"));
  return files.map((f) => {
    const fp = join(MEMORY_DIR, f);
    const stat = existsSync(fp) ? readFileSync(fp, "utf-8") : "";
    return {
      filename: f,
      date: basename(f, ".md"),
      size: stat.length,
      createdAt: 0,
      updatedAt: 0,
    };
  });
}

export function readDailyMemory(filename: string): string | null {
  const fp = join(MEMORY_DIR, filename);
  if (!existsSync(fp)) return null;
  return readFileSync(fp, "utf-8");
}

export function writeDailyMemory(filename: string, content: string): void {
  ensureDir(MEMORY_DIR);
  writeFileSync(join(MEMORY_DIR, filename), content, "utf-8");
}

export function deleteDailyMemory(filename: string): boolean {
  const fp = join(MEMORY_DIR, filename);
  if (!existsSync(fp)) return false;
  unlinkSync(fp);
  return true;
}

export function searchDailyMemory(query: string): DailyMemorySearchResult[] {
  ensureDir(MEMORY_DIR);
  const results: DailyMemorySearchResult[] = [];
  const files = readdirSync(MEMORY_DIR).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const content = readFileSync(join(MEMORY_DIR, f), "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(query.toLowerCase())) {
        results.push({
          filename: f,
          date: basename(f, ".md"),
          snippet: lines[i].substring(0, 200),
          lineNumber: i + 1,
        });
      }
    }
  }
  return results;
}
