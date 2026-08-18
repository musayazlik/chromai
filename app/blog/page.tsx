import type { Metadata } from "next";

import { BlogExplorer } from "@/components/blog/blog-explorer";
import { listPublishedPostsPage } from "@/lib/blog";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export const revalidate = 300; // 5 dk ISR — n8n yeni yazı gönderince yeterince hızlı yenilenir.

const PAGE_SIZE = 20;

export const metadata: Metadata = {
  title: "Renk, tasarım ve yapay zekâ üzerine notlar",
  description:
    "Her gün Chromai ekibi tarafından, yapay zekâ destekli olarak üretilen kısa yazılar.",
  alternates: { canonical: "/blog" },
};

export default async function BlogListPage() {
  // First page (default locale) is server-rendered for fast paint; the explorer
  // re-fetches client-side when the active language differs or when searching.
  const { posts, hasMore } = await listPublishedPostsPage(DEFAULT_LOCALE, {
    limit: PAGE_SIZE,
  });

  return (
    <div className="mx-auto w-full max-w-[1040px] px-6 pb-24 pt-12 sm:pt-16">
      <BlogExplorer initialPosts={posts} initialHasMore={hasMore} />
    </div>
  );
}
