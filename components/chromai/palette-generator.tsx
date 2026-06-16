"use client";

import { useCallback, useRef, useState } from "react";

import { requestPalettes } from "@/lib/generate-client";
import { useI18n } from "@/lib/i18n/provider";
import { DEFAULT_MODEL, type AIModel } from "@/lib/models";
import type { Palette } from "@/lib/types";
import { Composer } from "./composer";
import { Loader } from "./loader";
import { PaletteCard } from "./palette-card";

interface PaletteItem {
  id: string;
  palette: Palette;
}

const wrap = (palettes: Palette[]): PaletteItem[] =>
  palettes.map((palette) => ({ id: crypto.randomUUID(), palette }));

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const pickThree = (library: Palette[]): Palette[] =>
  [...library]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((p) => ({ ...p, colors: p.colors.map((c) => ({ ...c })) }));

const MAX_RECENT = 6;

export function PaletteGenerator() {
  const { locale, t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<AIModel>(DEFAULT_MODEL);
  const [sampleItems, setSampleItems] = useState<PaletteItem[]>(() =>
    wrap(t.library.slice(0, 6)),
  );
  const [recentItems, setRecentItems] = useState<PaletteItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sub, setSub] = useState(t.results.subStart);
  const [prevLocale, setPrevLocale] = useState(locale);

  const busyRef = useRef(false);

  if (locale !== prevLocale) {
    setPrevLocale(locale);
    if (!hasGenerated) {
      setSampleItems(wrap(t.library.slice(0, 6)));
      setSub(t.results.subStart);
    }
  }

  const run = useCallback(async () => {
    if (busyRef.current) return;

    const query = prompt.trim();
    if (!query) {
      setShakeKey((k) => k + 1);
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setHasGenerated(true);
    setSub(t.results.subWorking(model.name));

    const minWait = wait(900);
    let palettes: Palette[];
    let usedFallback = false;
    try {
      const [result] = await Promise.all([
        requestPalettes(query, model.id, locale),
        minWait,
      ]);
      palettes = result;
    } catch {
      await minWait;
      palettes = pickThree(t.library);
      usedFallback = true;
    }

    setRecentItems((prev) => [...wrap(palettes), ...prev].slice(0, MAX_RECENT));
    setSub(
      usedFallback
        ? t.results.subFallback(palettes.length)
        : t.results.subAdded(palettes.length),
    );

    busyRef.current = false;
    setBusy(false);
  }, [prompt, model, locale, t]);

  return (
    <>
      <Composer
        prompt={prompt}
        onPromptChange={setPrompt}
        model={model}
        onModelChange={setModel}
        onGenerate={run}
        busy={busy}
        shakeKey={shakeKey}
      />

      {/* ── Son Oluşturulanlar ─────────────────────────────────────── */}
      {(busy || recentItems.length > 0) && (
        <section id="son-olusturulanlar" className="mt-[54px] scroll-mt-24">
          <div className="mb-[22px] flex items-baseline gap-3">
            <h2 className="font-display text-base font-semibold tracking-[-0.01em]">
              {t.results.titleRecent}
            </h2>
            <span className="text-[13px] text-text-mute">{sub}</span>
          </div>

          {busy && <Loader modelName={model.name} />}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-7">
            {recentItems.map((item, i) => (
              <PaletteCard key={item.id} palette={item.palette} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Paletler (örnek / kütüphane) ──────────────────────────── */}
      <section id="paletler" className="mt-[54px] scroll-mt-24">
        <div className="mb-[22px] flex items-baseline gap-3">
          <h2 className="font-display text-base font-semibold tracking-[-0.01em]">
            {t.results.title}
          </h2>
          {!hasGenerated && (
            <span className="text-[13px] text-text-mute">
              {t.results.subStart}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-7">
          {sampleItems.map((item, i) => (
            <PaletteCard key={item.id} palette={item.palette} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
