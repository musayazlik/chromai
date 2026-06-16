import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      id="json-ld"
    />
  );
}

// WebSite Schema
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Chromai",
    url: "https://chromai.app",
    description:
      "Yapay zekâ destekli renk paleti üreticisi. İstediğin atmosferi tarif et, AI sana özel renk kombinasyonlarını anında oluştursun.",
    inLanguage: "tr",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://chromai.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Organization",
      name: "Chromai",
      url: "https://chromai.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Chromai",
      url: "https://chromai.app",
      logo: {
        "@type": "ImageObject",
        url: "https://chromai.app/logo.png",
        width: 512,
        height: 512,
      },
    },
    copyrightYear: new Date().getFullYear(),
    keywords: [
      "AI renk paleti",
      "yapay zeka renk oluşturucu",
      "renk paleti üretici",
      "color palette generator",
      "AI color palette",
      "tasarım araçları",
      "UI renk şeması",
    ],
  };

  return <JsonLd data={data} />;
}

// SoftwareApplication Schema
export function SoftwareApplicationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Chromai",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "AI destekli renk paleti oluşturma",
      "Atmosfere göre renk önerileri",
      "Renk uyumu analizi",
      "Kolay kopyalama (HEX, RGB, HSL)",
      "Paleti dışa aktarma",
      "Marka renk şeması oluşturma",
    ],
    softwareVersion: "1.0.0",
    datePublished: "2026-01-01",
    url: "https://chromai.app",
    screenshot: {
      "@type": "ImageObject",
      url: "https://chromai.app/og-image.jpg",
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Organization",
      name: "Chromai",
      url: "https://chromai.app",
    },
  };

  return <JsonLd data={data} />;
}

// Organization Schema
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chromai",
    url: "https://chromai.app",
    logo: {
      "@type": "ImageObject",
      url: "https://chromai.app/logo.png",
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/chromai",
      "https://github.com/chromai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@chromai.app",
      availableLanguage: ["Turkish", "English"],
    },
  };

  return <JsonLd data={data} />;
}

// BreadcrumbList Schema
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://chromai.app${item.path}`,
    })),
  };

  return <JsonLd data={data} />;
}

// FAQPage Schema
export function FAQPageSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
