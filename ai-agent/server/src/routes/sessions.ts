import { Router } from "express";
import * as sessionStore from "../services/sessionStore.js";
import type { AppId } from "../utils/paths.js";

const router = Router();

// GET /api/sessions?app=claude
router.get("/", (req, res) => {
  const app = req.query.app as AppId | undefined;
  const sessions = sessionStore.listSessions(app);
  return res.json(sessions);
});

// POST /api/sessions/search
router.post("/search", (req, res) => {
  const { query, app } = req.body;
  if (!query) return res.status(400).json({ error: "query is required" });
  const results = sessionStore.searchSessions(query, app);
  return res.json(results);
});

// GET /api/sessions/:app/:sourcePath/messages
router.get("/:app/:sourcePath/messages", (req, res) => {
  const { app, sourcePath } = req.params;
  const messages = sessionStore.getSessionMessages(app as AppId, sourcePath);
  return res.json(messages);
});

// POST /api/sessions/delete-batch
router.post("/delete-batch", (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "items array is required" });
  }
  const results = sessionStore.deleteSessionBatched(items);
  return res.json(results);
});

export default router;
