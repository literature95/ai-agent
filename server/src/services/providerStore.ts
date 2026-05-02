import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { PATHS, type AppId } from "../utils/paths.js";
import type { Provider } from "../types/index.js";

const DATA_DIR = PATHS.aiAgentData;

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(app?: AppId): string {
  if (app) return join(DATA_DIR, `providers_${app}.json`);
  return join(DATA_DIR, "providers.json");
}

function readProviders(app?: AppId): Provider[] {
  ensureDir();
  const fp = getFilePath(app);
  if (!existsSync(fp)) {
    writeFileSync(fp, "[]", "utf-8");
    return [];
  }
  return JSON.parse(readFileSync(fp, "utf-8"));
}

function writeProviders(app: AppId | undefined, providers: Provider[]): void {
  ensureDir();
  writeFileSync(getFilePath(app), JSON.stringify(providers, null, 2), "utf-8");
}

// === App-scoped CRUD ===

export function getAllProviders(app?: AppId): Provider[] {
  return readProviders(app);
}

export function getProvider(id: string, app?: AppId): Provider | undefined {
  return readProviders(app).find((p) => p.id === id);
}

export function getCurrentProviderId(app?: AppId): string {
  const providers = readProviders(app);
  const active = providers.find((p) => p.isActive);
  return active?.id || "";
}

export function createProvider(provider: Provider, app?: AppId): Provider {
  const providers = readProviders(app);
  if (provider.isActive) {
    providers.forEach((p) => (p.isActive = false));
  }
  if (!provider.id) provider.id = uuid();
  if (!provider.createdAt) provider.createdAt = Date.now();
  providers.push(provider);
  writeProviders(app, providers);
  return provider;
}

export function updateProvider(id: string, updates: Partial<Provider>, app?: AppId): Provider | null {
  const providers = readProviders(app);
  const idx = providers.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  if (updates.isActive) {
    providers.forEach((p) => (p.isActive = false));
  }

  providers[idx] = { ...providers[idx], ...updates };
  writeProviders(app, providers);
  return providers[idx];
}

export function deleteProvider(id: string, app?: AppId): boolean {
  const providers = readProviders(app);
  const filtered = providers.filter((p) => p.id !== id);
  if (filtered.length === providers.length) return false;
  writeProviders(app, filtered);
  return true;
}

export function setActiveProvider(id: string, app?: AppId): Provider | null {
  const providers = readProviders(app);
  const provider = providers.find((p) => p.id === id);
  if (!provider) return null;

  providers.forEach((p) => (p.isActive = false));
  provider.isActive = true;
  writeProviders(app, providers);
  return provider;
}

export function updateSortOrder(updates: { id: string; sortIndex: number }[], app?: AppId): void {
  const providers = readProviders(app);
  for (const { id, sortIndex } of updates) {
    const p = providers.find((x) => x.id === id);
    if (p) p.sortIndex = sortIndex;
  }
  writeProviders(app, providers);
}

// === Presets ===

import { getPresetsForApp } from "../config/presets.js";

export function getPresets(app: AppId): Record<string, unknown>[] {
  return getPresetsForApp(app);
}
