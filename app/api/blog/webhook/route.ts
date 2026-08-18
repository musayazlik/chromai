import { NextResponse } from "next/server";

import { upsertPostFromWebhook } from "@/lib/blog";
import type { WebhookPayload } from "@/lib/blog-types";

export const runtime = "nodejs";
// Cache the route at the edge of impossibility — only an authenticated POST
// from the n8n workflow should ever reach it.
export const dynamic = "force-dynamic";

/** POST /api/blog/webhook — receives one or more (slug, locale) posts from n8n. */
export async function POST(req: Request) {
  const expected = process.env.BLOG_WEBHOOK_SECRET;
  if (!expected || expected.length < 16) {
    return NextResponse.json(
      { error: "BLOG_WEBHOOK_SECRET is not configured on the server." },
      { status: 500 },
    );
  }

  let body: WebhookPayload;
  try {
    body = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray(body.posts)) {
    return NextResponse.json(
      { error: "Expected { secret, posts: [...] }." },
      { status: 400 },
    );
  }

  // Constant-time compare to avoid leaking length info via timing.
  if (!secureEqual(body.secret ?? "", expected)) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  const accepted: { slug: string; locale: string; id: string }[] = [];
  const errors: { slug: string; locale: string; error: string }[] = [];

  for (const post of body.posts) {
    if (!post || typeof post.slug !== "string" || !post.slug.trim()) {
      errors.push({ slug: "<missing>", locale: "<missing>", error: "slug required" });
      continue;
    }
    try {
      const saved = await upsertPostFromWebhook(post);
      accepted.push({ slug: saved.slug, locale: saved.locale, id: saved.id });
    } catch (err) {
      errors.push({
        slug: post.slug,
        locale: post.locale ?? "<missing>",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json(
    { accepted, errors, count: accepted.length },
    { status: errors.length === body.posts.length ? 400 : 200 },
  );
}

function secureEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
