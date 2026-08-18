import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { de as deLocale, enUS, tr as trLocale } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

import { cn } from "@/lib/utils";
import type { BlogPostDTO } from "@/lib/blog-types";
import type { Locale } from "@/lib/i18n/config";

const dateFnsLocales: Record<Locale, DateFnsLocale> = {
  en: enUS,
  tr: trLocale,
  de: deLocale,
};

const LABELS: Record<Locale, { unit: string; cta: string; by: string }> = {
  tr: { unit: "dk okuma", cta: "Devamını oku", by: "Chromai ekibi" },
  en: { unit: "min read", cta: "Read more", by: "Chromai team" },
  de: { unit: "Min. Lesezeit", cta: "Weiterlesen", by: "Chromai-Team" },
};

interface BlogRowProps {
  post: BlogPostDTO;
  href: string;
  className?: string;
}

export function BlogRow({ post, href, className }: BlogRowProps) {
  const labels = LABELS[post.locale] ?? LABELS.en;
  const dateLabel = post.publishedAt
    ? format(new Date(post.publishedAt), "d MMMM yyyy", {
        locale: dateFnsLocales[post.locale],
      })
    : null;

  return (
    <a
      href={href}
      className={cn(
        "soft-card soft-card-hover group flex flex-col overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:flex-row",
        className,
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-secondary sm:aspect-auto sm:w-[40%] sm:max-w-[340px]">
        {post.coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.coverUrl}
            alt={post.coverAlt ?? post.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:absolute sm:inset-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--grad)] p-5 text-center sm:absolute sm:inset-0">
            <span className="line-clamp-3 text-sm font-semibold text-white/90">
              {post.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card/60 px-2.5 py-0.5 text-[11px] font-medium text-text-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary sm:text-[22px]">
          {post.title}
        </h2>

        <p className="mt-2.5 line-clamp-2 text-[14.5px] leading-relaxed text-text-dim sm:line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-[12.5px] text-text-mute">
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:calendar" width={14} height={14} />
              {dateLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="lucide:clock-3" width={14} height={14} />
            {post.readMinutes} {labels.unit}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="lucide:user" width={14} height={14} />
            {labels.by}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-primary">
            {labels.cta}
            <Icon
              icon="lucide:arrow-right"
              width={15}
              height={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  );
}

/** Loading placeholder matching BlogRow's shape. */
export function BlogRowSkeleton() {
  return (
    <div className="soft-card flex flex-col overflow-hidden rounded-2xl sm:flex-row">
      <div className="aspect-[16/9] shrink-0 animate-pulse bg-card/70 sm:aspect-auto sm:w-[40%] sm:max-w-[340px]" />
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        <div className="flex gap-1.5">
          <div className="h-4 w-16 animate-pulse rounded-full bg-card/70" />
          <div className="h-4 w-12 animate-pulse rounded-full bg-card/70" />
        </div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-card/70" />
        <div className="h-4 w-full animate-pulse rounded bg-card/70" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-card/70" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-card/70" />
      </div>
    </div>
  );
}
