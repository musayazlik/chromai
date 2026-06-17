"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { AIModel } from "@/lib/models";
import { ModelSelect } from "./model-select";
import { ApiKeyDialog } from "./api-key-dialog";

export function Composer({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  onGenerate,
  busy,
  shakeKey,
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  model: AIModel;
  onModelChange: (model: AIModel) => void;
  onGenerate: () => void;
  busy: boolean;
  shakeKey: number;
}) {
  const { t } = useI18n();
  const composerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // re-trigger the shake animation whenever shakeKey changes (empty submit)
  useEffect(() => {
    if (shakeKey === 0) return;
    const el = composerRef.current;
    if (!el) return;
    el.classList.remove("animate-shake");
    void el.offsetWidth; // force reflow
    el.classList.add("animate-shake");
    textareaRef.current?.focus();
  }, [shakeKey]);

  // auto-grow the textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
  }, [prompt]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  }

  return (
    <div id="composer" className="mx-auto mt-9 max-w-[640px] scroll-mt-24">
      <div
        ref={composerRef}
        className="composer-card rounded-[22px] border border-border bg-(--surface-raised) px-4 pb-3 pt-4"
      >
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder={t.composer.placeholder}
          className="max-h-[220px] min-h-[96px] resize-none px-1 py-0.5 text-base font-medium leading-[1.55] text-text placeholder:text-text-mute"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <ModelSelect
              value={model}
              onChange={onModelChange}
              hasApiKey={hasApiKey}
            />
            <ApiKeyDialog onKeyChange={setHasApiKey} />
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={busy}
            className={cn(
              "gen-btn flex items-center gap-[7px] rounded-[13px] px-[19px] py-[11px] text-sm font-semibold text-white",
              "disabled:cursor-default disabled:opacity-65",
              "max-[520px]:w-full max-[520px]:justify-center",
            )}
          >
            <Icon
              icon={busy ? "lucide:loader-circle" : "lucide:sparkles"}
              className={cn(busy && "animate-spin")}
              width={16}
              height={16}
            />
            <span>{busy ? t.composer.generating : t.composer.generate}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
