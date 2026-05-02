import { Router } from "express";
import type { DeepLinkImportRequest, ImportResult } from "../types/migrated.js";

const router = Router();

// POST /api/deeplink/parse — Parse a deeplink URL
router.post("/parse", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  try {
    const parsed = new URL(url);
    const resourceType = parsed.hostname as string;
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((v, k) => { params[k] = v; });

    const request: DeepLinkImportRequest = {
      resourceType: resourceType as DeepLinkImportRequest["resourceType"],
      app: params.app as DeepLinkImportRequest["app"],
      name: params.name,
      repo: params.repo,
      directory: params.directory,
      branch: params.branch,
      url: url,
    };

    return res.json(request);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }
});

// POST /api/deeplink/import — Import from a deeplink request
router.post("/import", (req, res) => {
  const { request } = req.body;
  if (!request) return res.status(400).json({ error: "request is required" });

  const result: ImportResult = { type: "error", message: `Import of type '${request.resourceType}' not yet implemented` };
  return res.json(result);
});

export default router;
