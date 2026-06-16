"use client";

import Image from "next/image";

import { Icon } from "@iconify/react";

import { useHome } from "@/lib/i18n/home";
import { SectionHeading } from "./section-heading";

const GITHUB_URL = "https://github.com/musayazlik/chromai";

const SOCIALS = [
  { icon: "lucide:github", label: "GitHub", href: GITHUB_URL },
  { icon: "lucide:twitter", label: "X", href: "https://x.com" },
  { icon: "lucide:linkedin", label: "LinkedIn", href: "https://linkedin.com" },
];

export function Founder() {
  const { founder } = useHome();

  return (
    <section id="kurucu" className="mt-24 scroll-mt-24 sm:mt-28">
      <SectionHeading eyebrow={founder.eyebrow} title={founder.name} />

      {/* gradient-bordered card */}
      <div className="mt-10 rounded-[30px] bg-[linear-gradient(135deg,#6366f1,#8b5cf6_52%,#ec4899)] p-px shadow-[0_24px_60px_-20px_rgba(124,58,237,0.45)]">
        <div className="soft-card relative overflow-hidden rounded-[29px] px-6 py-10 text-center sm:px-12">
          {/* ambient brand glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 size-56 -translate-x-1/2 rounded-full bg-[var(--grad)] opacity-15 blur-3xl"
          />

          <div className="relative">
            {/* avatar with spinning conic ring */}
            <div className="relative mx-auto grid size-24 place-items-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-[28px] bg-[conic-gradient(from_0deg,#6366f1,#8b5cf6,#ec4899,#fb923c,#2dd4bf,#6366f1)] opacity-80 blur-[3px]"
                style={{ animation: "chromai-spin 6s linear infinite" }}
              />
              <span className="relative grid size-20 place-items-center overflow-hidden rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                <Image
                  src="/founder.png"
                  alt={founder.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </span>
            </div>

            <Icon
              icon="lucide:quote"
              className="mx-auto mt-6 text-primary/30"
              width={26}
              height={26}
            />
            <blockquote className="mx-auto mt-3 max-w-[560px] font-display text-[clamp(18px,2.6vw,23px)] font-medium leading-snug tracking-tight text-text">
              {founder.quote}
            </blockquote>

            <div className="mt-6">
              <p className="font-display text-lg font-bold tracking-tight">
                {founder.name}
              </p>
              <p className="text-[13px] text-text-mute">{founder.role}</p>
            </div>

            {/* tags */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {founder.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 text-[11.5px] font-medium text-text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* socials */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-xl border border-border bg-card/60 text-text-dim transition-colors duration-200 hover:border-transparent hover:bg-foreground/5 hover:text-text"
                >
                  <Icon icon={s.icon} width={18} height={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
