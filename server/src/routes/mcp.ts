import { Router } from "express";
import * as mcpStore from "../services/mcpStore.js";
import type { AppId } from "../utils/paths.js";

const router = Router();

// GET /api/mcp/servers — List all MCP servers
router.get("/servers", (_req, res) => {
  const servers = mcpStore.getAllServers();
  return res.json(servers);
});

// GET /api/mcp/servers/:id — Get single server
router.get("/servers/:id", (req, res) => {
  const server = mcpStore.getServer(req.params.id);
  if (!server) return res.status(404).json({ error: "MCP server not found" });
  return res.json(server);
});

// POST /api/mcp/servers — Create/upsert MCP server
router.post("/servers", (req, res) => {
  const { name, enabledApps, spec, configType, rawConfig } = req.body;
  if (!name || !spec) {
    return res.status(400).json({ error: "name and spec are required" });
  }
  const server = mcpStore.createServer({ name, enabledApps, spec, configType, rawConfig });
  return res.status(201).json(server);
});

// PUT /api/mcp/servers/:id — Update server
router.put("/servers/:id", (req, res) => {
  const server = mcpStore.updateServer(req.params.id, req.body);
  if (!server) return res.status(404).json({ error: "MCP server not found" });
  return res.json(server);
});

// DELETE /api/mcp/servers/:id — Delete server
router.delete("/servers/:id", (req, res) => {
  const ok = mcpStore.deleteServer(req.params.id);
  if (!ok) return res.status(404).json({ error: "MCP server not found" });
  return res.json({ success: true });
});

// POST /api/mcp/servers/:id/toggle — Toggle app enablement
router.post("/servers/:id/toggle", (req, res) => {
  const { app, enabled } = req.body;
  if (!app || typeof enabled !== "boolean") {
    return res.status(400).json({ error: "app and enabled are required" });
  }
  const server = mcpStore.toggleApp(req.params.id, app as AppId, enabled);
  if (!server) return res.status(404).json({ error: "MCP server not found" });
  return res.json(server);
});

// POST /api/mcp/import — Import MCP servers from apps
router.post("/import", (req, res) => {
  const { apps } = req.body;
  const result = mcpStore.importFromApps(apps);
  return res.json(result);
});

// POST /api/mcp/validate/toml — Validate TOML config
router.post("/validate/toml", (req, res) => {
  const { config } = req.body;
  if (!config) {
    return res.status(400).json({ error: "config is required" });
  }
  const result = mcpStore.validateTomlConfig(config);
  return res.json(result);
});

// GET /api/mcp/status — MCP status overview
router.get("/status", (_req, res) => {
  const status = mcpStore.getMcpStatus();
  return res.json(status);
});

export default router;
