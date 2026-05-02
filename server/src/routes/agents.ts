import { Router } from "express";
import * as agentStore from "../services/agentStore.js";

const router = Router();

router.get("/", (_req, res) => res.json(agentStore.getAllAgents()));
router.get("/:id", (req, res) => {
  const agent = agentStore.getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  return res.json(agent);
});
router.post("/", (req, res) => {
  const { name, description, type, config } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const agent = agentStore.createAgent({ name, description, type: type || "custom", config: config || {} });
  return res.status(201).json(agent);
});
router.put("/:id", (req, res) => {
  const agent = agentStore.updateAgent(req.params.id, req.body);
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  return res.json(agent);
});
router.delete("/:id", (req, res) => {
  const ok = agentStore.deleteAgent(req.params.id);
  if (!ok) return res.status(404).json({ error: "Agent not found" });
  return res.json({ success: true });
});

export default router;
