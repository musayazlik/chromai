"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import { BlogRow, BlogRowSkeleton } from "@/components/blog/blog-row";
import { fetchPosts } from "@/lib/blog-client";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { BlogPostDTO } from "@/lib/blog-types";

const PAGE_SIZE = 20;

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    clear: string;
    resultCount: (n: number) => string;
    loading: string;
    loadMore: string;
    end: string;
    errorTitle: string;
    errorText: string;
    retry: string;
    emptyTitle: string;
    emptyText: string;
    noResultTitle: string;
    noResultText: (q: string) => string;
  }
> = {
  tr: {
    eyebrow: "Blog",
    title: "Renk, tasarım ve yapay zekâ üzerine notlar",
    subtitle:
      "Her gün Chromai ekibi tarafından, yapay zekâ destekli olarak üretilen kısa yazılar.",
    searchPlaceholder: "Yazılarda ara…",
    clear: "Aramayı temizle",
    resultCount: (n) => `${n} yazı bulundu`,
    loading: "Yükleniyor…",
    loadMore: "Daha fazla yükle",
    end: "Hepsi bu kadar 🎉",
    errorTitle: "Bir şeyler ters gitti",
    errorText: "Yazılar yüklenemedi. Lütfen tekrar dene.",
    retry: "Tekrar dene",
    emptyTitle: "Henüz yazı yok",
    emptyText: "İlk içerik çok yakında yayınlanacak.",
    noResultTitle: "Sonuç bulunamadı",
    noResultText: (q) => `“${q}” ile eşleşen bir yazı yok. Farklı bir kelime dene.`,
  },
  en: {
    eyebrow: "Blog",
    title: "Notes on color, design and AI",
    subtitle: "Short posts generated daily by the Chromai team, with the help of AI.",
    searchPlaceholder: "Search posts…",
    clear: "Clear search",
    resultCount: (n) => `${n} ${n === 1 ? "post" : "posts"} found`,
    loading: "Loading…",
    loadMore: "Load more",
    end: "You've reached the end 🎉",
    errorTitle: "Something went wrong",
    errorText: "Couldn't load posts. Please try again.",
    retry: "Try again",
    emptyTitle: "No posts yet",
    emptyText: "The first one is on its way.",
    noResultTitle: "No results found",
    noResultText: (q) => `Nothing matches “${q}”. Try a different keyword.`,
  },
  de: {
    eyebrow: "Blog",
    title: "Notizen zu Farbe, Design und KI",
    subtitle: "Kurze Beiträge, täglich vom Chromai-Team mit KI-Unterstützung erstellt.",
    searchPlaceholder: "Beiträge durchsuchen…",
    clear: "Suche löschen",
    resultCount: (n) => `${n} ${n === 1 ? "Beitrag" : "Beiträge"} gefunden`,
    loading: "Wird geladen…",
    loadMore: "Mehr laden",
    end: "Das war alles 🎉",
    errorTitle: "Etwas ist schiefgelaufen",
    errorText: "Beiträge konnten nicht geladen werden. Bitte erneut versuchen.",
    retry: "Erneut versuchen",
    emptyTitle: "Noch keine Beiträge",
    emptyText: "Der erste ist unterwegs.",
    noResultTitle: "Keine Ergebnisse",
    noResultText: (q) => `Nichts passt zu „${q}“. Versuche ein anderes Stichwort.`,
  },
};

interface BlogExplorerProps {
  initialPosts: BlogPostDTO[];
  initialHasMore: boolean;
}

interface PageState {
  key: string; // locale|query|reloadKey — identifies which result set this is
  posts: BlogPostDTO[];
  hasMore: boolean;
  error: boolean;
}

const makeKey = (locale: Locale, query: string, reload: number) =>
  `${locale}|${query}|${reload}`;

export function BlogExplorer({ initialPosts, initialHasMore }: BlogExplorerProps) {
  const { locale } = useI18n();
  const copy = COPY[locale] ?? COPY.en;

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [reloadKey, setReloadKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Result set tagged with the key it belongs to. `loading` is derived from a
  // key mismatch, so the reset effect never calls setState synchronously.
  const [state, setState] = useState<PageState>({
    key: makeKey(DEFAULT_LOCALE, "", 0),
    posts: initialPosts,
    hasMore: initialHasMore,
    error: false,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const currentKey = makeKey(locale, query, reloadKey);
  const loading = state.key !== currentKey; // first-page load for current key

  // debounce the search input
  useEffect(() => {
    const id = setTimeout(() => setQuery(rawQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [rawQuery]);

  // (re)load the first page whenever locale / query / reload changes
  useEffect(() => {
    if (!loading) return; // already have the data for this key (covers mount)

    const ac = new AbortController();
    fetchPosts({ locale, query, limit: PAGE_SIZE, signal: ac.signal })
      .then((res) =>
        setState({ key: currentKey, posts: res.posts, hasMore: res.hasMore, error: false }),
      )
      .catch(() => {
        if (!ac.signal.aborted) {
          setState({ key: currentKey, posts: [], hasMore: false, error: true });
        }
      });
    return () => ac.abort();
  }, [loading, currentKey, locale, query]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || !state.hasMore) return;
    const key = currentKey;
    setLoadingMore(true);

    fetchPosts({ locale, query, offset: state.posts.length, limit: PAGE_SIZE })
      .then((res) => {
        setState((prev) => {
          if (prev.key !== key) return prev; // stale (locale/query changed)
          const seen = new Set(prev.posts.map((p) => p.slug));
          const fresh = res.posts.filter((p) => !seen.has(p.slug));
          return { ...prev, posts: [...prev.posts, ...fresh], hasMore: res.hasMore };
        });
      })
      .catch(() =>
        setState((prev) =>
          prev.key === key ? { ...prev, hasMore: false, error: true } : prev,
        ),
      )
      .finally(() => setLoadingMore(false));
  }, [loadingMore, loading, state.hasMore, state.posts.length, currentKey, locale, query]);

  // infinite scroll
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !state.hasMore || loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [state.hasMore, loading, loadMore]);

  const retryMore = () =>
    setState((prev) => ({ ...prev, hasMore: true, error: false }));

  const posts = state.posts;
  const hasMore = state.hasMore;
  const error = state.error;

  const showSkeletons = loading && posts.length === 0;
  const showEmpty = !loading && !error && posts.length === 0;
  const showFirstError = !loading && error && posts.length === 0;

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-16 -z-10 size-56 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.20),transparent_70%)] blur-2xl"
        />
        <p className="inline-flex items-center gap-2 rounded-full border border-(--glass-bar-line) bg-(--glass-bar) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim backdrop-blur">
          <span className="size-1.5 rounded-full bg-[var(--grad)]" />
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 max-w-[20ch] font-display text-4xl font-bold leading-[1.08] tracking-tight text-text sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-[44rem] text-[15px] leading-relaxed text-text-dim">
          {copy.subtitle}
        </p>
      </div>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="relative">
          <Icon
            icon="lucide:search"
            width={17}
            height={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-mute"
          />
          <input
            type="search"
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
            className="composer-card w-full rounded-xl border border-border bg-[var(--surface-raised)] py-3 pl-11 pr-11 text-[14px] text-text outline-none placeholder:text-text-mute"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={() => setRawQuery("")}
              aria-label={copy.clear}
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-text-mute transition-colors hover:bg-card hover:text-text"
            >
              <Icon icon="lucide:x" width={15} height={15} />
            </button>
          )}
        </div>

        {query && !loading && posts.length > 0 && (
          <p className="mt-3 text-[12.5px] text-text-mute">
            {copy.resultCount(posts.length)}
            {hasMore ? "+" : ""}
          </p>
        )}
      </div>

      {/* ── Results ────────────────────────────────────────────────── */}
      {showSkeletons ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <BlogRowSkeleton key={i} />
          ))}
        </div>
      ) : showFirstError ? (
        <EmptyState
          icon="lucide:cloud-alert"
          title={copy.errorTitle}
          text={copy.errorText}
          action={
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="gen-btn inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              <Icon icon="lucide:rotate-cw" width={15} height={15} />
              {copy.retry}
            </button>
          }
        />
      ) : showEmpty ? (
        query ? (
          <EmptyState
            icon="lucide:search-x"
            title={copy.noResultTitle}
            text={copy.noResultText(query)}
            action={
              <button
                type="button"
                onClick={() => setRawQuery("")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-semibold text-text-dim transition-colors hover:text-text"
              >
                <Icon icon="lucide:x" width={15} height={15} />
                {copy.clear}
              </button>
            }
          />
        ) : (
          <EmptyState icon="lucide:feather" title={copy.emptyTitle} text={copy.emptyText} />
        )
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <BlogRow
                key={`${post.slug}-${post.locale}`}
                post={post}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-4">
            {loadingMore && (
              <span className="inline-flex items-center gap-2 text-[13px] font-medium text-text-dim">
                <Icon icon="lucide:loader-circle" width={16} height={16} className="animate-spin" />
                {copy.loading}
              </span>
            )}

            {error && !loadingMore && (
              <button
                type="button"
                onClick={retryMore}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-semibold text-text-dim transition-colors hover:text-text"
              >
                <Icon icon="lucide:rotate-cw" width={15} height={15} />
                {copy.retry}
              </button>
            )}

            {!error && !loadingMore && hasMore && (
              <button
                type="button"
                onClick={loadMore}
                className="gen-btn inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
              >
                {copy.loadMore}
                <Icon icon="lucide:chevron-down" width={15} height={15} />
              </button>
            )}

            {!hasMore && !error && posts.length > PAGE_SIZE && (
              <p className="text-[12.5px] text-text-mute">{copy.end}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="soft-card flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-card text-text-mute">
        <Icon icon={icon} width={26} height={26} />
      </span>
      <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
      <p className="max-w-[34rem] text-[14px] leading-relaxed text-text-dim">{text}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
