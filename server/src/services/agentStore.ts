import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { PATHS } from "../utils/paths.js";
import type { Agent } from "../types/migrated.js";

const DATA_DIR = PATHS.aiAgentData;
const AGENTS_FILE = join(DATA_DIR, "agents.json");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAgents(): Agent[] {
  ensureDir();
  if (!existsSync(AGENTS_FILE)) {
    writeFileSync(AGENTS_FILE, "[]", "utf-8");
    return [];
  }
  return JSON.parse(readFileSync(AGENTS_FILE, "utf-8"));
}

function writeAgents(agents: Agent[]): void {
  ensureDir();
  writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), "utf-8");
}

export function getAllAgents(): Agent[] {
  return readAgents();
}

export function getAgent(id: string): Agent | undefined {
  return readAgents().find((a) => a.id === id);
}

export function createAgent(data: Omit<Agent, "id" | "createdAt" | "updatedAt">): Agent {
  const agents = readAgents();
  const now = Date.now();
  const agent: Agent = { id: uuid(), ...data, createdAt: now, updatedAt: now };
  agents.push(agent);
  writeAgents(agents);
  return agent;
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const agents = readAgents();
  const idx = agents.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  agents[idx] = { ...agents[idx], ...updates, updatedAt: Date.now() };
  writeAgents(agents);
  return agents[idx];
}

export function deleteAgent(id: string): boolean {
  const agents = readAgents();
  const filtered = agents.filter((a) => a.id !== id);
  if (filtered.length === agents.length) return false;
  writeAgents(filtered);
  return true;
}
