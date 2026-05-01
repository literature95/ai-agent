import type { Response } from "express";
import type { Provider, ChatCompletionRequest } from "../types/index.js";
import { sseDelta, sseDone, sseError } from "../utils/sse.js";

export async function proxyChatCompletion(
  provider: Provider,
  request: ChatCompletionRequest,
  res: Response,
): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const { apiFormat, baseUrl, apiKey } = provider;
  const model = request.model || provider.model;

  const messages = request.messages.map((m) => ({ role: m.role, content: m.content }));

  try {
    if (apiFormat === "anthropic") {
      await proxyAnthropic(baseUrl, apiKey, model, messages, request.systemPrompt, res);
    } else {
      // openai or openai-compatible
      await proxyOpenAI(baseUrl, apiKey, model, messages, request.systemPrompt, res);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.write(sseError(message));
    res.end();
  }
}

async function proxyOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string | undefined,
  res: Response,
): Promise<void> {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const msgs: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    msgs.push({ role: "system", content: systemPrompt });
  }
  msgs.push(...messages);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages: msgs, stream: true }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Provider error ${response.status}: ${text.slice(0, 300)}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    res.write(sseError("No response body"));
    res.end();
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") {
          res.write(sseDone());
          res.end();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(sseDelta(content));
          }
        } catch {
          // skip unparseable chunks
        }
      }
    }
    res.write(sseDone());
  } finally {
    reader.releaseLock();
    res.end();
  }
}

async function proxyAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string | undefined,
  res: Response,
): Promise<void> {
  const url = `${baseUrl.replace(/\/$/, "")}/messages`;

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: 8192,
    stream: true,
  };
  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Provider error ${response.status}: ${text.slice(0, 300)}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    res.write(sseError("No response body"));
    res.end();
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta") {
            const text = parsed.delta?.text;
            if (text) {
              res.write(sseDelta(text));
            }
          } else if (parsed.type === "message_stop") {
            res.write(sseDone());
            res.end();
            return;
          }
        } catch {
          // skip
        }
      }
    }
    res.write(sseDone());
  } finally {
    reader.releaseLock();
    res.end();
  }
}
