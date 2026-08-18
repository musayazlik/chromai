import { NextResponse } from "next/server";

import { getPublishedPost } from "@/lib/blog";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** GET /api/blog/posts/[slug]?locale=tr — single PUBLISHED post. */
export async function GET(req: Request, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);
  const localeParam = url.searchParams.get("locale");
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const post = await getPublishedPost(slug, locale);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json({ post });
}
