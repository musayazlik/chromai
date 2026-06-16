import { MetadataRoute } from "next";

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
      },
    },
  }));

  return [...staticRoutes];
}
