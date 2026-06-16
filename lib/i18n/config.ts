export const LOCALES = ["tr", "en", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

/** Display label + Iconify circle-flag icon for each locale. */
export const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  tr: { label: "Türkçe", flag: "circle-flags:tr" },
  en: { label: "English", flag: "circle-flags:uk" },
  de: { label: "Deutsch", flag: "circle-flags:de" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** English name of each locale's language, used in the AI generation prompt. */
export const LOCALE_LANGUAGE_NAME: Record<Locale, string> = {
  tr: "Turkish",
  en: "English",
  de: "German",
};
