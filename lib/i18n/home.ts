import type { Locale } from "./config";
import { useI18n } from "./provider";

interface Stat {
  value: string;
  label: string;
}
interface QA {
  q: string;
  a: string;
}

export interface HomeMessages {
  stats: Stat[];
  founder: {
    eyebrow: string;
    name: string;
    role: string;
    quote: string;
    initials: string;
    tags: string[];
  };
  faq: { eyebrow: string; title: string; subtitle: string; items: QA[] };
}

const tr: HomeMessages = {
  stats: [
    { value: "7+", label: "AI modeli" },
    { value: "3", label: "dil" },
    { value: "2", label: "renkli uyum" },
    { value: "∞", label: "kombinasyon" },
  ],
  founder: {
    eyebrow: "Kurucu",
    name: "Musa Yazlık",
    role: "Kurucu & Geliştirici",
    quote:
      "Chromai'yi, renk seçimini saniyelere indiren; tasarımcı sezgisini yapay zekânın hızıyla buluşturan bir araç olsun diye yaptım.",
    initials: "MY",
    tags: ["Açık kaynak", "Tasarım odaklı", "Yapay zekâ"],
  },
  faq: {
    eyebrow: "SSS",
    title: "Sıkça sorulan sorular",
    subtitle: "Aklındakileri hızlıca yanıtlayalım.",
    items: [
      {
        q: "Chromai ücretsiz mi?",
        a: "Arayüz tamamen açık kaynak ve ücretsiz. AI üretimi için kendi OpenRouter anahtarını eklemen yeterli.",
      },
      {
        q: "Hangi yapay zekâ modellerini kullanabilirim?",
        a: "Claude, GPT, Gemini, Llama, DeepSeek ve daha fazlası — hepsi OpenRouter üzerinden seçilebilir.",
      },
      {
        q: "Ürettiğim paletleri nasıl kullanırım?",
        a: "Her rengin hex kodunu ya da hazır gradient CSS'i tek tıkla kopyalayıp doğrudan projene yapıştırabilirsin.",
      },
      {
        q: "Anahtarım olmadan çalışır mı?",
        a: "Evet. Anahtar yoksa Chromai, diline uygun yerel palet kütüphanesinden zarif örnekler gösterir.",
      },
      {
        q: "API anahtarım güvende mi?",
        a: "Evet. API key'iniz tarayıcınızda şifrelenmiş olarak saklanır ve hiçbir sunucuya gönderilmez. Sadece OpenRouter API'ye doğrudan istek yapmak için kullanılır.",
      },
    ],
  },
};

const en: HomeMessages = {
  stats: [
    { value: "7+", label: "AI models" },
    { value: "3", label: "languages" },
    { value: "2", label: "color harmony" },
    { value: "∞", label: "combinations" },
  ],
  founder: {
    eyebrow: "Founder",
    name: "Musa Yazlık",
    role: "Founder & Developer",
    quote:
      "I built Chromai to turn color decisions into seconds — pairing a designer's intuition with the speed of AI.",
    initials: "MY",
    tags: ["Open source", "Design-led", "AI"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Quick answers to what's on your mind.",
    items: [
      {
        q: "Is Chromai free?",
        a: "The interface is fully open source and free. Just add your own OpenRouter key for AI generation.",
      },
      {
        q: "Which AI models can I use?",
        a: "Claude, GPT, Gemini, Llama, DeepSeek and more — all selectable through OpenRouter.",
      },
      {
        q: "How do I use the palettes I generate?",
        a: "Copy each color's hex or the ready-made gradient CSS in one click and paste it straight into your project.",
      },
      {
        q: "Does it work without a key?",
        a: "Yes. Without a key, Chromai shows elegant samples from a local palette library in your language.",
      },
      {
        q: "Is my API key secure?",
        a: "Yes. Your API key is stored encrypted in your browser and never sent to any server. It's only used for direct requests to the OpenRouter API.",
      },
    ],
  },
};

const de: HomeMessages = {
  stats: [
    { value: "7+", label: "KI-Modelle" },
    { value: "3", label: "Sprachen" },
    { value: "2", label: "Farbharmonie" },
    { value: "∞", label: "Kombinationen" },
  ],
  founder: {
    eyebrow: "Gründer",
    name: "Musa Yazlık",
    role: "Gründer & Entwickler",
    quote:
      "Ich habe Chromai entwickelt, um Farbentscheidungen auf Sekunden zu verkürzen — Designer-Intuition trifft auf die Geschwindigkeit der KI.",
    initials: "MY",
    tags: ["Open Source", "Design-orientiert", "KI"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Häufig gestellte Fragen",
    subtitle: "Schnelle Antworten auf deine Fragen.",
    items: [
      {
        q: "Ist Chromai kostenlos?",
        a: "Die Oberfläche ist vollständig Open Source und kostenlos. Füge einfach deinen eigenen OpenRouter-Schlüssel für die KI-Generierung hinzu.",
      },
      {
        q: "Welche KI-Modelle kann ich nutzen?",
        a: "Claude, GPT, Gemini, Llama, DeepSeek und mehr — alle über OpenRouter wählbar.",
      },
      {
        q: "Wie verwende ich die erzeugten Paletten?",
        a: "Kopiere den Hex-Wert jeder Farbe oder das fertige Gradient-CSS mit einem Klick und füge es direkt in dein Projekt ein.",
      },
      {
        q: "Funktioniert es ohne Schlüssel?",
        a: "Ja. Ohne Schlüssel zeigt Chromai elegante Beispiele aus einer lokalen Palettenbibliothek in deiner Sprache.",
      },
      {
        q: "Ist mein API-Schlüssel sicher?",
        a: "Ja. Ihr API-Schlüssel wird verschlüsselt in Ihrem Browser gespeichert und niemals an einen Server gesendet. Er wird nur für direkte Anfragen an die OpenRouter API verwendet.",
      },
    ],
  },
};

export const HOME_MESSAGES: Record<Locale, HomeMessages> = { tr, en, de };

/** Returns the home-section copy for the active locale. */
export function useHome(): HomeMessages {
  return HOME_MESSAGES[useI18n().locale];
}
