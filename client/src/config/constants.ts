import type { ApiFormat } from "@/types";

export const API_FORMATS: { value: ApiFormat; label: string; description: string }[] = [
  {
    value: "openai",
    label: "OpenAI",
    description: "OpenAI Chat Completions API (also works for most OpenAI-compatible providers)",
  },
  {
    value: "anthropic",
    label: "Anthropic",
    description: "Anthropic Messages API (x-api-key header, anthropic-version)",
  },
  {
    value: "openai-compatible",
    label: "OpenAI Compatible",
    description: "OpenAI-compatible API format (custom base URL with /v1/chat/completions)",
  },
];

export const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant.";
