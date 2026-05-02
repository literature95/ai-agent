import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import * as store from "../services/providerStore.js";
import { fetchModels } from "../services/modelFetcher.js";
import type { AppId } from "../types/index.js";

const router = Router();

function getAppQuery(req: any): AppId | undefined {
  return req.query.app as AppId | undefined;
}

// GET /api/providers?app=claude
router.get("/", (req, res) => {
  const app = getAppQuery(req);
  const providers = store.getAllProviders(app);
  const currentProviderId = store.getCurrentProviderId(app);
  res.json({ providers, currentProviderId });
});

// GET /api/providers/presets?app=claude
router.get("/presets", (req, res) => {
  const app = getAppQuery(req);
  if (!app) return res.status(400).json({ error: "Query param 'app' is required" });
  const presets = store.getPresets(app);
  res.json(presets);
});

// GET /api/providers/:id?app=claude
router.get("/:id", (req, res) => {
  const provider = store.getProvider(req.params.id, getAppQuery(req));
  if (!provider) { res.status(404).json({ error: "Provider not found" }); return; }
  res.json(provider);
});

// POST /api/providers
router.post("/", (req, res) => {
  const { name, apiKey, baseUrl, model, apiFormat, websiteUrl, notes, icon, iconColor, appId, settingsConfig, category } = req.body;
  if (!name || !apiKey || !baseUrl || !apiFormat) {
    res.status(400).json({ error: "Missing required fields: name, apiKey, baseUrl, apiFormat" });
    return;
  }
  const provider = store.createProvider({
    id: uuidv4(),
    name, apiKey, baseUrl,
    model: model || "",
    apiFormat,
    websiteUrl, notes, icon, iconColor,
    createdAt: Date.now(),
    isActive: req.body.isActive ?? false,
    appId: appId || req.query.app as AppId,
    settingsConfig: settingsConfig || {},
    category,
  }, getAppQuery(req));
  res.status(201).json(provider);
});

// PUT /api/providers/:id?app=claude
router.put("/:id", (req, res) => {
  const updates = { ...req.body };
  delete updates.id;
  const updated = store.updateProvider(req.params.id, updates, getAppQuery(req));
  if (!updated) { res.status(404).json({ error: "Provider not found" }); return; }
  res.json(updated);
});

// DELETE /api/providers/:id?app=claude
router.delete("/:id", (req, res) => {
  const deleted = store.deleteProvider(req.params.id, getAppQuery(req));
  if (!deleted) { res.status(404).json({ error: "Provider not found" }); return; }
  res.json({ success: true });
});

// POST /api/providers/:id/set-active?app=claude
router.post("/:id/set-active", (req, res) => {
  const provider = store.setActiveProvider(req.params.id, getAppQuery(req));
  if (!provider) { res.status(404).json({ error: "Provider not found" }); return; }
  res.json(provider);
});

// POST /api/providers/sort-order?app=claude
router.post("/sort-order", (req, res) => {
  const { updates } = req.body;
  if (!updates || !Array.isArray(updates)) {
    res.status(400).json({ error: "updates array is required" }); return;
  }
  store.updateSortOrder(updates, getAppQuery(req));
  res.json({ success: true });
});

// POST /api/providers/:id/test
router.post("/:id/test", async (req, res) => {
  const provider = store.getProvider(req.params.id, getAppQuery(req));
  if (!provider) { res.status(404).json({ error: "Provider not found" }); return; }
  const startTime = Date.now();
  try {
    const { apiFormat, baseUrl, apiKey, model } = provider;
    const testModel = model || "gpt-4o";
    if (apiFormat === "anthropic") {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: testModel, messages: [{ role: "user", content: "Hi" }], max_tokens: 1 }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) { const text = await response.text().catch(() => ""); throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`); }
    } else {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: testModel, messages: [{ role: "user", content: "Hi" }], max_tokens: 1 }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) { const text = await response.text().catch(() => ""); throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`); }
    }
    res.json({ success: true, latencyMs: Date.now() - startTime });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.json({ success: false, latencyMs: Date.now() - startTime, error: message });
  }
});

// POST /api/providers/:id/fetch-models
router.post("/:id/fetch-models", async (req, res) => {
  const provider = store.getProvider(req.params.id, getAppQuery(req));
  if (!provider) { res.status(404).json({ error: "Provider not found" }); return; }
  try {
    const models = await fetchModels(provider);
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// POST /api/providers/_models (no provider ID)
router.post("/_models", async (req, res) => {
  const { baseUrl, apiKey } = req.body;
  if (!baseUrl || !apiKey) { res.status(400).json({ error: "baseUrl and apiKey are required" }); return; }
  try {
    const models = await fetchModels({ baseUrl, apiKey } as any);
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
