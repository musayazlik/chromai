import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import type { BlogPostDTO, WebhookPostInput } from "@/lib/blog-types";

const DEFAULT_LOCALE: Locale = "tr";

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

type DbRow = Awaited<ReturnType<typeof prisma.blogPost.findFirst>>;

function toDTO(row: NonNullable<DbRow>): BlogPostDTO {
  return {
    id: row.id,
    slug: row.slug,
    locale: isLocale(row.locale) ? row.locale : DEFAULT_LOCALE,
    status: row.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tags: parseTags(row.tags),
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    readMinutes: row.readMinutes,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Public list of PUBLISHED posts for a locale, newest first. */
export async function listPublishedPosts(
  locale: Locale,
  options: {
    limit?: number;
    offset?: number;
    excludeSlug?: string;
    query?: string;
  } = {},
): Promise<BlogPostDTO[]> {
  const query = options.query?.trim();
  const rows = await prisma.blogPost.findMany({
    where: {
      locale,
      status: "PUBLISHED",
      ...(options.excludeSlug ? { NOT: { slug: options.excludeSlug } } : {}),
      ...(query
        ? {
            // SQLite LIKE is case-insensitive for ASCII; good enough for search.
            OR: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
              { tags: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: options.limit,
    skip: options.offset,
  });
  return rows.map((r) => toDTO(r));
}

/** Fill in derived display fields (reading time, placeholder cover). */
export function decoratePost(post: BlogPostDTO): BlogPostDTO {
  return {
    ...post,
    readMinutes: post.readMinutes || estimateReadingMinutes(post.content),
    coverUrl: post.coverUrl ?? placeholderCover(post.slug),
  };
}

/**
 * One page of PUBLISHED posts plus whether more exist after it.
 * Fetches limit+1 rows to detect `hasMore` without a separate count query.
 */
export async function listPublishedPostsPage(
  locale: Locale,
  options: { limit?: number; offset?: number; query?: string } = {},
): Promise<{ posts: BlogPostDTO[]; hasMore: boolean }> {
  const limit = options.limit ?? 20;
  const rows = await listPublishedPosts(locale, {
    limit: limit + 1,
    offset: options.offset,
    query: options.query,
  });
  const hasMore = rows.length > limit;
  const posts = (hasMore ? rows.slice(0, limit) : rows).map(decoratePost);
  return { posts, hasMore };
}

/** Slugs of every PUBLISHED post in a locale (for sitemap / static params). */
export async function listPublishedSlugs(locale: Locale): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { locale, status: "PUBLISHED" },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => r.slug);
}

/** Fetch a single PUBLISHED post by slug+locale. */
export async function getPublishedPost(
  slug: string,
  locale: Locale,
): Promise<BlogPostDTO | null> {
  const row = await prisma.blogPost.findUnique({
    where: { slug_locale: { slug, locale } },
  });
  if (!row || row.status !== "PUBLISHED") return null;
  return toDTO(row);
}

/**
 * Fetch a PUBLISHED post by slug regardless of locale.
 * Slugs differ per language, so the detail route (which has no locale segment)
 * resolves the post from the slug alone and uses the post's own locale.
 */
export async function getPublishedPostBySlug(
  slug: string,
): Promise<BlogPostDTO | null> {
  const row = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return row ? toDTO(row) : null;
}

/** Slugs of every PUBLISHED post across all locales (deduped). */
export async function listAllPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
  return [...new Set(rows.map((r) => r.slug))];
}

/** Upsert a post from the n8n webhook. Returns the created/updated row. */
export async function upsertPostFromWebhook(
  input: WebhookPostInput,
): Promise<BlogPostDTO> {
  if (!isLocale(input.locale)) {
    throw new Error(`Unsupported locale: ${input.locale}`);
  }

  const status = input.status === "PUBLISHED" ? "PUBLISHED" : "PUBLISHED";
  const publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();

  const row = await prisma.blogPost.upsert({
    where: { slug_locale: { slug: input.slug, locale: input.locale } },
    create: {
      slug: input.slug,
      locale: input.locale,
      status,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      tags: JSON.stringify(input.tags ?? []),
      coverUrl: input.coverUrl ?? null,
      coverAlt: input.coverAlt ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      readMinutes: input.readMinutes ?? estimateReadingMinutes(input.content),
      publishedAt,
    },
    update: {
      status,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      tags: JSON.stringify(input.tags ?? []),
      coverUrl: input.coverUrl ?? null,
      coverAlt: input.coverAlt ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      readMinutes: input.readMinutes ?? estimateReadingMinutes(input.content),
      publishedAt,
    },
  });

  return toDTO(row);
}

export function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Pick a deterministic placeholder cover image when the webhook omits one. */
export function placeholderCover(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/630`;
}
