import { apiFetchStream } from "./client";

export interface ChatCompletionRequest {
  providerId: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  systemPrompt?: string;
}

export function sendChatCompletion(request: ChatCompletionRequest): Promise<Response> {
  return apiFetchStream("/chat/completions", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export interface SSEEvent {
  type: "delta" | "done" | "error";
  content?: string;
  message?: string;
  usage?: { promptTokens?: number; completionTokens?: number };
}

export async function* parseSSEStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<SSEEvent> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          yield JSON.parse(line.slice(6));
        } catch {
          // skip
        }
      }
    }
  }
}
