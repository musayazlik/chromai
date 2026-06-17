"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  getApiKey,
  saveApiKey,
  clearApiKey,
  isValidApiKeyFormat,
} from "@/lib/api-key";
import { useI18n } from "@/lib/i18n/provider";

interface ApiKeyDialogProps {
  onKeyChange?: (hasKey: boolean) => void;
}

export function ApiKeyDialog({ onKeyChange }: ApiKeyDialogProps) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load stored key on mount (client-only)
  useEffect(() => {
    const existing = getApiKey();
    if (existing) {
      requestAnimationFrame(() => {
        setKey(existing);
        setSaved(true);
        onKeyChange?.(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      clearApiKey();
      setSaved(false);
      setError(false);
      onKeyChange?.(false);
      setOpen(false);
      return;
    }
    if (!isValidApiKeyFormat(trimmed)) {
      setError(true);
      return;
    }
    saveApiKey(trimmed);
    setSaved(true);
    setError(false);
    onKeyChange?.(true);
    setOpen(false);
  };

  const handleClear = () => {
    clearApiKey();
    setKey("");
    setSaved(false);
    setError(false);
    onKeyChange?.(false);
  };

  const t = labels[locale];

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-medium transition-colors",
          saved
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
            : "border-border bg-secondary text-text hover:bg-accent",
        )}
      >
        <Icon
          icon={saved ? "lucide:shield-check" : "lucide:key-round"}
          width={15}
          height={15}
          className={saved ? "" : "text-text-mute"}
        />
        <span>{saved ? t.keyActive : t.addKey}</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-[340px] origin-bottom-right">
          <div className="rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-[0_20px_50px_rgba(30,40,70,0.22)]">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon icon="lucide:key-round" width={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">{t.title}</p>
                <p className="truncate text-xs text-text-mute">{t.subtitle}</p>
              </div>
            </div>

            {/* Input */}
            <div className="relative mt-3.5">
              <input
                ref={inputRef}
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  if (error) setError(false);
                  if (saved) setSaved(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder={t.placeholder}
                className={cn(
                  "w-full rounded-xl border bg-secondary px-3 py-2.5 pr-10 text-sm text-text transition-colors",
                  "placeholder:text-text-mute focus:outline-none focus:ring-2",
                  error
                    ? "border-destructive/50 focus:border-destructive focus:ring-destructive/15"
                    : "border-border focus:border-primary focus:ring-primary/15",
                )}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-text-mute transition-colors hover:text-text"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                <Icon
                  icon={showKey ? "lucide:eye-off" : "lucide:eye"}
                  width={16}
                />
              </button>
            </div>

            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                <Icon
                  icon="lucide:alert-circle"
                  width={13}
                  className="shrink-0"
                />
                {t.invalid}
              </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!key.trim()}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon="lucide:check" width={15} />
                {t.save}
              </button>
              {saved && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-mute transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Clear key"
                >
                  <Icon icon="lucide:trash-2" width={15} />
                </button>
              )}
            </div>

            {/* Security note */}
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/70 p-2.5">
              <Icon
                icon="lucide:shield-check"
                width={14}
                className="mt-px shrink-0 text-primary"
              />
              <p className="text-[11.5px] leading-relaxed text-text-mute">
                {t.security}
              </p>
            </div>

            {/* Footer hints */}
            <p className="mt-2.5 text-center text-[11px] text-text-mute">
              {t.hint}
            </p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              {t.getKey}
              <Icon icon="lucide:external-link" width={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const labels = {
  tr: {
    addKey: "API Key Ekle",
    keyActive: "API Key Aktif",
    title: "OpenRouter API Key",
    subtitle: "Premium modellerin kilidini aç",
    placeholder: "sk-or-...",
    save: "Kaydet",
    invalid: "Geçersiz format. 'sk-or-' ile başlamalı.",
    security:
      "Anahtarınız yalnızca tarayıcınızda şifreli olarak saklanır — hiçbir sunucuya gönderilmez.",
    hint: "Ücretsiz modeller key gerektirmez · premium için gereklidir",
    getKey: "OpenRouter'dan key al",
  },
  en: {
    addKey: "Add API Key",
    keyActive: "API Key Active",
    title: "OpenRouter API Key",
    subtitle: "Unlock premium models",
    placeholder: "sk-or-...",
    save: "Save",
    invalid: "Invalid format. Must start with 'sk-or-'.",
    security:
      "Your key is stored encrypted in your browser only — never sent to any server.",
    hint: "Free models need no key · required for premium",
    getKey: "Get a key from OpenRouter",
  },
  de: {
    addKey: "API-Key hinzufügen",
    keyActive: "API-Key aktiv",
    title: "OpenRouter API-Key",
    subtitle: "Premium-Modelle freischalten",
    placeholder: "sk-or-...",
    save: "Speichern",
    invalid: "Ungültiges Format. Muss mit 'sk-or-' beginnen.",
    security:
      "Ihr Schlüssel wird nur verschlüsselt im Browser gespeichert — nie an einen Server gesendet.",
    hint: "Kostenlose Modelle brauchen keinen Key · für Premium erforderlich",
    getKey: "Key bei OpenRouter holen",
  },
} as const;
