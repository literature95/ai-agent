import { Router } from "express";
import * as promptStore from "../services/promptStore.js";
import type { AppId } from "../utils/paths.js";

const router = Router();

// GET /api/prompts?app=claude — List all prompts for an app
router.get("/", (req, res) => {
  const app = req.query.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Query parameter 'app' is required" });
  }
  const prompts = promptStore.getAllPrompts(app);
  const result: Record<string, unknown> = {};
  prompts.forEach((p) => { result[p.id] = p; });
  return res.json(result);
});

// GET /api/prompts/current-file?app=claude — Read current CLAUDE.md etc.
router.get("/current-file", (req, res) => {
  const app = req.query.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Query parameter 'app' is required" });
  }
  const content = promptStore.getCurrentPromptFile(app);
  return res.json({ content });
});

// GET /api/prompts/:id?app=claude — Get single prompt
router.get("/:id", (req, res) => {
  const app = req.query.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Query parameter 'app' is required" });
  }
  const prompt = promptStore.getPrompt(app, req.params.id);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  return res.json(prompt);
});

// POST /api/prompts — Create/upsert prompt
router.post("/", (req, res) => {
  const { app, id, name, content, description } = req.body;
  if (!app || !name || content === undefined) {
    return res.status(400).json({ error: "app, name, and content are required" });
  }
  if (id) {
    const prompt = promptStore.upsertPrompt({ id, app, name, content, description, enabled: false });
    return res.status(200).json(prompt);
  }
  const prompt = promptStore.createPrompt({ app, name, content, description, enabled: false });
  return res.status(201).json(prompt);
});

// PUT /api/prompts/:id?app=claude — Update prompt
router.put("/:id", (req, res) => {
  const app = req.query.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Query parameter 'app' is required" });
  }
  const prompt = promptStore.updatePrompt(app, req.params.id, req.body);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  return res.json(prompt);
});

// DELETE /api/prompts/:id?app=claude — Delete prompt
router.delete("/:id", (req, res) => {
  const app = req.query.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Query parameter 'app' is required" });
  }
  const ok = promptStore.deletePrompt(app, req.params.id);
  if (!ok) return res.status(404).json({ error: "Prompt not found" });
  return res.json({ success: true });
});

// POST /api/prompts/:id/enable — Enable prompt for app (disables others)
router.post("/:id/enable", (req, res) => {
  const app = req.body.app as AppId | undefined;
  if (!app) {
    return res.status(400).json({ error: "Field 'app' is required in body" });
  }
  const prompt = promptStore.enablePrompt(app, req.params.id);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  return res.json(prompt);
});

// POST /api/prompts/import — Import from file
router.post("/import", (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: "filePath is required" });
  }
  const result = promptStore.importPromptFromFile(filePath);
  if (!result) return res.status(404).json({ error: "File not found or unreadable" });
  return res.json(result);
});

export default router;
