import type { ApiFormat } from "@/types";

export interface ProviderPreset {
  name: string;
  baseUrl: string;
  apiFormat: ApiFormat;
  defaultModel?: string;
  websiteUrl?: string;
  apiKeyUrl?: string;
  icon?: string;
  iconColor?: string;
}

export const providerPresets: ProviderPreset[] = [
  {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiFormat: "openai",
    defaultModel: "gpt-4o",
    websiteUrl: "https://platform.openai.com",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    icon: "openai",
    iconColor: "#10A37F",
  },
  {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiFormat: "anthropic",
    defaultModel: "claude-sonnet-4-20250514",
    websiteUrl: "https://console.anthropic.com",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    icon: "anthropic",
    iconColor: "#D4915D",
  },
  {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    apiFormat: "openai-compatible",
    defaultModel: "deepseek-chat",
    websiteUrl: "https://platform.deepseek.com",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
    icon: "deepseek",
    iconColor: "#1E88E5",
  },
  {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiFormat: "openai-compatible",
    defaultModel: "openai/gpt-4o",
    websiteUrl: "https://openrouter.ai",
    apiKeyUrl: "https://openrouter.ai/keys",
    icon: "openrouter",
    iconColor: "#6566F1",
  },
  {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiFormat: "openai-compatible",
    defaultModel: "llama-3.3-70b-versatile",
    websiteUrl: "https://console.groq.com",
    apiKeyUrl: "https://console.groq.com/keys",
    icon: "groq",
    iconColor: "#F55036",
  },
  {
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    apiFormat: "openai-compatible",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    websiteUrl: "https://together.ai",
    apiKeyUrl: "https://api.together.ai/settings/api-keys",
    icon: "together",
    iconColor: "#0F6FFF",
  },
  {
    name: "Ollama (Local)",
    baseUrl: "http://localhost:11434/v1",
    apiFormat: "openai-compatible",
    defaultModel: "llama3.2",
    websiteUrl: "https://ollama.com",
    icon: "ollama",
    iconColor: "#000000",
  },
  {
    name: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiFormat: "openai-compatible",
    defaultModel: "gemini-2.5-flash",
    websiteUrl: "https://aistudio.google.com",
    apiKeyUrl: "https://aistudio.google.com/apikey",
    icon: "google",
    iconColor: "#4285F4",
  },
  {
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    apiFormat: "openai-compatible",
    defaultModel: "mistral-large-latest",
    websiteUrl: "https://console.mistral.ai",
    apiKeyUrl: "https://console.mistral.ai/api-keys",
    icon: "mistral",
    iconColor: "#F26522",
  },
  {
    name: "xAI (Grok)",
    baseUrl: "https://api.x.ai/v1",
    apiFormat: "openai-compatible",
    defaultModel: "grok-3",
    websiteUrl: "https://x.ai",
    apiKeyUrl: "https://console.x.ai",
    icon: "xai",
    iconColor: "#FFFFFF",
  },
  {
    name: "Custom",
    baseUrl: "",
    apiFormat: "openai-compatible",
    defaultModel: "",
    icon: "custom",
    iconColor: "#6B7280",
  },
];
