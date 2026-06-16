"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeHex } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { Palette, PaletteColor } from "@/lib/types";

async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore clipboard errors (e.g. insecure context)
  }
  toast(message);
}

function Swatch({ color, accent }: { color: PaletteColor; accent: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const hex = normalizeHex(color.hex);

  function handleCopy() {
    copyText(hex, t.toast.hexCopied(hex));
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{ ["--a" as string]: accent }}
      className="group flex w-full items-center gap-3 rounded-[11px] px-1.5 py-2.5 text-left transition-[background,transform] duration-150 hover:translate-x-0.5 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--a)"
    >
      <span
        className="color-dot h-7 w-7 shrink-0 rounded-lg"
        style={{ background: hex }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold leading-tight">
          {color.name}
        </span>
        {color.role && (
          <span className="mt-px block text-[11px] text-text-mute">
            {color.role}
          </span>
        )}
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-mono text-[12.5px] font-semibold",
          copied ? "text-(--a)" : "text-text-dim",
        )}
      >
        {hex}
        <Icon
          icon={copied ? "lucide:check" : "lucide:copy"}
          className="opacity-40 transition-opacity group-hover:opacity-85"
          width={13}
          height={13}
        />
      </span>
    </button>
  );
}

export function PaletteCard({
  palette,
  index = 0,
}: {
  palette: Palette;
  index?: number;
}) {
  const { t } = useI18n();
  const a = normalizeHex(palette.colors[0]?.hex);
  const b = normalizeHex(palette.colors[1]?.hex);
  const gradientCss = `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;

  return (
    <article
      className="nm-card relative animate-rise overflow-hidden rounded-[26px] bg-surface px-5 pb-5 pt-[22px]"
      style={{
        ["--a" as string]: a,
        ["--b" as string]: b,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-mute">
        <span>{t.card.eyebrow}</span>
        <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--nm-dark),transparent)]" />
        <span>{t.card.colorsCount(palette.colors.length)}</span>
      </div>

      <h3 className="mt-[7px] font-display text-2xl font-bold leading-none tracking-[-0.02em]">
        {palette.name}
      </h3>
      <p className="mt-[5px] text-xs text-text-dim">{palette.subtitle}</p>

      <div className="grad-box relative mt-4 h-[104px] rounded-2xl">
        <span className="absolute left-[11px] top-[11px] rounded-full border border-white/40 bg-white/20 px-[9px] py-[5px] font-mono text-[10.5px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-[7px]">
          135°
        </span>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            copyText(`background: ${gradientCss};`, t.toast.cssCopied)
          }
          className="absolute bottom-[11px] right-[11px] h-auto gap-1.5 rounded-full bg-white/90 px-[11px] py-1.5 text-[11px] font-semibold text-[#2c303b] shadow-[0_3px_10px_rgba(0,0,0,0.18)] hover:bg-white hover:text-[#2c303b]"
        >
          <Icon icon="lucide:code-xml" width={13} height={13} />
          CSS
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-0.5">
        {palette.colors.map((color, i) => (
          <Swatch key={i} color={color} accent={i === 0 ? a : b} />
        ))}
      </div>

      <section className="glass-panel mt-4 rounded-2xl px-3.5 pb-[13px] pt-3.5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="grid h-[22px] w-[22px] place-items-center rounded-[7px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
            style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
          >
            <Icon icon="lucide:sparkles" width={12} height={12} />
          </span>
          <span className="text-[12.5px] font-semibold">
            {t.card.aiTitle}{" "}
            <span className="font-medium text-text-mute">· {t.card.aiTag}</span>
          </span>
        </div>
        <p className="text-xs leading-[1.55] text-text-dim">{palette.comment}</p>
        {palette.tags && palette.tags.length > 0 && (
          <div className="mt-[11px] flex flex-wrap gap-1.5">
            {palette.tags.slice(0, 3).map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-full border-border bg-card/70 px-[9px] py-1 text-[10.5px] font-semibold text-text-dim"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
