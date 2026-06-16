"use client";

import { useI18n } from "@/lib/i18n/provider";

export function Loader({ modelName }: { modelName: string }) {
  const { t } = useI18n();
  // split the localized sentence around the model name to keep it emphasized
  const [before, after] = t.loader(modelName).split(modelName);

  return (
    <div className="flex animate-rise flex-col items-center gap-4 px-0 pb-[50px] pt-[46px] text-center">
      <div className="orb">
        <i />
      </div>
      <div className="flex items-center gap-px text-sm font-medium text-text-dim">
        <span>{before}</span>
        <b className="font-semibold text-text">{modelName}</b>
        <span>{after}</span>
        <span className="dots ml-1.5 inline-flex gap-1">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
