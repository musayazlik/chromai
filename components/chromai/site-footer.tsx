"use client";

import { Icon } from "@iconify/react";

import ChromaiLogo from "@/app/components/ChromaiLogo";
import { useI18n } from "@/lib/i18n/provider";

const GITHUB_URL = "https://github.com/musayazlik/chromai";

const SOCIALS = [
  { icon: "lucide:github", label: "GitHub", href: GITHUB_URL },
  { icon: "lucide:twitter", label: "X", href: "https://x.com" },
  { icon: "lucide:linkedin", label: "LinkedIn", href: "https://linkedin.com" },
];

function isExternal(href: string) {
  return href.startsWith("http");
}

export function SiteFooter() {
  const { t } = useI18n();

  const columns: {
    title: string;
    links: { label: string; href: string }[];
  }[] = [
    {
      title: t.footer.colProduct,
      links: [
        { label: t.footer.linkCreate, href: "#composer" },
        { label: t.footer.linkPalettes, href: "#paletler" },
        { label: t.footer.linkModels, href: "#composer" },
      ],
    },
    {
      title: t.footer.colResources,
      links: [
        { label: "OpenRouter", href: "https://openrouter.ai" },
        { label: "Iconify", href: "https://iconify.design" },
        { label: "shadcn/ui", href: "https://ui.shadcn.com" },
      ],
    },
    {
      title: t.footer.colCommunity,
      links: [
        { label: "GitHub", href: GITHUB_URL },
        { label: "Next.js", href: "https://nextjs.org" },
        { label: "Tailwind CSS", href: "https://tailwindcss.com" },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-(--glass-bar-line) bg-(--glass-bar) backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-[1040px] px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <ChromaiLogo size={34} />
              <span className="font-display text-lg font-bold tracking-tight">
                Chrom
                <span className="bg-[linear-gradient(110deg,#6366f1,#8b5cf6,#ec4899)] bg-clip-text text-transparent">
                  ai
                </span>
              </span>
            </div>
            <p className="mt-3 max-w-[15rem] text-[13px] leading-relaxed text-text-dim">
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-xl border border-border bg-card/60 text-text-dim transition-colors duration-200 hover:border-transparent hover:bg-foreground/5 hover:text-text"
                >
                  <Icon icon={s.icon} width={17} height={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-mute">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(isExternal(link.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[13px] text-text-dim transition-colors duration-200 hover:text-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-[12.5px] text-text-mute sm:flex-row">
          <p>{t.footer.rights(new Date().getFullYear())}</p>
          <p className="flex items-center gap-1.5">
            <Icon
              icon="lucide:sparkles"
              width={13}
              height={13}
              className="text-primary"
            />
            {t.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
