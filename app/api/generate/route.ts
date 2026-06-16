import { NextResponse } from "next/server";

import { normalizeHex } from "@/lib/colors";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_LANGUAGE_NAME,
} from "@/lib/i18n/config";
import { findModel } from "@/lib/models";
import type { Palette } from "@/lib/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT =
  "You only return valid raw JSON. You never write markdown, code fences, or explanations.";

function buildUserPrompt(prompt: string, language: string): string {
  return `The user describes this atmosphere: "${prompt}".
Generate 3 different color palettes that fit this atmosphere. Each palette must contain EXACTLY 2 harmonious (analogous or pleasant) colors; avoid very high contrast.
Respond ONLY in this JSON format:
{"palettes":[{"name":"short palette name","subtitle":"short description (3-4 words)","colors":[{"name":"color name","hex":"#RRGGBB","role":"Primary"},{"name":"color name","hex":"#RRGGBB","role":"Accent"}],"comment":"1-2 sentence note on mood and usage","tags":["tag","tag","tag"]}]}
All text (name, subtitle, color names, roles, comment and tags) must be written in ${language}. Return JSON only.`;
}

/** Pull a JSON object/array out of an arbitrary model response string. */
function parseModelJson(raw: string): unknown {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("invalid-json");
  }
}

function coercePalettes(data: unknown): Palette[] {
  const rawList = Array.isArray(data)
    ? data
    : ((data as { palettes?: unknown[] })?.palettes ?? []);

  if (!Array.isArray(rawList)) return [];

  return rawList
    .filter(
      (p): p is Record<string, unknown> =>
        !!p &&
        typeof p === "object" &&
        Array.isArray((p as { colors?: unknown[] }).colors) &&
        (p as { colors: unknown[] }).colors.length >= 2,
    )
    .slice(0, 3)
    .map((p) => {
      const colors = (p.colors as Record<string, unknown>[])
        .slice(0, 2)
        .map((c) => ({
          name: String(c.name ?? "Renk"),
          hex: normalizeHex(c.hex as string),
          role: c.role ? String(c.role) : undefined,
        }));
      return {
        name: String(p.name ?? "Palet"),
        subtitle: String(p.subtitle ?? ""),
        colors,
        comment: String(p.comment ?? ""),
        tags: Array.isArray(p.tags)
          ? (p.tags as unknown[]).slice(0, 3).map(String)
          : [],
      } satisfies Palette;
    });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY tanımlı değil." },
      { status: 503 },
    );
  }

  let body: { prompt?: string; model?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "Boş istek." }, { status: 400 });
  }

  const model = findModel(body.model ?? "");
  const locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  const language = LOCALE_LANGUAGE_NAME[locale];

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Chromai",
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: 1000,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(prompt, language) },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "OpenRouter isteği başarısız.", detail },
        { status: 502 },
      );
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const palettes = coercePalettes(parseModelJson(content));

    if (!palettes.length) {
      return NextResponse.json(
        { error: "Model geçerli palet döndürmedi." },
        { status: 502 },
      );
    }

    return NextResponse.json({ palettes });
  } catch (err) {
    return NextResponse.json(
      { error: "Üretim sırasında hata oluştu.", detail: String(err) },
      { status: 500 },
    );
  }
}
