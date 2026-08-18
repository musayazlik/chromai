import { NextResponse } from "next/server";

import { listPublishedPostsPage } from "@/lib/blog";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/blog/posts?locale=tr&offset=0&limit=20
 * Paginated list of PUBLISHED posts (newest first), decorated for display.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const localeParam = url.searchParams.get("locale");
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const limitParam = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 100)
    : 20;

  const offsetParam = Number(url.searchParams.get("offset"));
  const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;

  const query = url.searchParams.get("q")?.slice(0, 100) ?? undefined;

  const { posts, hasMore } = await listPublishedPostsPage(locale, {
    limit,
    offset,
    query,
  });

  return NextResponse.json({ posts, hasMore, count: posts.length, locale });
}
