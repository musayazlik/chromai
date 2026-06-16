import type { Locale } from "./i18n/config";
import type { Palette } from "./types";

/**
 * Requests palettes from the OpenRouter-backed API route.
 * Throws on any failure (no key, network, bad shape); the caller decides how
 * to fall back. Timing / fallback are handled by the generator so it can use
 * the locale-specific palette library.
 */
export async function requestPalettes(
  prompt: string,
  model: string,
  locale: Locale,
): Promise<Palette[]> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model, locale }),
  });
  if (!res.ok) throw new Error("request-failed");

  const data = (await res.json()) as { palettes?: Palette[] };
  if (!Array.isArray(data.palettes) || data.palettes.length === 0) {
    throw new Error("empty");
  }
  return data.palettes;
}
