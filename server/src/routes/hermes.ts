import { Router } from "express";
import * as hermesStore from "../services/hermesStore.js";
import type { HermesMemoryKind } from "../types/migrated.js";

const router = Router();

router.get("/memory", (req, res) => {
  const kind = (req.query.kind as HermesMemoryKind) || "memory";
  return res.json({ content: hermesStore.getMemory(kind) });
});
router.put("/memory", (req, res) => {
  const { kind, content } = req.body;
  if (!kind || content === undefined) {
    return res.status(400).json({ error: "kind and content are required" });
  }
  hermesStore.setMemory(kind, content);
  return res.json({ success: true });
});
router.get("/memory-limits", (_req, res) => res.json(hermesStore.getMemoryLimits()));
router.get("/memory-enabled", (req, res) => {
  const kind = (req.query.kind as HermesMemoryKind) || "memory";
  return res.json({ enabled: hermesStore.getMemoryEnabled(kind) });
});
router.put("/memory-enabled", (req, res) => {
  const { kind, enabled } = req.body;
  if (!kind || typeof enabled !== "boolean") {
    return res.status(400).json({ error: "kind and enabled are required" });
  }
  hermesStore.setMemoryEnabled(kind, enabled);
  return res.json({ success: true });
});

export default router;
