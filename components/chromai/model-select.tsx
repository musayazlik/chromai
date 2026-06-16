"use client";

import { Icon } from "@iconify/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/provider";
import { MODELS, type AIModel } from "@/lib/models";

function ModelLogo({
  model,
  size = 22,
}: {
  model: AIModel;
  size?: number;
}) {
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
}: {
  value: AIModel;
  onChange: (model: AIModel) => void;
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
        className="w-[260px] rounded-[15px] p-1.5 shadow-[0_16px_44px_rgba(30,40,70,0.18)]"
      >
        <DropdownMenuLabel className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-text-mute">
          {t.composer.modelMenu}
        </DropdownMenuLabel>

        {MODELS.map((model) => {
          const selected = model.id === value.id;
          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => onChange(model)}
              className="flex items-center gap-2.5 rounded-[11px] px-2.5 py-2.5"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
