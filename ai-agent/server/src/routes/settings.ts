import { Router } from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../../data/settings.json");

function readSettings(): Record<string, unknown> {
  if (!existsSync(FILE)) {
    const defaults = { theme: "system", activeProviderId: null };
    writeFileSync(FILE, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }
  return JSON.parse(readFileSync(FILE, "utf-8"));
}

const router = Router();

router.get("/", (_req, res) => {
  res.json(readSettings());
});

router.put("/", (req, res) => {
  const current = readSettings();
  const updated = { ...current, ...req.body };
  writeFileSync(FILE, JSON.stringify(updated, null, 2), "utf-8");
  res.json(updated);
});

export default router;
