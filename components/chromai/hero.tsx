"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

import ChromaiLogo from "@/app/components/ChromaiLogo";
import { Particles } from "@/components/magicui/particles";
import { useI18n } from "@/lib/i18n/provider";

export function Hero() {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();
  // computed (not stateful) so there's no setState-in-effect; particles re-init
  // on color change via their own [color] effect.
  const particleColor = resolvedTheme === "dark" ? "#a78bfa" : "#7c3aed";

  return (
    <header className="relative mx-auto max-w-[720px] py-6 text-center">
      <Particles
        className="absolute inset-0 z-0"
        quantity={90}
        ease={70}
        size={0.7}
        staticity={40}
        color={particleColor}
      />

      <div className="relative z-10">
        {/* big animated logo showpiece */}
        <div className="relative mx-auto flex w-fit justify-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.22),transparent_70%)] blur-2xl"
          />
          <ChromaiLogo size={96} />
        </div>

        {/* badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--glass-bar-line) bg-(--glass-bar) px-3.5 py-1.5 text-[12.5px] font-medium text-text-dim shadow-[0_4px_14px_rgba(40,55,90,0.07)] backdrop-blur">
          <Icon
            icon="lucide:sparkles"
            className="text-primary"
            width={14}
            height={14}
          />
          {t.hero.badge}
        </div>

        <h1 className="mt-5 font-display text-[clamp(31px,5.4vw,47px)] font-bold leading-[1.06] tracking-tight">
          {t.hero.headlinePre}
          <span className="bg-[linear-gradient(110deg,#3b82f6,#8b5cf6_50%,#ec4899)] bg-clip-text text-transparent">
            {t.hero.headlineHighlight}
          </span>
          {t.hero.headlinePost}
        </h1>

        <p className="mx-auto mt-4 max-w-[548px] text-base leading-[1.6] text-text-dim">
          {t.hero.lede}
        </p>
      </div>
    </header>
  );
}
