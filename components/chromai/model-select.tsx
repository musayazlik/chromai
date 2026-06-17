"use client";

import { Icon } from "@iconify/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { FREE_MODELS, PAID_MODELS, type AIModel } from "@/lib/models";

function ModelLogo({ model, size = 22 }: { model: AIModel; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[7px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
      style={{ width: size, height: size, background: model.gradient }}
    >
      <Icon icon={model.icon} width={size * 0.55} height={size * 0.55} />
    </span>
  );
}

export function ModelSelect({
  value,
  onChange,
  hasApiKey = false,
}: {
  value: AIModel;
  onChange: (model: AIModel) => void;
  hasApiKey?: boolean;
}) {
  const { t } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-2.5 py-[7px] text-[13px] font-medium text-text transition-colors hover:bg-accent data-[state=open]:[&_.chev]:rotate-180"
        >
          <ModelLogo model={value} />
          <span>{value.name}</span>
          <Icon
            icon="lucide:chevron-down"
            className="chev text-text-mute transition-transform duration-200"
            width={15}
            height={15}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[280px] rounded-[15px] p-1.5 shadow-[0_16px_44px_rgba(30,40,70,0.18)]"
      >
        {/* Free Models */}
        <DropdownMenuLabel className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-text-mute">
          {t.composer.freeModels}
        </DropdownMenuLabel>

        {FREE_MODELS.map((model) => {
          const selected = model.id === value.id;
          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => onChange(model)}
              className={cn(
                "flex items-center gap-2.5 rounded-[11px] px-2.5 py-2.5 cursor-pointer",
                selected
                  ? "bg-primary/10 text-primary"
                  : "text-text hover:bg-accent",
              )}
            >
              <ModelLogo model={model} />
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="text-[13.5px] font-semibold">
                  {model.name}
                </span>
                <span className="text-[11.5px] text-text-mute">
                  {t.models[model.descKey]}
                </span>
              </span>
              {selected && (
                <Icon
                  icon="lucide:check"
                  className="ml-auto shrink-0 text-primary"
                  width={16}
                  height={16}
                />
              )}
            </DropdownMenuItem>
          );
        })}

        {/* Divider */}
        <div className="my-1.5 border-t border-border" />

        {/* Premium Models */}
        <DropdownMenuLabel className="px-2.5 pb-1 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-text-mute">
          {hasApiKey ? t.composer.premiumModels : t.composer.lockedModels}
        </DropdownMenuLabel>

        {PAID_MODELS.map((model) => {
          const selected = model.id === value.id;
          const locked = !hasApiKey;
          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => !locked && onChange(model)}
              disabled={locked}
              className={cn(
                "flex items-center gap-2.5 rounded-[11px] px-2.5 py-2.5",
                locked
                  ? "cursor-not-allowed opacity-50"
                  : selected
                    ? "cursor-pointer bg-primary/10 text-primary"
                    : "cursor-pointer text-text hover:bg-accent",
              )}
            >
              <ModelLogo model={model} />
              <span className="flex flex-col gap-0.5 leading-none">
                <span
                  className={cn(
                    "text-[13.5px] font-semibold",
                    locked && "text-text-mute",
                  )}
                >
                  {model.name}
                </span>
                <span className="text-[11.5px] text-text-mute">
                  {locked ? t.composer.addKeyToUse : t.models[model.descKey]}
                </span>
              </span>
              {selected && !locked && (
                <Icon
                  icon="lucide:check"
                  className="ml-auto shrink-0 text-primary"
                  width={16}
                  height={16}
                />
              )}
              {locked && (
                <Icon
                  icon="lucide:lock"
                  className="ml-auto shrink-0 text-text-mute"
                  width={14}
                  height={14}
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
