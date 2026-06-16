import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { SiteHeader } from "@/components/chromai/site-header";
import { SiteFooter } from "@/components/chromai/site-footer";
import {
  WebSiteSchema,
  SoftwareApplicationSchema,
  OrganizationSchema,
} from "@/lib/seo/json-ld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const siteConfig = {
  name: "Chromai",
  description:
    "Yapay zekâ destekli renk paleti üreticisi. İstediğin atmosferi tarif et, AI sana özel renk kombinasyonlarını anında oluştursun. Tasarımcılar, geliştiriciler ve yaratıcı profesyoneller için.",
  url: "https://chromai.app",
  ogImage: "https://chromai.app/og-image.jpg",
  twitterHandle: "@chromai",
  keywords: [
    "AI renk paleti",
    "yapay zeka renk oluşturucu",
    "renk paleti üretici",
    "color palette generator",
    "AI color palette",
    "renk kombinasyonu",
    "tasarım araçları",
    "UI renk şeması",
    "marka renkleri",
    "renk uyumu",
  ],
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — AI Renk Paleti Üreticisi`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Chromai",
      url: siteConfig.url,
    },
  ],
  creator: "Chromai",
  publisher: "Chromai",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — AI Renk Paleti Üreticisi`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Chromai — Yapay Zekâ Destekli Renk Paleti Üreticisi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — AI Renk Paleti Üreticisi`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "technology",
  classification: "Design Tools",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WebSiteSchema />
          <SoftwareApplicationSchema />
          <OrganizationSchema />
          <I18nProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
