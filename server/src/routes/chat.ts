import { Router } from "express";
import * as store from "../services/providerStore.js";
import { proxyChatCompletion } from "../services/chatProxy.js";

const router = Router();

// POST streaming chat completion
router.post("/completions", async (req, res) => {
  const { providerId, model, messages, systemPrompt } = req.body;

  if (!providerId || !messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing required fields: providerId, messages" });
    return;
  }

  const provider = store.getProvider(providerId);
  if (!provider) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }

  await proxyChatCompletion(
    provider,
    { providerId, model: model || provider.model, messages, systemPrompt, stream: true },
    res,
  );
});

export default router;
