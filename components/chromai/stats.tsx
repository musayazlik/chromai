"use client";

import { useHome } from "@/lib/i18n/home";

export function Stats() {
  const { stats } = useHome();

  return (
    <section className="mt-20 sm:mt-24">
      <div className="soft-card grid grid-cols-2 gap-y-8 rounded-[28px] px-6 py-8 sm:grid-cols-4 sm:px-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <span className="bg-[linear-gradient(120deg,#6366f1,#8b5cf6_55%,#ec4899)] bg-clip-text font-display text-[clamp(30px,5vw,44px)] font-bold leading-none tracking-tight text-transparent">
              {stat.value}
            </span>
            <span className="mt-2 text-[13px] font-medium text-text-dim">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
