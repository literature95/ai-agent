export type ApiFormat = "openai" | "anthropic" | "openai-compatible";

export interface Provider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  apiFormat: ApiFormat;
  websiteUrl?: string;
  notes?: string;
  icon?: string;
  iconColor?: string;
  createdAt: number;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  providerId: string;
  model: string;
  systemPrompt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  activeProviderId: string | null;
}

export interface FetchedModel {
  id: string;
  ownedBy: string | null;
}
