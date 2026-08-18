import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { de as deLocale, enUS, tr as trLocale } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";
import { notFound } from "next/navigation";

import { BlogContent } from "@/components/blog/blog-content";
import { BlogCard } from "@/components/blog/blog-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import {
  decoratePost,
  estimateReadingMinutes,
  getPublishedPostBySlug,
  listAllPublishedSlugs,
  listPublishedPosts,
  placeholderCover,
} from "@/lib/blog";
import type { BlogPostDTO } from "@/lib/blog-types";
import type { Locale } from "@/lib/i18n/config";

const dateFnsLocales: Record<Locale, DateFnsLocale> = {
  en: enUS,
  tr: trLocale,
  de: deLocale,
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chromai.app";

const NAV: Record<
  Locale,
  { back: string; related: string; read: string; by: string }
> = {
  tr: {
    back: "← Tüm yazılar",
    related: "Bunları da okuyabilirsin",
    read: "dk okuma",
    by: "Chromai ekibi",
  },
  en: {
    back: "← All posts",
    related: "You may also like",
    read: "min read",
    by: "Chromai team",
  },
  de: {
    back: "← Alle Beiträge",
    related: "Das könnte dir auch gefallen",
    read: "Min. Lesezeit",
    by: "Chromai-Team",
  },
};

const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

// No locale segment in the route — generate one static page per slug across
// every locale; the slug alone resolves the post (see getPublishedPostBySlug).
export async function generateStaticParams() {
  const slugs = await listAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "404" };

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const cover = post.coverUrl ?? placeholderCover(slug);
  const url = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Chromai",
      locale: OG_LOCALE[post.locale] ?? "en_US",
      images: [
        { url: cover, width: 1200, height: 630, alt: post.coverAlt ?? title },
      ],
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cover],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const locale = post.locale;
  const copy = NAV[locale];
  const dateLabel = post.publishedAt
    ? format(new Date(post.publishedAt), "d MMMM yyyy", {
        locale: dateFnsLocales[locale],
      })
    : null;

  const cover = post.coverUrl ?? placeholderCover(slug);
  const readMinutes = post.readMinutes || estimateReadingMinutes(post.content);

  const related = await listPublishedPosts(locale, {
    limit: 4,
    excludeSlug: slug,
  });
  const relatedDecorated: BlogPostDTO[] = related.map(decoratePost);

  // JSON-LD article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [cover],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "Chromai" },
    publisher: {
      "@type": "Organization",
      name: "Chromai",
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    },
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
  };

  return (
    <article
      id="blog-post"
      className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10 sm:pt-14"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress targetId="blog-post" locale={locale} />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-text-dim transition-colors hover:text-text"
      >
        {copy.back}
      </Link>

      <header className="mt-6">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
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

        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-[16px] leading-relaxed text-text-dim">
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[12.5px] text-text-mute">
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:calendar" width={13} height={13} />
              {dateLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="lucide:clock-3" width={13} height={13} />
            {readMinutes} {copy.read}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="lucide:user" width={13} height={13} />
            {copy.by}
          </span>
        </div>
      </header>

      {cover && (
        <div className="soft-card mt-8 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={post.coverAlt ?? post.title}
            className="h-auto w-full object-cover"
            loading="eager"
          />
        </div>
      )}

      <BlogContent content={post.content} className="mt-10" />

      {relatedDecorated.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-text">
            {copy.related}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedDecorated.slice(0, 3).map((p) => (
              <BlogCard
                key={`${p.slug}-${p.locale}`}
                post={p}
                href={`/blog/${p.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
