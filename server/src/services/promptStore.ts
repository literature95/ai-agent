import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { PATHS, type AppId } from "../utils/paths.js";
import type { Prompt } from "../types/migrated.js";

const DATA_DIR = PATHS.aiAgentData;
const PROMPTS_DIR = join(DATA_DIR, "prompts");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(PROMPTS_DIR)) {
    mkdirSync(PROMPTS_DIR, { recursive: true });
  }
}

function getFilePath(app: AppId): string {
  return join(PROMPTS_DIR, `${app}.json`);
}

function readPrompts(app: AppId): Prompt[] {
  ensureDir();
  const fp = getFilePath(app);
  if (!existsSync(fp)) {
    writeFileSync(fp, "[]", "utf-8");
    return [];
  }
  return JSON.parse(readFileSync(fp, "utf-8"));
}

function writePrompts(app: AppId, prompts: Prompt[]): void {
  ensureDir();
  writeFileSync(getFilePath(app), JSON.stringify(prompts, null, 2), "utf-8");
}

export function getAllPrompts(app: AppId): Prompt[] {
  return readPrompts(app);
}

export function getPrompt(app: AppId, id: string): Prompt | undefined {
  return readPrompts(app).find((p) => p.id === id);
}

export function createPrompt(prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Prompt {
  const prompts = readPrompts(prompt.app);
  const now = Date.now();
  const newPrompt: Prompt = {
    ...prompt,
    id: uuid(),
    createdAt: now,
    updatedAt: now,
  };
  prompts.push(newPrompt);
  writePrompts(prompt.app, prompts);
  return newPrompt;
}

export function upsertPrompt(prompt: Omit<Prompt, "createdAt" | "updatedAt"> & { createdAt?: number; updatedAt?: number }): Prompt {
  const prompts = readPrompts(prompt.app);
  const now = Date.now();
  const idx = prompts.findIndex((p) => p.id === prompt.id);
  if (idx >= 0) {
    prompts[idx] = { ...prompts[idx], ...prompt, updatedAt: now };
    writePrompts(prompt.app, prompts);
    return prompts[idx];
  }
  const newPrompt: Prompt = {
    ...prompt,
    id: prompt.id || uuid(),
    createdAt: prompt.createdAt || now,
    updatedAt: now,
  };
  prompts.push(newPrompt);
  writePrompts(prompt.app, prompts);
  return newPrompt;
}

export function updatePrompt(app: AppId, id: string, updates: Partial<Prompt>): Prompt | null {
  const prompts = readPrompts(app);
  const idx = prompts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  prompts[idx] = { ...prompts[idx], ...updates, updatedAt: Date.now() };
  writePrompts(app, prompts);
  return prompts[idx];
}

export function deletePrompt(app: AppId, id: string): boolean {
  const prompts = readPrompts(app);
  const filtered = prompts.filter((p) => p.id !== id);
  if (filtered.length === prompts.length) return false;
  writePrompts(app, filtered);
  return true;
}

export function enablePrompt(app: AppId, id: string): Prompt | null {
  const prompts = readPrompts(app);
  // Disable all prompts for this app first
  prompts.forEach((p) => (p.enabled = false));
  const prompt = prompts.find((p) => p.id === id);
  if (!prompt) return null;
  prompt.enabled = true;
  prompt.updatedAt = Date.now();
  writePrompts(app, prompts);
  return prompt;
}

// Read current CLAUDE.md / AGENTS.md / GEMINI.md from filesystem
export function getCurrentPromptFile(app: AppId): string | null {
  const configDir = PATHS[`${app}Config` as keyof typeof PATHS];
  if (typeof configDir !== "string") return null;

  const filenames: Record<string, string> = {
    claude: "CLAUDE.md",
    codex: "AGENTS.md",
    gemini: "GEMINI.md",
    opencode: "AGENTS.md",
    openclaw: "AGENTS.md",
    hermes: "AGENTS.md",
  };

  const filename = filenames[app] || "AGENTS.md";
  const fp = join(configDir, filename);
  if (!existsSync(fp)) return null;
  return readFileSync(fp, "utf-8");
}

// Import prompt content from a file path
export function importPromptFromFile(filePath: string): { content: string } | null {
  try {
    if (!existsSync(filePath)) return null;
    const content = readFileSync(filePath, "utf-8");
    return { content };
  } catch {
    return null;
  }
}
