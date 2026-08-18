"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { BlogCard } from "@/components/blog/blog-card";
import { SectionHeading } from "@/components/chromai/section-heading";
import { fetchPosts } from "@/lib/blog-client";
import { type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { BlogPostDTO } from "@/lib/blog-types";

const COPY: Record<
  Locale,
  { eyebrow: string; title: string; subtitle: string; viewAll: string; empty: string }
> = {
  tr: {
    eyebrow: "Blog",
    title: "Renk, tasarım ve yapay zekâ üzerine notlar",
    subtitle:
      "Her gün AI destekli üretilen kısa yazılar — teori ve pratik, yan yana.",
    viewAll: "Tüm yazılar",
    empty: "Henüz yazı yok. İlk içerik çok yakında!",
  },
  en: {
    eyebrow: "Blog",
    title: "Notes on color, design and AI",
    subtitle:
      "Short posts, generated daily with AI — theory and practice, side by side.",
    viewAll: "All posts",
    empty: "No posts yet. The first one is on its way!",
  },
  de: {
    eyebrow: "Blog",
    title: "Notizen zu Farbe, Design und KI",
    subtitle:
      "Kurze Beiträge, täglich mit KI erstellt — Theorie und Praxis, Seite an Seite.",
    viewAll: "Alle Beiträge",
    empty: "Noch keine Beiträge. Der erste ist unterwegs!",
  },
};

export function BlogSection() {
  const { locale } = useI18n();
  const copy = COPY[locale] ?? COPY.en;
  // Tag results with the locale they belong to; while it doesn't match the
  // active locale we render skeletons (derived loading — no setState in effect).
  const [data, setData] = useState<{ locale: Locale; posts: BlogPostDTO[] } | null>(
    null,
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchPosts({ locale, limit: 3, signal: ac.signal })
      .then((res) => setData({ locale, posts: res.posts }))
      .catch(() => {
        if (!ac.signal.aborted) setData({ locale, posts: [] });
      });
    return () => ac.abort();
  }, [locale]);

  const posts = data && data.locale === locale ? data.posts : null;

  return (
    <section id="blog" className="scroll-mt-20 pt-20">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      {posts === null ? (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-center text-[14px] text-text-dim">{copy.empty}</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={`${post.slug}-${post.locale}`}
                post={post}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="gen-btn inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              {copy.viewAll}
              <Icon icon="lucide:arrow-right" width={15} height={15} />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="soft-card overflow-hidden rounded-2xl">
      <div className="aspect-[16/9] animate-pulse bg-card/70" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 animate-pulse rounded-full bg-card/70" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-card/70" />
        <div className="h-4 w-full animate-pulse rounded bg-card/70" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-card/70" />
      </div>
    </div>
  );
}
