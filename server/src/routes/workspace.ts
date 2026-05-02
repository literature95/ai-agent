import { Router } from "express";
import * as workspaceStore from "../services/workspaceStore.js";

const router = Router();

// GET /api/workspace/files/:filename — Read a workspace file
router.get("/files/:filename", (req, res) => {
  const content = workspaceStore.readWorkspaceFile(req.params.filename);
  if (content === null) {
    return res.status(404).json({ error: "File not found or invalid filename" });
  }
  return res.json({ content });
});

// POST /api/workspace/files/:filename — Write a workspace file
router.post("/files/:filename", (req, res) => {
  const { content } = req.body;
  if (content === undefined) {
    return res.status(400).json({ error: "content is required" });
  }
  const ok = workspaceStore.writeWorkspaceFile(req.params.filename, content);
  if (!ok) return res.status(400).json({ error: "Invalid filename" });
  return res.json({ success: true });
});

// GET /api/workspace/files — List all workspace files with existence status
router.get("/files", (_req, res) => {
  const status = workspaceStore.checkWorkspaceFiles();
  return res.json(status);
});

// GET /api/workspace/daily-memory — List daily memory files
router.get("/daily-memory", (_req, res) => {
  const files = workspaceStore.listDailyMemory();
  return res.json(files);
});

// GET /api/workspace/daily-memory/:filename — Read a daily memory file
router.get("/daily-memory/:filename", (req, res) => {
  const content = workspaceStore.readDailyMemory(req.params.filename);
  if (content === null) {
    return res.status(404).json({ error: "File not found" });
  }
  return res.json({ content });
});

// POST /api/workspace/daily-memory/:filename — Write/update daily memory
router.post("/daily-memory/:filename", (req, res) => {
  const { content } = req.body;
  if (content === undefined) {
    return res.status(400).json({ error: "content is required" });
  }
  workspaceStore.writeDailyMemory(req.params.filename, content);
  return res.json({ success: true });
});

// DELETE /api/workspace/daily-memory/:filename — Delete a daily memory file
router.delete("/daily-memory/:filename", (req, res) => {
  const ok = workspaceStore.deleteDailyMemory(req.params.filename);
  if (!ok) return res.status(404).json({ error: "File not found" });
  return res.json({ success: true });
});

// POST /api/workspace/daily-memory/search — Search daily memory files
router.post("/daily-memory/search", (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }
  const results = workspaceStore.searchDailyMemory(query);
  return res.json(results);
});

export default router;
