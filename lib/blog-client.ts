import type { BlogPostDTO } from "./blog-types";
import type { Locale } from "./i18n/config";

export interface FetchPostsParams {
  locale: Locale;
  offset?: number;
  limit?: number;
  query?: string;
  signal?: AbortSignal;
}

export interface FetchPostsResult {
  posts: BlogPostDTO[];
  hasMore: boolean;
}

/** Client-side fetch of a paginated/searchable page of published posts. */
export async function fetchPosts({
  locale,
  offset = 0,
  limit = 20,
  query,
  signal,
}: FetchPostsParams): Promise<FetchPostsResult> {
  const sp = new URLSearchParams({ locale, limit: String(limit) });
  if (offset) sp.set("offset", String(offset));
  if (query?.trim()) sp.set("q", query.trim());

  // trailing slash matches next.config `trailingSlash: true` (avoids a 308 hop)
  const res = await fetch(`/api/blog/posts/?${sp.toString()}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);

  const data = (await res.json()) as FetchPostsResult;
  return { posts: data.posts ?? [], hasMore: Boolean(data.hasMore) };
}
