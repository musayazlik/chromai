"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import type { Locale } from "./config";
import { messages, type Messages } from "./messages";
import {
  getLocaleSnapshot,
  getServerLocaleSnapshot,
  setStoredLocale,
  subscribeLocale,
} from "./store";

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  // keep <html lang> in sync (external system, not React state)
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setStoredLocale(next), []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: messages[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
