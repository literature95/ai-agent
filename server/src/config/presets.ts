// Provider presets for all supported AI coding assistants
// These define pre-configured API endpoints for popular AI providers

export interface PresetConfig {
  name: string;
  websiteUrl: string;
  apiKeyUrl?: string;
  settingsConfig: Record<string, unknown>;
  isOfficial?: boolean;
  isPartner?: boolean;
  category?: string;
  icon?: string;
  iconColor?: string;
}

// Claude (Anthropic API) presets
export const CLAUDE_PRESETS: PresetConfig[] = [
  {
    name: "Anthropic Official",
    websiteUrl: "https://console.anthropic.com",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.anthropic.com",
      apiFormat: "anthropic",
    },
    isOfficial: true,
    icon: "anthropic",
    iconColor: "#D4A574",
  },
  {
    name: "DeepSeek",
    websiteUrl: "https://platform.deepseek.com",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.deepseek.com/v1",
      apiFormat: "openai_chat",
    },
    icon: "deepseek",
    iconColor: "#4D6BFE",
  },
  {
    name: "OpenRouter",
    websiteUrl: "https://openrouter.ai",
    apiKeyUrl: "https://openrouter.ai/keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://openrouter.ai/api/v1",
      apiFormat: "openai_chat",
    },
    icon: "openrouter",
    iconColor: "#71717A",
  },
  {
    name: "SiliconFlow",
    websiteUrl: "https://siliconflow.cn",
    apiKeyUrl: "https://cloud.siliconflow.cn/account/ak",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.siliconflow.cn/v1",
      apiFormat: "openai_chat",
    },
    icon: "siliconflow",
    iconColor: "#7C3AED",
  },
  {
    name: "Zhipu AI (GLM)",
    websiteUrl: "https://open.bigmodel.cn",
    apiKeyUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://open.bigmodel.cn/api/paas/v4",
      apiFormat: "openai_chat",
    },
    icon: "zhipu",
    iconColor: "#3B82F6",
  },
  {
    name: "Moonshot (Kimi)",
    websiteUrl: "https://platform.moonshot.cn",
    apiKeyUrl: "https://platform.moonshot.cn/console/api-keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.moonshot.cn/v1",
      apiFormat: "openai_chat",
    },
    icon: "moonshot",
    iconColor: "#10B981",
  },
  {
    name: "Qwen (Tongyi)",
    websiteUrl: "https://tongyi.aliyun.com",
    apiKeyUrl: "https://dashscope.console.aliyun.com/apiKey",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      apiFormat: "openai_chat",
    },
    icon: "qwen",
    iconColor: "#6366F1",
  },
  {
    name: "Groq",
    websiteUrl: "https://groq.com",
    apiKeyUrl: "https://console.groq.com/keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.groq.com/openai/v1",
      apiFormat: "openai_chat",
    },
    icon: "groq",
    iconColor: "#F97316",
  },
  {
    name: "Together AI",
    websiteUrl: "https://together.ai",
    apiKeyUrl: "https://api.together.ai/settings/api-keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.together.xyz/v1",
      apiFormat: "openai_chat",
    },
    icon: "together",
    iconColor: "#0EA5E9",
  },
  {
    name: "xAI (Grok)",
    websiteUrl: "https://x.ai",
    apiKeyUrl: "https://console.x.ai",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.x.ai/v1",
      apiFormat: "openai_chat",
    },
    icon: "xai",
    iconColor: "#FFFFFF",
  },
  {
    name: "Google AI Studio",
    websiteUrl: "https://aistudio.google.com",
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
      apiFormat: "openai_chat",
    },
    icon: "google",
    iconColor: "#4285F4",
  },
  {
    name: "Mistral AI",
    websiteUrl: "https://mistral.ai",
    apiKeyUrl: "https://console.mistral.ai/api-keys",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "",
      ANTHROPIC_BASE_URL: "https://api.mistral.ai/v1",
      apiFormat: "openai_chat",
    },
    icon: "mistral",
    iconColor: "#F97316",
  },
  {
    name: "Ollama (Local)",
    websiteUrl: "https://ollama.com",
    settingsConfig: {
      ANTHROPIC_AUTH_TOKEN: "ollama",
      ANTHROPIC_BASE_URL: "http://localhost:11434/v1",
      apiFormat: "openai_chat",
    },
    icon: "ollama",
    iconColor: "#FFFFFF",
  },
];

// Codex (OpenAI API) presets
export const CODEX_PRESETS: PresetConfig[] = [
  {
    name: "OpenAI Official",
    websiteUrl: "https://platform.openai.com",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    settingsConfig: {
      OPENAI_API_KEY: "",
      OPENAI_BASE_URL: "https://api.openai.com/v1",
    },
    isOfficial: true,
    icon: "openai",
    iconColor: "#10A37F",
  },
  {
    name: "DeepSeek",
    websiteUrl: "https://platform.deepseek.com",
    settingsConfig: {
      OPENAI_API_KEY: "",
      OPENAI_BASE_URL: "https://api.deepseek.com/v1",
    },
    icon: "deepseek",
    iconColor: "#4D6BFE",
  },
  {
    name: "OpenRouter",
    websiteUrl: "https://openrouter.ai",
    settingsConfig: {
      OPENAI_API_KEY: "",
      OPENAI_BASE_URL: "https://openrouter.ai/api/v1",
    },
    icon: "openrouter",
    iconColor: "#71717A",
  },
  {
    name: "SiliconFlow",
    websiteUrl: "https://siliconflow.cn",
    settingsConfig: {
      OPENAI_API_KEY: "",
      OPENAI_BASE_URL: "https://api.siliconflow.cn/v1",
    },
    icon: "siliconflow",
    iconColor: "#7C3AED",
  },
  {
    name: "Groq",
    websiteUrl: "https://groq.com",
    settingsConfig: {
      OPENAI_API_KEY: "",
      OPENAI_BASE_URL: "https://api.groq.com/openai/v1",
    },
    icon: "groq",
    iconColor: "#F97316",
  },
];

// Gemini presets
export const GEMINI_PRESETS: PresetConfig[] = [
  {
    name: "Google Gemini Official",
    websiteUrl: "https://aistudio.google.com",
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    settingsConfig: {
      GEMINI_API_KEY: "",
      GOOGLE_GENERATIVE_AI_API_KEY: "",
    },
    isOfficial: true,
    icon: "google",
    iconColor: "#4285F4",
  },
  {
    name: "OpenRouter (Gemini)",
    websiteUrl: "https://openrouter.ai",
    settingsConfig: {
      GEMINI_API_KEY: "",
      GOOGLE_GENERATIVE_AI_API_KEY: "",
      OPENROUTER_API_KEY: "",
    },
    icon: "openrouter",
    iconColor: "#71717A",
  },
];

// OpenCode presets
export const OPENCODE_PRESETS: PresetConfig[] = [
  {
    name: "Anthropic (Claude)",
    websiteUrl: "https://console.anthropic.com",
    settingsConfig: {
      provider: "@anthropic-ai/sdk",
      model: "claude-sonnet-4-6",
      apiKey: "",
    },
    icon: "anthropic",
    iconColor: "#D4A574",
  },
  {
    name: "OpenAI",
    websiteUrl: "https://platform.openai.com",
    settingsConfig: {
      provider: "@ai-sdk/openai",
      model: "gpt-4o",
      apiKey: "",
    },
    icon: "openai",
    iconColor: "#10A37F",
  },
  {
    name: "DeepSeek",
    websiteUrl: "https://platform.deepseek.com",
    settingsConfig: {
      provider: "@ai-sdk/openai-compatible",
      model: "deepseek-chat",
      apiKey: "",
    },
    icon: "deepseek",
    iconColor: "#4D6BFE",
  },
  {
    name: "Google Gemini",
    websiteUrl: "https://aistudio.google.com",
    settingsConfig: {
      provider: "@ai-sdk/google",
      model: "gemini-2.5-flash",
      apiKey: "",
    },
    icon: "google",
    iconColor: "#4285F4",
  },
];

// OpenClaw presets
export const OPENCLAW_PRESETS: PresetConfig[] = [
  {
    name: "Anthropic (Claude)",
    websiteUrl: "https://console.anthropic.com",
    settingsConfig: {
      ANTHROPIC_API_KEY: "",
      primaryModel: "claude-sonnet-4-6",
    },
    icon: "anthropic",
    iconColor: "#D4A574",
  },
  {
    name: "OpenAI",
    websiteUrl: "https://platform.openai.com",
    settingsConfig: {
      OPENAI_API_KEY: "",
      primaryModel: "gpt-4o",
    },
    icon: "openai",
    iconColor: "#10A37F",
  },
  {
    name: "OpenRouter",
    websiteUrl: "https://openrouter.ai",
    settingsConfig: {
      OPENAI_API_KEY: "",
      primaryModel: "openai/gpt-4o",
    },
    icon: "openrouter",
    iconColor: "#71717A",
  },
];

// Hermes presets
export const HERMES_PRESETS: PresetConfig[] = [
  {
    name: "Anthropic (Claude)",
    websiteUrl: "https://console.anthropic.com",
    settingsConfig: {
      api_key: "",
      api_base: "https://api.anthropic.com",
      api_mode: "anthropic_messages",
      model: "claude-sonnet-4-6",
    },
    icon: "anthropic",
    iconColor: "#D4A574",
  },
  {
    name: "OpenAI",
    websiteUrl: "https://platform.openai.com",
    settingsConfig: {
      api_key: "",
      api_base: "https://api.openai.com/v1",
      api_mode: "chat_completions",
      model: "gpt-4o",
    },
    icon: "openai",
    iconColor: "#10A37F",
  },
  {
    name: "DeepSeek",
    websiteUrl: "https://platform.deepseek.com",
    settingsConfig: {
      api_key: "",
      api_base: "https://api.deepseek.com/v1",
      api_mode: "chat_completions",
      model: "deepseek-chat",
    },
    icon: "deepseek",
    iconColor: "#4D6BFE",
  },
];

// Universal/cross-app presets
export const UNIVERSAL_PRESETS: PresetConfig[] = [
  {
    name: "NewAPI",
    websiteUrl: "https://newapi.app",
    settingsConfig: {
      baseUrl: "https://api.newapi.app/v1",
      apiKey: "",
    },
    icon: "newapi",
    iconColor: "#8B5CF6",
  },
  {
    name: "n1n.ai",
    websiteUrl: "https://n1n.ai",
    settingsConfig: {
      baseUrl: "https://api.n1n.ai/v1",
      apiKey: "",
    },
    icon: "nin",
    iconColor: "#EC4899",
  },
];

export function getPresetsForApp(app: string): PresetConfig[] {
  switch (app) {
    case "claude": return CLAUDE_PRESETS;
    case "codex": return CODEX_PRESETS;
    case "gemini": return GEMINI_PRESETS;
    case "opencode": return OPENCODE_PRESETS;
    case "openclaw": return OPENCLAW_PRESETS;
    case "hermes": return HERMES_PRESETS;
    default: return [];
  }
}
