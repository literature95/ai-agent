import type { Provider, Conversation, ChatMessage, FetchedModel } from "@/types";

export interface TestResult {
  success: boolean;
  latencyMs: number;
  error?: string;
}

export interface FetchModelsResult {
  models: FetchedModel[];
}
