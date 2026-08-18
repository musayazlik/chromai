import type { Locale } from "@/lib/i18n/config";

/** Public-facing post shape returned by APIs / pages. */
export interface BlogPostDTO {
  id: string;
  slug: string;
  locale: Locale;
  status: "DRAFT" | "PUBLISHED";
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverUrl: string | null;
  coverAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  readMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
}

/** Payload n8n sends to the webhook — one logical article, multiple locales. */
export interface WebhookPostInput {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  coverUrl?: string | null;
  coverAlt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  readMinutes?: number;
  status?: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
}

export interface WebhookPayload {
  secret: string;
  posts: WebhookPostInput[];
}
