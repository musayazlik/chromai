import type { MetadataRoute } from "next";

import { listAllPublishedSlugs } from "@/lib/blog";

const siteUrl = "https://chromai.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/features", "/pricing", "/contact", "/blog"];

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
    alternates: {
      languages: {
        tr: `${siteUrl}${route}`,
        en: `${siteUrl}/en${route}`,
        de: `${siteUrl}/de${route}`,
      },
    },
  }));

  // Blog posts live at a single, locale-agnostic URL (the slug resolves the
  // post's language), so list each published slug once.
  const slugs = await listAllPublishedSlugs();
  const blogEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogEntries];
}
