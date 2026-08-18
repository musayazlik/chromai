"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface ReadingProgressProps {
  targetId: string;
  locale: Locale;
}

const SHARE_LABELS: Record<Locale, { copied: string; copy: string; share: string }> = {
  tr: { copied: "Kopyalandı ✓", copy: "Bağlantıyı kopyala", share: "Paylaş" },
  en: { copied: "Copied ✓", copy: "Copy link", share: "Share" },
  de: { copied: "Kopiert ✓", copy: "Link kopieren", share: "Teilen" },
};

export function ReadingProgress({ targetId, locale }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const labels = SHARE_LABELS[locale] ?? SHARE_LABELS.en;

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 100 : 0);
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard engellenmiş olabilir; sessizce geç */
    }
  };

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 right-0 top-16 z-40 h-[3px] bg-transparent"
      >
        <div
          className="h-full bg-[var(--grad)] transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3.5 py-2 text-[12.5px] font-medium text-text-dim shadow-lg backdrop-blur transition-all hover:scale-[1.03] hover:text-text",
        )}
        aria-label={labels.copy}
      >
        {copied ? (
          <Icon icon="lucide:check" width={14} height={14} className="text-primary" />
        ) : (
          <Icon icon="lucide:link" width={14} height={14} />
        )}
        {copied ? labels.copied : labels.share}
      </button>
    </>
  );
}
