import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

const STORAGE_KEY = "chromai-locale";
const listeners = new Set<() => void>();

let snapshot: Locale = DEFAULT_LOCALE;
let hydrated = false;

function readStored(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
    const browser = navigator.language?.slice(0, 2);
    if (isLocale(browser)) return browser;
  } catch {
    // localStorage / navigator unavailable — fall through to default
  }
  return DEFAULT_LOCALE;
}

/** Client snapshot — lazily reads the persisted/browser locale once. */
export function getLocaleSnapshot(): Locale {
  if (!hydrated) {
    hydrated = true;
    snapshot = readStored();
  }
  return snapshot;
}

/** Server (and first hydration) snapshot — always the default locale. */
export function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function subscribeLocale(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = readStored();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function setStoredLocale(locale: Locale): void {
  snapshot = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore persistence errors
  }
  listeners.forEach((listener) => listener());
}
