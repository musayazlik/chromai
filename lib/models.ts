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
}

export const MODELS: AIModel[] = [
  // ── Anthropic ──────────────────────────────────────────────────────────────
  {
    id: "anthropic/claude-opus-4-8",
    name: "Claude Opus 4.8",
    descKey: "strongest",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    icon: "simple-icons:anthropic",
  },
  {
    id: "anthropic/claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    descKey: "balanced",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    icon: "simple-icons:anthropic",
  },
  {
    id: "anthropic/claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    descKey: "fastest",
    gradient: "linear-gradient(135deg,#2dd4bf,#3b82f6)",
    icon: "simple-icons:anthropic",
  },
  // ── OpenAI ─────────────────────────────────────────────────────────────────
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    descKey: "openai",
    gradient: "linear-gradient(135deg,#10a37f,#0d8a6b)",
    icon: "simple-icons:openai",
  },
  // ── Google ─────────────────────────────────────────────────────────────────
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    descKey: "googleFast",
    gradient: "linear-gradient(135deg,#4285f4,#9b72cb)",
    icon: "simple-icons:googlegemini",
  },
  // ── MiniMax ────────────────────────────────────────────────────────────────
  {
    id: "minimax/minimax-m3",
    name: "MiniMax M3",
    descKey: "minimax",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    icon: "simple-icons:minimax",
  },
  // ── Moonshot / Kimi ────────────────────────────────────────────────────────
  {
    id: "moonshotai/kimi-k2.7-code",
    name: "Kimi K2.7 Code",
    descKey: "kimiCode",
    gradient: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
    icon: "ph:moon-stars-bold",
  },
  {
    id: "moonshotai/kimi-k2.6",
    name: "Kimi K2.6",
    descKey: "kimiGeneral",
    gradient: "linear-gradient(135deg,#0284c7,#7c3aed)",
    icon: "ph:moon-stars-bold",
  },
  // ── Meta ───────────────────────────────────────────────────────────────────
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    descKey: "openSource",
    gradient: "linear-gradient(135deg,#0668e1,#0a5fcc)",
    icon: "simple-icons:meta",
  },
  // ── DeepSeek ───────────────────────────────────────────────────────────────
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek",
    descKey: "value",
    gradient: "linear-gradient(135deg,#2dd4bf,#3b82f6)",
    icon: "simple-icons:deepseek",
  },
];

export const DEFAULT_MODEL = MODELS[0];

export function findModel(id: string): AIModel {
  return MODELS.find((m) => m.id === id) ?? DEFAULT_MODEL;
}
