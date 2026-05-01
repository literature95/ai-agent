import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Provider } from "../types/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../../data");
const PROVIDERS_FILE = join(DATA_DIR, "providers.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readProviders(): Provider[] {
  ensureDataDir();
  if (!existsSync(PROVIDERS_FILE)) {
    writeFileSync(PROVIDERS_FILE, "[]", "utf-8");
    return [];
  }
  const raw = readFileSync(PROVIDERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeProviders(providers: Provider[]): void {
  ensureDataDir();
  writeFileSync(PROVIDERS_FILE, JSON.stringify(providers, null, 2), "utf-8");
}

export function getAllProviders(): Provider[] {
  return readProviders();
}

export function getProvider(id: string): Provider | undefined {
  return readProviders().find((p) => p.id === id);
}

export function createProvider(provider: Provider): Provider {
  const providers = readProviders();
  if (provider.isActive) {
    providers.forEach((p) => (p.isActive = false));
  }
  providers.push(provider);
  writeProviders(providers);
  return provider;
}

export function updateProvider(id: string, updates: Partial<Provider>): Provider | null {
  const providers = readProviders();
  const idx = providers.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  if (updates.isActive) {
    providers.forEach((p) => (p.isActive = false));
  }

  providers[idx] = { ...providers[idx], ...updates };
  writeProviders(providers);
  return providers[idx];
}

export function deleteProvider(id: string): boolean {
  const providers = readProviders();
  const filtered = providers.filter((p) => p.id !== id);
  if (filtered.length === providers.length) return false;
  writeProviders(filtered);
  return true;
}

export function setActiveProvider(id: string): Provider | null {
  const providers = readProviders();
  const provider = providers.find((p) => p.id === id);
  if (!provider) return null;

  providers.forEach((p) => (p.isActive = false));
  provider.isActive = true;
  writeProviders(providers);
  return provider;
}

export function getActiveProvider(): Provider | undefined {
  return readProviders().find((p) => p.isActive);
}
