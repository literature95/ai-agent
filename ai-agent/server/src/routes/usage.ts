import { Router } from "express";

const router = Router();

// GET /api/usage/summary?startDate=&endDate=&appType=
router.get("/summary", (req, res) => {
  // Usage data would be stored in ~/.ai-agent/usage/
  // For now, return placeholder structure
  return res.json({
    totalRequests: 0,
    totalCost: 0,
    totalTokens: { input: 0, output: 0, total: 0 },
    successRate: 100,
    periodStart: Number(req.query.startDate) || Date.now() - 86400000,
    periodEnd: Number(req.query.endDate) || Date.now(),
  });
});

// GET /api/usage/trends
router.get("/trends", (_req, res) => res.json([]));

// GET /api/usage/providers
router.get("/providers", (_req, res) => res.json([]));

// GET /api/usage/models
router.get("/models", (_req, res) => res.json([]));

// GET /api/usage/logs
router.get("/logs", (_req, res) => res.json({ logs: [], total: 0, page: 1, pageSize: 20 }));

// GET /api/usage/pricing
router.get("/pricing", (_req, res) => res.json([]));

export default router;
