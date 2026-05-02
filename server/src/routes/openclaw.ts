import { Router } from "express";
import * as openclawStore from "../services/openclawStore.js";

const router = Router();

router.get("/agents/defaults", (_req, res) => res.json(openclawStore.getAgentsDefaults()));
router.put("/agents/defaults", (req, res) => {
  const result = openclawStore.setAgentsDefaults(req.body);
  return res.json(result);
});
router.get("/env", (_req, res) => res.json(openclawStore.getEnv()));
router.put("/env", (req, res) => {
  const result = openclawStore.setEnv(req.body);
  return res.json(result);
});
router.get("/tools", (_req, res) => res.json(openclawStore.getTools()));
router.put("/tools", (req, res) => {
  const result = openclawStore.setTools(req.body);
  return res.json(result);
});
router.post("/scan-health", (_req, res) => res.json(openclawStore.scanHealth()));

export default router;
