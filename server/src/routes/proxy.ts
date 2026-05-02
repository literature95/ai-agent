import { Router } from "express";
import * as proxyService from "../services/proxyService.js";
import type { AppId } from "../types/index.js";

const router = Router();

// GET /api/proxy/status
router.get("/status", (_req, res) => res.json(proxyService.getProxyStatus()));

// GET /api/proxy/config
router.get("/config", (_req, res) => res.json(proxyService.getProxyConfig()));

// PUT /api/proxy/config
router.put("/config", (req, res) => {
  const config = proxyService.setProxyConfig(req.body);
  res.json(config);
});

// POST /api/proxy/start
router.post("/start", (_req, res) => {
  const status = proxyService.startProxy();
  res.json(status);
});

// POST /api/proxy/stop
router.post("/stop", async (_req, res) => {
  const status = await proxyService.stopProxy();
  res.json(status);
});

// GET /api/proxy/takeover
router.get("/takeover", (_req, res) => res.json(proxyService.getTakeoverStatus()));

// POST /api/proxy/takeover
router.post("/takeover", (req, res) => {
  const { app, enabled } = req.body;
  if (!app || typeof enabled !== "boolean") {
    return res.status(400).json({ error: "app and enabled are required" });
  }
  proxyService.setTakeover(app as AppId, enabled);
  res.json(proxyService.getTakeoverStatus());
});

// POST /api/proxy/set-active
router.post("/set-active", (req, res) => {
  const { appType, providerId, providerName } = req.body;
  if (!appType || !providerId) {
    return res.status(400).json({ error: "appType and providerId are required" });
  }
  proxyService.setActiveTarget(appType as AppId, providerId, providerName || providerId);
  res.json(proxyService.getProxyStatus());
});

// ============================================================
// Health & Circuit Breaker
// ============================================================

// GET /api/proxy/health
router.get("/health", (_req, res) => res.json(proxyService.getAllProviderHealth()));

// GET /api/proxy/health/:providerId
router.get("/health/:providerId", (req, res) => {
  const h = proxyService.getProviderHealthStatus(req.params.providerId);
  if (!h) return res.status(404).json({ error: "Health status not found" });
  res.json(h);
});

// POST /api/proxy/health/check
router.post("/health/check", async (req, res) => {
  const { providerId, baseUrl, apiKey } = req.body;
  if (!providerId || !baseUrl || !apiKey) {
    return res.status(400).json({ error: "providerId, baseUrl, and apiKey are required" });
  }
  const health = await proxyService.checkProviderHealth(providerId, baseUrl, apiKey);
  res.json(health);
});

// GET /api/proxy/circuit-breaker
router.get("/circuit-breaker", (_req, res) => {
  const stats: Record<string, unknown> = {};
  for (const [id, s] of proxyService.getCircuitBreakerStats()) {
    stats[id] = s;
  }
  res.json({ config: proxyService.getCircuitBreakerConfig(), stats });
});

// PUT /api/proxy/circuit-breaker
router.put("/circuit-breaker", (req, res) => {
  const cfg = proxyService.setCircuitBreakerConfig(req.body);
  res.json(cfg);
});

// POST /api/proxy/circuit-breaker/:providerId/reset
router.post("/circuit-breaker/:providerId/reset", (req, res) => {
  proxyService.resetCircuitBreakerManually(req.params.providerId);
  res.json({ success: true });
});

// ============================================================
// Failover
// ============================================================

// GET /api/proxy/failover?app=claude
router.get("/failover", (req, res) => {
  const app = req.query.app as AppId;
  if (!app) return res.status(400).json({ error: "Query param 'app' is required" });
  res.json(proxyService.getFailoverQueue(app));
});

// PUT /api/proxy/failover
router.put("/failover", (req, res) => {
  const { app, items } = req.body;
  if (!app || !items) return res.status(400).json({ error: "app and items are required" });
  proxyService.setFailoverQueue(app, items);
  res.json(proxyService.getFailoverQueue(app));
});

// POST /api/proxy/failover/add
router.post("/failover/add", (req, res) => {
  const { app, providerId, priority } = req.body;
  if (!app || !providerId) return res.status(400).json({ error: "app and providerId are required" });
  proxyService.addToFailoverQueue(app, { providerId, priority: priority || 0, appType: app });
  res.json(proxyService.getFailoverQueue(app));
});

// POST /api/proxy/failover/remove
router.post("/failover/remove", (req, res) => {
  const { app, providerId } = req.body;
  if (!app || !providerId) return res.status(400).json({ error: "app and providerId are required" });
  proxyService.removeFromFailoverQueue(app, providerId);
  res.json(proxyService.getFailoverQueue(app));
});

export default router;
