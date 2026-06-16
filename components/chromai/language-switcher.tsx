"use client";

import { Icon } from "@iconify/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const active = LOCALE_META[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t.actions.language}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-2.5 py-2 text-text-dim transition-colors duration-200 hover:bg-accent hover:text-text"
        >
          <Icon icon={active.flag} width={18} height={18} className="rounded-full" />
          <span className="text-[13px] font-medium uppercase">{locale}</span>
          <Icon
            icon="lucide:chevron-down"
            width={14}
            height={14}
            className="text-text-mute"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[170px] rounded-[14px] p-1.5"
      >
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const selected = code === locale;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setLocale(code)}
              className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2"
            >
              <Icon
                icon={meta.flag}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-[13.5px] font-medium">{meta.label}</span>
              {selected && (
                <Icon
                  icon="lucide:check"
                  width={15}
                  height={15}
                  className="ml-auto text-primary"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
