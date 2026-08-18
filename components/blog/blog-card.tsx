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

const READ_LABELS: Record<Locale, { unit: string; cta: string }> = {
  tr: { unit: "dk", cta: "Oku" },
  en: { unit: "min", cta: "Read" },
  de: { unit: "Min.", cta: "Lesen" },
};

interface BlogCardProps {
  post: BlogPostDTO;
  href: string;
  className?: string;
}

export function BlogCard({ post, href, className }: BlogCardProps) {
  const labels = READ_LABELS[post.locale] ?? READ_LABELS.en;
  const dateLabel = post.publishedAt
    ? format(new Date(post.publishedAt), "d MMM yyyy", {
        locale: dateFnsLocales[post.locale],
      })
    : null;

  const visibleTags = post.tags.slice(0, 2);
  const extraTags = post.tags.slice(2);

  return (
    <a
      href={href}
      className={cn(
        "soft-card soft-card-hover group flex h-full flex-col overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {post.coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.coverUrl}
            alt={post.coverAlt ?? post.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--grad)] p-4 text-center">
            <span className="line-clamp-2 text-[13px] font-semibold text-white/90">
              {post.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card/60 px-2.5 py-0.5 text-[11px] font-medium text-text-dim"
              >
                {tag}
              </span>
            ))}
            {extraTags.length > 0 && (
              <span
                title={extraTags.join(", ")}
                className="cursor-help rounded-full border border-border bg-card/60 px-2 py-0.5 text-[11px] font-medium text-text-mute"
              >
                +{extraTags.length}
              </span>
            )}
          </div>
        )}

        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-text-dim">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-5 text-[12px] text-text-mute">
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:calendar" width={13} height={13} />
              {dateLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="lucide:clock-3" width={13} height={13} />
            {post.readMinutes} {labels.unit}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-text-dim transition-colors group-hover:text-primary">
            {labels.cta}
            <Icon
              icon="lucide:arrow-right"
              width={14}
              height={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  );
}
