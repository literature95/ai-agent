import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import * as store from "../services/providerStore.js";
import { fetchModels } from "../services/modelFetcher.js";

const router = Router();

// GET all providers
router.get("/", (_req, res) => {
  res.json(store.getAllProviders());
});

// GET single provider
router.get("/:id", (req, res) => {
  const provider = store.getProvider(req.params.id);
  if (!provider) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }
  res.json(provider);
});

// POST create provider
router.post("/", (req, res) => {
  const { name, apiKey, baseUrl, model, apiFormat, websiteUrl, notes, icon, iconColor } = req.body;

  if (!name || !apiKey || !baseUrl || !apiFormat) {
    res.status(400).json({ error: "Missing required fields: name, apiKey, baseUrl, apiFormat" });
    return;
  }

  const provider = store.createProvider({
    id: uuidv4(),
    name,
    apiKey,
    baseUrl,
    model: model || "",
    apiFormat,
    websiteUrl,
    notes,
    icon,
    iconColor,
    createdAt: Date.now(),
    isActive: req.body.isActive ?? false,
  });

  res.status(201).json(provider);
});

// PUT update provider
router.put("/:id", (req, res) => {
  const updates = { ...req.body };
  delete updates.id;

  const updated = store.updateProvider(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }
  res.json(updated);
});

// DELETE provider
router.delete("/:id", (req, res) => {
  const deleted = store.deleteProvider(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }
  res.json({ success: true });
});

// POST set active provider
router.post("/:id/set-active", (req, res) => {
  const provider = store.setActiveProvider(req.params.id);
  if (!provider) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }
  res.json(provider);
});

// POST test connection
router.post("/:id/test", async (req, res) => {
  const provider = store.getProvider(req.params.id);
  if (!provider) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }

  const startTime = Date.now();
  try {
    const { apiFormat, baseUrl, apiKey, model } = provider;
    const testModel = model || "gpt-4o";

    if (apiFormat === "anthropic") {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: testModel,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 1,
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }
    } else {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: testModel,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 1,
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }
    }

    res.json({ success: true, latencyMs: Date.now() - startTime });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.json({ success: false, latencyMs: Date.now() - startTime, error: message });
  }
});

// POST fetch models
router.post("/:id/fetch-models", async (req, res) => {
  const provider = store.getProvider(req.params.id);
  if (!provider) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }

  try {
    const models = await fetchModels(provider);
    res.json({ models });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// POST fetch models without provider ID (for form preview)
router.post("/_models", async (req, res) => {
  const { baseUrl, apiKey } = req.body;
  if (!baseUrl || !apiKey) {
    res.status(400).json({ error: "baseUrl and apiKey are required" });
    return;
  }
  try {
    const models = await fetchModels({ baseUrl, apiKey });
    res.json({ models });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
