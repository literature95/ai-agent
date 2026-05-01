export function sseEvent(type: string, data: unknown): string {
  return `data: ${JSON.stringify({ type, ...(typeof data === "object" ? data : { content: data }) })}\n\n`;
}

export function sseDelta(content: string): string {
  return `data: ${JSON.stringify({ type: "delta", content })}\n\n`;
}

export function sseDone(usage?: { promptTokens?: number; completionTokens?: number }): string {
  return `data: ${JSON.stringify({ type: "done", usage })}\n\n`;
}

export function sseError(message: string): string {
  return `data: ${JSON.stringify({ type: "error", message })}\n\n`;
}
