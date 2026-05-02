import { Router } from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";
import { PATHS } from "../utils/paths.js";

const DATA_DIR = PATHS.aiAgentData;
const FILE = join(DATA_DIR, "settings.json");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readSettings(): Record<string, unknown> {
  ensureDir();
  if (!existsSync(FILE)) {
    const defaults = {
      theme: "system",
      activeProviderId: null,
      language: "zh",
      enableLocalProxy: false,
      enableFailoverToggle: false,
      visibleApps: {
        claude: true, codex: true, gemini: true,
        opencode: true, openclaw: true, hermes: true,
      },
    };
    writeFileSync(FILE, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }
  return JSON.parse(readFileSync(FILE, "utf-8"));
}

function writeSettings(settings: Record<string, unknown>): void {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(settings, null, 2), "utf-8");
}

const router = Router();

// GET /api/settings
router.get("/", (_req, res) => {
  res.json(readSettings());
});

// PUT /api/settings
router.put("/", (req, res) => {
  const current = readSettings();
  const updated = { ...current, ...req.body };
  writeSettings(updated);
  res.json(updated);
});

// GET /api/settings/config-dirs — App config directories
router.get("/config-dirs", (_req, res) => {
  res.json({
    claude: PATHS.claudeConfig,
    codex: PATHS.codexConfig,
    gemini: PATHS.geminiConfig,
    opencode: PATHS.opencodeConfig,
    openclaw: PATHS.openclawConfig,
    hermes: PATHS.hermesConfig,
  });
});

// POST /api/settings/backup/create
router.post("/backup/create", (_req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${timestamp}.json`;
  const backupDir = join(DATA_DIR, "backups");
  if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });
  const settings = readSettings();
  writeFileSync(join(backupDir, filename), JSON.stringify(settings, null, 2), "utf-8");
  res.json({ filename });
});

// GET /api/settings/backup/list
router.get("/backup/list", (_req, res) => {
  const backupDir = join(DATA_DIR, "backups");
  if (!existsSync(backupDir)) return res.json([]);
  const files = readdirSync(backupDir).map((f: string) => ({
    filename: f,
    createdAt: statSync(join(backupDir, f)).birthtimeMs,
    size: statSync(join(backupDir, f)).size,
  }));
  res.json(files);
});

// POST /api/settings/backup/restore
router.post("/backup/restore", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "filename is required" });
  const backupDir = join(DATA_DIR, "backups");
  const fp = join(backupDir, filename);
  if (!existsSync(fp)) return res.status(404).json({ error: "Backup not found" });
  const restored = JSON.parse(readFileSync(fp, "utf-8"));
  writeSettings(restored);
  res.json({ success: true });
});

// DELETE /api/settings/backup/:filename
router.delete("/backup/:filename", (req, res) => {
  const backupDir = join(DATA_DIR, "backups");
  const fp = join(backupDir, req.params.filename);
  if (!existsSync(fp)) return res.status(404).json({ error: "Backup not found" });
  unlinkSync(fp);
  res.json({ success: true });
});

export default router;
