import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Conversation } from "../types/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../../data");
const FILE = join(DATA_DIR, "conversations.json");

function readConversations(): Conversation[] {
  if (!existsSync(FILE)) {
    writeFileSync(FILE, "[]", "utf-8");
    return [];
  }
  return JSON.parse(readFileSync(FILE, "utf-8"));
}

function writeConversations(convs: Conversation[]): void {
  writeFileSync(FILE, JSON.stringify(convs, null, 2), "utf-8");
}

const router = Router();

router.get("/", (_req, res) => {
  const convs = readConversations();
  convs.sort((a, b) => b.updatedAt - a.updatedAt);
  res.json(convs.map(({ messages, ...rest }) => ({ ...rest, messageCount: messages.length })));
});

router.get("/:id", (req, res) => {
  const conv = readConversations().find((c) => c.id === req.params.id);
  if (!conv) { res.status(404).json({ error: "Not found" }); return; }
  res.json(conv);
});

router.post("/", (req, res) => {
  const { title, providerId, model, systemPrompt } = req.body;
  const conv: Conversation = {
    id: uuidv4(),
    title: title || "New Chat",
    messages: [],
    providerId: providerId || "",
    model: model || "",
    systemPrompt: systemPrompt || "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const convs = readConversations();
  convs.push(conv);
  writeConversations(convs);
  res.status(201).json(conv);
});

router.put("/:id", (req, res) => {
  const convs = readConversations();
  const idx = convs.findIndex((c) => c.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  convs[idx] = { ...convs[idx], ...req.body, updatedAt: Date.now() };
  writeConversations(convs);
  res.json(convs[idx]);
});

router.delete("/:id", (req, res) => {
  const convs = readConversations();
  const filtered = convs.filter((c) => c.id !== req.params.id);
  if (filtered.length === convs.length) { res.status(404).json({ error: "Not found" }); return; }
  writeConversations(filtered);
  res.json({ success: true });
});

export default router;
