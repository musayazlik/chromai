import type { Palette } from "@/lib/types";
import type { Locale } from "./config";

export interface Messages {
  nav: {
    create: string;
    palettes: string;
    models: string;
    features: string;
    faq: string;
  };
  actions: {
    try: string;
    github: string;
    theme: string;
    language: string;
    brandHome: string;
  };
  hero: {
    badge: string;
    headlinePre: string;
    headlineHighlight: string;
    headlinePost: string;
    lede: string;
  };
  composer: {
    placeholder: string;
    generate: string;
    generating: string;
    modelMenu: string;
  };
  models: Record<string, string>;
  loader: (model: string) => string;
  results: {
    title: string;
    titleFor: (q: string) => string;
    subStart: string;
    subWorking: (model: string) => string;
    subAdded: (n: number) => string;
    subFallback: (n: number) => string;
    titleRecent: string;
  };
  card: {
    eyebrow: string;
    colorsCount: (n: number) => string;
    aiTitle: string;
    aiTag: string;
  };
  toast: { hexCopied: (hex: string) => string; cssCopied: string };
  footer: {
    tagline: string;
    colProduct: string;
    colResources: string;
    colCommunity: string;
    linkCreate: string;
    linkPalettes: string;
    linkModels: string;
    rights: (year: number) => string;
    credit: string;
  };
  library: Palette[];
}

const tr: Messages = {
  nav: {
    create: "Oluştur",
    palettes: "Paletler",
    models: "Modeller",
    features: "Özellikler",
    faq: "SSS",
  },
  actions: {
    try: "Hemen Dene",
    github: "GitHub deposu",
    theme: "Temayı değiştir",
    language: "Dil seç",
    brandHome: "Chromai ana sayfa",
  },
  hero: {
    badge: "Yapay zekâ destekli renk paleti üreticisi",
    headlinePre: "Renk paletini ",
    headlineHighlight: "yapay zekâ",
    headlinePost: " üretsin",
    lede: "İstediğin atmosferi birkaç kelimeyle yaz — uyumlu ikili renk paletini anında oluştur, hex'leri tek tıkla kopyala.",
  },
  composer: {
    placeholder:
      "Nasıl bir atmosfer istersin? ör. sakin bir fintech panosu, gün batımında sahil kafesi…",
    generate: "Oluştur",
    generating: "Oluşturuluyor",
    modelMenu: "Yapay zekâ modeli",
  },
  models: {
    balanced: "Dengeli ve hızlı",
    strongest: "En güçlü",
    fastest: "En hızlı",
    openai: "OpenAI",
    googleFast: "Google · en hızlı",
    minimax: "Çok yönlü",
    kimiCode: "Kod odaklı",
    kimiGeneral: "Genel amaçlı",
    openSource: "Meta · açık kaynak",
    value: "Uygun maliyetli",
  },
  loader: (model) => `${model} ile paletler oluşturuluyor`,
  results: {
    title: "Paletler",
    titleFor: (q) => `"${q}" için paletler`,
    subStart: "Başlamak için bir his tarif et",
    subWorking: (model) => `${model} çalışıyor`,
    subAdded: (n) => `${n} yeni palet eklendi`,
    subFallback: (n) => `${n} palet eklendi · yerel kütüphaneden`,
    titleRecent: "Son Oluşturulanlar",
  },
  card: {
    eyebrow: "Renk Paleti",
    colorsCount: (n) => `${n} renk`,
    aiTitle: "AI Yorumu",
    aiTag: "analiz",
  },
  toast: {
    hexCopied: (hex) => `${hex} kopyalandı`,
    cssCopied: "Gradient CSS kopyalandı",
  },
  footer: {
    tagline:
      "Birkaç kelimeyle tarif et, yapay zekâ uyumlu renk paletini anında üretsin.",
    colProduct: "Ürün",
    colResources: "Kaynaklar",
    colCommunity: "Topluluk",
    linkCreate: "Palet Oluştur",
    linkPalettes: "Paletler",
    linkModels: "AI Modelleri",
    rights: (year) => `© ${year} Chromai. Tüm hakları saklıdır.`,
    credit: "Codelify & Musa Yazlık tarafından yapıldı",
  },
  library: [
    {
      name: "Lagün",
      subtitle: "Serin analog ikili",
      colors: [
        { name: "Turkuaz", hex: "#2DD4BF", role: "Ana renk" },
        { name: "Gök Mavisi", hex: "#3B82F6", role: "Vurgu" },
      ],
      comment:
        "Serin ve komşu bir geçiş; fintech, sağlık ve kurumsal panolar için güvenli bir seçim.",
      tags: ["Sakin", "Güvenilir", "Kurumsal"],
    },
    {
      name: "Orkide",
      subtitle: "Yaratıcı mor–pembe",
      colors: [
        { name: "Mor", hex: "#7C3AED", role: "Ana renk" },
        { name: "Fuşya", hex: "#EC4899", role: "Vurgu" },
      ],
      comment:
        "Komşu mor–pembe geçişi: yaratıcı ve premium bir his. Lansman ve kişisel marka için ideal.",
      tags: ["Yaratıcı", "Premium", "Cesur"],
    },
    {
      name: "Şafak",
      subtitle: "Sıcak turuncu–gül",
      colors: [
        { name: "Turuncu", hex: "#FB923C", role: "Ana renk" },
        { name: "Gül", hex: "#F43F5E", role: "Vurgu / CTA" },
      ],
      comment:
        "Sıcak ve davetkâr ikili; yemek, yaşam tarzı ve kampanya CTA'larında iştah açar.",
      tags: ["Enerjik", "Sıcak", "Davetkâr"],
    },
    {
      name: "Orman",
      subtitle: "Doğal yeşil–zeytin",
      colors: [
        { name: "Yeşil", hex: "#16A34A", role: "Ana renk" },
        { name: "Zeytin", hex: "#65A30D", role: "Vurgu" },
      ],
      comment:
        "Doğal ve dengeli; sürdürülebilirlik ve outdoor markaları için taze bir zemin.",
      tags: ["Doğal", "Taze", "Dengeli"],
    },
    {
      name: "Lavanta",
      subtitle: "Yumuşak mor–indigo",
      colors: [
        { name: "Lavanta", hex: "#A78BFA", role: "Ana renk" },
        { name: "İndigo", hex: "#818CF8", role: "Vurgu" },
      ],
      comment:
        "Hafif ve hayalperest; wellness, AI ve pastel arayüzlerde zarif durur.",
      tags: ["Yumuşak", "Modern", "Sakin"],
    },
    {
      name: "Okyanus",
      subtitle: "Ferah camgöbeği–mavi",
      colors: [
        { name: "Camgöbeği", hex: "#0EA5E9", role: "Ana renk" },
        { name: "Mavi", hex: "#2563EB", role: "Vurgu" },
      ],
      comment:
        "Ferah ve net; teknoloji, seyahat ve SaaS hero alanlarında güvenle parlar.",
      tags: ["Ferah", "Net", "Teknolojik"],
    },
    {
      name: "Toprak",
      subtitle: "Sıcak kahve–amber",
      colors: [
        { name: "Kahve", hex: "#B45309", role: "Ana renk" },
        { name: "Amber", hex: "#D97706", role: "Vurgu" },
      ],
      comment:
        "Organik ve sıcak; kahve, el yapımı ve butik markalara samimi bir karakter verir.",
      tags: ["Organik", "Sıcak", "Samimi"],
    },
    {
      name: "Gece Moru",
      subtitle: "Derin mor–indigo",
      colors: [
        { name: "Mor", hex: "#6D28D9", role: "Ana renk" },
        { name: "İndigo", hex: "#4F46E5", role: "Vurgu" },
      ],
      comment:
        "Gizemli ve premium; gece modu, müzik ve lüks ürün sayfaları için güçlü.",
      tags: ["Premium", "Gizemli", "Modern"],
    },
  ],
};

const en: Messages = {
  nav: {
    create: "Create",
    palettes: "Palettes",
    models: "Models",
    features: "Features",
    faq: "FAQ",
  },
  actions: {
    try: "Try Now",
    github: "GitHub repository",
    theme: "Toggle theme",
    language: "Select language",
    brandHome: "Chromai home",
  },
  hero: {
    badge: "AI-powered color palette generator",
    headlinePre: "Let ",
    headlineHighlight: "AI",
    headlinePost: " craft your color palette",
    lede: "Describe the mood in a few words — instantly generate a harmonious two-color palette and copy hex codes in one click.",
  },
  composer: {
    placeholder:
      "What mood are you after? e.g. a calm fintech dashboard, a beach café at sunset…",
    generate: "Generate",
    generating: "Generating",
    modelMenu: "AI model",
  },
  models: {
    balanced: "Balanced & fast",
    strongest: "Most powerful",
    fastest: "Fastest",
    openai: "OpenAI",
    googleFast: "Google · fastest",
    minimax: "Versatile",
    kimiCode: "Code-focused",
    kimiGeneral: "General purpose",
    openSource: "Meta · open source",
    value: "Cost-effective",
  },
  loader: (model) => `Generating palettes with ${model}`,
  results: {
    title: "Palettes",
    titleFor: (q) => `Palettes for "${q}"`,
    subStart: "Describe a mood to begin",
    subWorking: (model) => `${model} is working`,
    subAdded: (n) => `${n} new palettes added`,
    subFallback: (n) => `${n} palettes added · from local library`,
    titleRecent: "Recently Generated",
  },
  card: {
    eyebrow: "Color Palette",
    colorsCount: (n) => `${n} colors`,
    aiTitle: "AI Insight",
    aiTag: "analysis",
  },
  toast: {
    hexCopied: (hex) => `${hex} copied`,
    cssCopied: "Gradient CSS copied",
  },
  footer: {
    tagline:
      "Describe it in a few words and let AI instantly generate a harmonious color palette.",
    colProduct: "Product",
    colResources: "Resources",
    colCommunity: "Community",
    linkCreate: "Create Palette",
    linkPalettes: "Palettes",
    linkModels: "AI Models",
    rights: (year) => `© ${year} Chromai. All rights reserved.`,
    credit: "Built by Codelify & Musa Yazlık",
  },
  library: [
    {
      name: "Lagoon",
      subtitle: "Cool analogous pair",
      colors: [
        { name: "Turquoise", hex: "#2DD4BF", role: "Primary" },
        { name: "Sky Blue", hex: "#3B82F6", role: "Accent" },
      ],
      comment:
        "A cool, neighboring transition; a safe pick for fintech, health and corporate dashboards.",
      tags: ["Calm", "Trustworthy", "Corporate"],
    },
    {
      name: "Orchid",
      subtitle: "Creative purple–pink",
      colors: [
        { name: "Purple", hex: "#7C3AED", role: "Primary" },
        { name: "Fuchsia", hex: "#EC4899", role: "Accent" },
      ],
      comment:
        "A neighboring purple–pink blend: creative and premium. Ideal for launches and personal brands.",
      tags: ["Creative", "Premium", "Bold"],
    },
    {
      name: "Dawn",
      subtitle: "Warm orange–rose",
      colors: [
        { name: "Orange", hex: "#FB923C", role: "Primary" },
        { name: "Rose", hex: "#F43F5E", role: "Accent / CTA" },
      ],
      comment:
        "A warm, inviting pair; whets the appetite across food, lifestyle and campaign CTAs.",
      tags: ["Energetic", "Warm", "Inviting"],
    },
    {
      name: "Forest",
      subtitle: "Natural green–olive",
      colors: [
        { name: "Green", hex: "#16A34A", role: "Primary" },
        { name: "Olive", hex: "#65A30D", role: "Accent" },
      ],
      comment:
        "Natural and balanced; a fresh base for sustainability and outdoor brands.",
      tags: ["Natural", "Fresh", "Balanced"],
    },
    {
      name: "Lavender",
      subtitle: "Soft purple–indigo",
      colors: [
        { name: "Lavender", hex: "#A78BFA", role: "Primary" },
        { name: "Indigo", hex: "#818CF8", role: "Accent" },
      ],
      comment:
        "Light and dreamy; elegant across wellness, AI and pastel interfaces.",
      tags: ["Soft", "Modern", "Calm"],
    },
    {
      name: "Ocean",
      subtitle: "Airy cyan–blue",
      colors: [
        { name: "Cyan", hex: "#0EA5E9", role: "Primary" },
        { name: "Blue", hex: "#2563EB", role: "Accent" },
      ],
      comment:
        "Airy and crisp; shines confidently in tech, travel and SaaS hero areas.",
      tags: ["Airy", "Crisp", "Tech"],
    },
    {
      name: "Earth",
      subtitle: "Warm coffee–amber",
      colors: [
        { name: "Coffee", hex: "#B45309", role: "Primary" },
        { name: "Amber", hex: "#D97706", role: "Accent" },
      ],
      comment:
        "Organic and warm; gives a cozy character to coffee, handmade and boutique brands.",
      tags: ["Organic", "Warm", "Cozy"],
    },
    {
      name: "Midnight Purple",
      subtitle: "Deep purple–indigo",
      colors: [
        { name: "Purple", hex: "#6D28D9", role: "Primary" },
        { name: "Indigo", hex: "#4F46E5", role: "Accent" },
      ],
      comment:
        "Mysterious and premium; strong for dark mode, music and luxury product pages.",
      tags: ["Premium", "Mysterious", "Modern"],
    },
  ],
};

const de: Messages = {
  nav: {
    create: "Erstellen",
    palettes: "Paletten",
    models: "Modelle",
    features: "Funktionen",
    faq: "FAQ",
  },
  actions: {
    try: "Jetzt testen",
    github: "GitHub-Repository",
    theme: "Theme wechseln",
    language: "Sprache wählen",
    brandHome: "Chromai Startseite",
  },
  hero: {
    badge: "KI-gestützter Farbpaletten-Generator",
    headlinePre: "Lass die ",
    headlineHighlight: "KI",
    headlinePost: " deine Farbpalette gestalten",
    lede: "Beschreibe die Stimmung in wenigen Worten — erzeuge sofort eine harmonische Zwei-Farben-Palette und kopiere Hex-Codes mit einem Klick.",
  },
  composer: {
    placeholder:
      "Welche Stimmung suchst du? z. B. ein ruhiges Fintech-Dashboard, ein Strandcafé bei Sonnenuntergang…",
    generate: "Erstellen",
    generating: "Wird erstellt",
    modelMenu: "KI-Modell",
  },
  models: {
    balanced: "Ausgewogen & schnell",
    strongest: "Am leistungsstärksten",
    fastest: "Am schnellsten",
    openai: "OpenAI",
    googleFast: "Google · am schnellsten",
    minimax: "MiniMax · multimodal",
    kimiCode: "Kimi · Coding-fokussiert",
    kimiGeneral: "Kimi · multimodal",
    openSource: "Meta · Open Source",
    value: "Kostengünstig",
  },
  loader: (model) => `Paletten werden mit ${model} erstellt`,
  results: {
    title: "Paletten",
    titleFor: (q) => `Paletten für „${q}“`,
    subStart: "Beschreibe eine Stimmung zum Start",
    subWorking: (model) => `${model} arbeitet`,
    subAdded: (n) => `${n} neue Paletten hinzugefügt`,
    subFallback: (n) => `${n} Paletten hinzugefügt · aus lokaler Bibliothek`,
    titleRecent: "Zuletzt Erstellt",
  },
  card: {
    eyebrow: "Farbpalette",
    colorsCount: (n) => `${n} Farben`,
    aiTitle: "KI-Analyse",
    aiTag: "Analyse",
  },
  toast: {
    hexCopied: (hex) => `${hex} kopiert`,
    cssCopied: "Gradient-CSS kopiert",
  },
  footer: {
    tagline:
      "Beschreibe es in wenigen Worten und lass die KI sofort eine harmonische Farbpalette erzeugen.",
    colProduct: "Produkt",
    colResources: "Ressourcen",
    colCommunity: "Community",
    linkCreate: "Palette erstellen",
    linkPalettes: "Paletten",
    linkModels: "KI-Modelle",
    rights: (year) => `© ${year} Chromai. Alle Rechte vorbehalten.`,
    credit: "Erstellt von Codelify & Musa Yazlık",
  },
  library: [
    {
      name: "Lagune",
      subtitle: "Kühles analoges Paar",
      colors: [
        { name: "Türkis", hex: "#2DD4BF", role: "Primärfarbe" },
        { name: "Himmelblau", hex: "#3B82F6", role: "Akzent" },
      ],
      comment:
        "Ein kühler, benachbarter Übergang; eine sichere Wahl für Fintech-, Gesundheits- und Unternehmens-Dashboards.",
      tags: ["Ruhig", "Vertrauenswürdig", "Unternehmen"],
    },
    {
      name: "Orchidee",
      subtitle: "Kreatives Lila–Pink",
      colors: [
        { name: "Lila", hex: "#7C3AED", role: "Primärfarbe" },
        { name: "Fuchsia", hex: "#EC4899", role: "Akzent" },
      ],
      comment:
        "Ein benachbarter Lila–Pink-Verlauf: kreativ und hochwertig. Ideal für Launches und Personenmarken.",
      tags: ["Kreativ", "Premium", "Mutig"],
    },
    {
      name: "Morgenröte",
      subtitle: "Warmes Orange–Rosé",
      colors: [
        { name: "Orange", hex: "#FB923C", role: "Primärfarbe" },
        { name: "Rosé", hex: "#F43F5E", role: "Akzent / CTA" },
      ],
      comment:
        "Ein warmes, einladendes Paar; macht Appetit bei Food-, Lifestyle- und Kampagnen-CTAs.",
      tags: ["Energiegeladen", "Warm", "Einladend"],
    },
    {
      name: "Wald",
      subtitle: "Natürliches Grün–Oliv",
      colors: [
        { name: "Grün", hex: "#16A34A", role: "Primärfarbe" },
        { name: "Oliv", hex: "#65A30D", role: "Akzent" },
      ],
      comment:
        "Natürlich und ausgewogen; eine frische Basis für Nachhaltigkeits- und Outdoor-Marken.",
      tags: ["Natürlich", "Frisch", "Ausgewogen"],
    },
    {
      name: "Lavendel",
      subtitle: "Sanftes Lila–Indigo",
      colors: [
        { name: "Lavendel", hex: "#A78BFA", role: "Primärfarbe" },
        { name: "Indigo", hex: "#818CF8", role: "Akzent" },
      ],
      comment:
        "Leicht und verträumt; elegant in Wellness-, KI- und Pastell-Oberflächen.",
      tags: ["Sanft", "Modern", "Ruhig"],
    },
    {
      name: "Ozean",
      subtitle: "Luftiges Cyan–Blau",
      colors: [
        { name: "Cyan", hex: "#0EA5E9", role: "Primärfarbe" },
        { name: "Blau", hex: "#2563EB", role: "Akzent" },
      ],
      comment:
        "Luftig und klar; überzeugt in Tech-, Reise- und SaaS-Hero-Bereichen.",
      tags: ["Luftig", "Klar", "Technisch"],
    },
    {
      name: "Erde",
      subtitle: "Warmes Kaffee–Bernstein",
      colors: [
        { name: "Kaffee", hex: "#B45309", role: "Primärfarbe" },
        { name: "Bernstein", hex: "#D97706", role: "Akzent" },
      ],
      comment:
        "Organisch und warm; verleiht Kaffee-, Handwerks- und Boutique-Marken einen gemütlichen Charakter.",
      tags: ["Organisch", "Warm", "Gemütlich"],
    },
    {
      name: "Mitternachtslila",
      subtitle: "Tiefes Lila–Indigo",
      colors: [
        { name: "Lila", hex: "#6D28D9", role: "Primärfarbe" },
        { name: "Indigo", hex: "#4F46E5", role: "Akzent" },
      ],
      comment:
        "Geheimnisvoll und hochwertig; stark für Dark Mode, Musik und Luxus-Produktseiten.",
      tags: ["Premium", "Geheimnisvoll", "Modern"],
    },
  ],
};

export const messages: Record<Locale, Messages> = { tr, en, de };
