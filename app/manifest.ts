import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chromai — AI Renk Paleti Üreticisi",
    short_name: "Chromai",
    description:
      "Yapay zekâ destekli renk paleti üreticisi. İstediğin atmosferi tarif et, AI sana özel renk kombinasyonlarını anında oluştursun.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait",
    scope: "/",
    lang: "tr",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["design", "productivity", "utilities"],
    screenshots: [
      {
        src: "/screenshot-wide.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.jpg",
        sizes: "750x1334",
        type: "image/jpeg",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "Yeni Palet",
        short_name: "Palet",
        description: "Yeni renk paleti oluştur",
        url: "/?action=generate",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
