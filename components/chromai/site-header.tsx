"use client";

import { Icon } from "@iconify/react";

import ChromaiLogo from "@/app/components/ChromaiLogo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useHome } from "@/lib/i18n/home";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/musayazlik/chromai";

export function SiteHeader() {
  const { t } = useI18n();
  const { founder } = useHome();

  const navLinks = [
    { label: t.nav.create, href: "#composer" },
    { label: t.nav.palettes, href: "#paletler" },
    { label: t.nav.faq, href: "#sss" },
    { label: founder.eyebrow, href: "#kurucu" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-(--glass-bar-line) bg-(--glass-bar) backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-4 px-6">
        {/* Brand */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t.actions.brandHome}
        >
          <ChromaiLogo size={38} />
          <span className="font-display text-lg font-bold tracking-tight">
            Chrom
            <span className="bg-[linear-gradient(110deg,#6366f1,#8b5cf6,#ec4899)] bg-clip-text text-transparent">
              ai
            </span>
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-dim transition-colors duration-200 hover:bg-foreground/4 hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden rounded-xl text-text-dim hover:bg-foreground/6 hover:text-text sm:inline-flex"
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.actions.github}
            >
              <Icon icon="lucide:github" width={19} height={19} />
            </a>
          </Button>

          <a
            href="#composer"
            className="gen-btn hidden items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white md:flex"
          >
            <Icon icon="lucide:sparkles" width={15} height={15} />
            {t.actions.try}
          </a>
        </div>
      </div>
    </header>
  );
}
