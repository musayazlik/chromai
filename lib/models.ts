export interface AIModel {
  /** OpenRouter model slug, e.g. "anthropic/claude-sonnet-4-5" */
  id: string;
  name: string;
  /** i18n key into messages.models for the short description */
  descKey: string;
  /** CSS gradient used for the model logo chip */
  gradient: string;
  /** Iconify icon name shown inside the logo chip */
  icon: string;
  /** Whether this model requires an OpenRouter API key */
  requiresKey: boolean;
}

// ── Ücretsiz Modeller (API Key gerekmez) ───────────────────────────────────
export const FREE_MODELS: AIModel[] = [
  {
    id: "google/gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    descKey: "freeGoogle",
    gradient: "linear-gradient(135deg,#4285f4,#9b72cb)",
    icon: "simple-icons:googlegemini",
    requiresKey: false,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    descKey: "freeOpenai",
    gradient: "linear-gradient(135deg,#10a37f,#0d8a6b)",
    icon: "simple-icons:openai",
    requiresKey: false,
  },
  {
    id: "minimax/minimax-m2.7",
    name: "MiniMax M2.7",
    descKey: "freeMinimax",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    icon: "simple-icons:minimax",
    requiresKey: false,
  },
  {
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    descKey: "freeDeepseek",
    gradient: "linear-gradient(135deg,#2dd4bf,#3b82f6)",
    icon: "simple-icons:deepseek",
    requiresKey: false,
  },
  {
    id: "xiaomi/mimo-v2.5",
    name: "MiMo V2.5",
    descKey: "freeXiaomi",
    gradient: "linear-gradient(135deg,#ff6b00,#ff8c42)",
    icon: "simple-icons:xiaomi",
    requiresKey: false,
  },
];

// ── Ücretli Modeller (OpenRouter API Key gerekir) ───────────────────────────
export const PAID_MODELS: AIModel[] = [
  {
    id: "minimax/minimax-m3",
    name: "MiniMax M3",
    descKey: "minimax",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    icon: "simple-icons:minimax",
    requiresKey: true,
  },
  {
    id: "xiaomi/mimo-v2.5-pro",
    name: "MiMo V2.5 Pro",
    descKey: "xiaomi",
    gradient: "linear-gradient(135deg,#ff6b00,#ff8c42)",
    icon: "simple-icons:xiaomi",
    requiresKey: true,
  },
  {
    id: "anthropic/claude-opus-4-8",
    name: "Claude Opus 4.8",
    descKey: "strongest",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    icon: "simple-icons:anthropic",
    requiresKey: true,
  },
  {
    id: "openai/gpt-5.5",
    name: "GPT-5.5",
    descKey: "openai",
    gradient: "linear-gradient(135deg,#10a37f,#0d8a6b)",
    icon: "simple-icons:openai",
    requiresKey: true,
  },
  {
    id: "google/gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    descKey: "googleFast",
    gradient: "linear-gradient(135deg,#4285f4,#9b72cb)",
    icon: "simple-icons:googlegemini",
    requiresKey: true,
  },
  {
    id: "moonshotai/kimi-k2.6",
    name: "Kimi K2.6",
    descKey: "kimiGeneral",
    gradient: "linear-gradient(135deg,#0284c7,#7c3aed)",
    icon: "ph:moon-stars-bold",
    requiresKey: true,
  },
];

// ── Tüm Modeller (Key varsa tümü, yoksa sadece ücretsizler) ─────────────────
export const MODELS: AIModel[] = [...FREE_MODELS, ...PAID_MODELS];

export const DEFAULT_MODEL = FREE_MODELS[0];

export function findModel(id: string): AIModel {
  return MODELS.find((m) => m.id === id) ?? DEFAULT_MODEL;
}

/** Returns available models based on API key presence */
export function getAvailableModels(hasApiKey: boolean): AIModel[] {
  return hasApiKey ? MODELS : FREE_MODELS;
}
