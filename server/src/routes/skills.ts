import { Router } from "express";
import * as skillStore from "../services/skillStore.js";
import type { AppId } from "../utils/paths.js";

const router = Router();

// GET /api/skills/installed
router.get("/installed", (_req, res) => res.json(skillStore.getInstalledSkills()));

// GET /api/skills/discover
router.get("/discover", (_req, res) => res.json(skillStore.discoverSkills()));

// POST /api/skills/install
router.post("/install", (req, res) => {
  const { skill, currentApp } = req.body;
  if (!skill || !currentApp) return res.status(400).json({ error: "skill and currentApp are required" });
  const installed = skillStore.installSkill(skill, currentApp as AppId);
  return res.status(201).json(installed);
});

// POST /api/skills/uninstall/:id
router.post("/uninstall/:id", (req, res) => {
  const result = skillStore.uninstallSkill(req.params.id);
  if (!result.success) return res.status(404).json({ error: "Skill not found" });
  return res.json(result);
});

// POST /api/skills/toggle/:id
router.post("/toggle/:id", (req, res) => {
  const { app, enabled } = req.body;
  if (!app || typeof enabled !== "boolean") return res.status(400).json({ error: "app and enabled are required" });
  const skill = skillStore.toggleSkillApp(req.params.id, app as AppId, enabled);
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  return res.json(skill);
});

// GET /api/skills/backups
router.get("/backups", (_req, res) => res.json(skillStore.getSkillBackups()));

// GET /api/skills/repos
router.get("/repos", (_req, res) => res.json(skillStore.getRepos()));

// POST /api/skills/repos
router.post("/repos", (req, res) => {
  const { owner, name, branch } = req.body;
  if (!owner || !name) return res.status(400).json({ error: "owner and name are required" });
  const repo = skillStore.addRepo({ owner, name, branch, addedAt: 0 });
  return res.status(201).json(repo);
});

// DELETE /api/skills/repos/:owner/:name
router.delete("/repos/:owner/:name", (req, res) => {
  const ok = skillStore.removeRepo(req.params.owner, req.params.name);
  if (!ok) return res.status(404).json({ error: "Repo not found" });
  return res.json({ success: true });
});

// GET /api/skills/search-sh?q=&limit=&offset=
router.get("/search-sh", (req, res) => {
  const { q, limit, offset } = req.query;
  if (!q) return res.status(400).json({ error: "q is required" });
  const result = skillStore.searchSkillsSh(String(q), Number(limit) || 20, Number(offset) || 0);
  return res.json(result);
});

export default router;
