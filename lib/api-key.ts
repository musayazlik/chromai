const STORAGE_KEY = "chromai_or_key";
const XOR_KEY = "ChR0m@1_S3cr3t_K3y_2026";

function xorEncode(text: string, key: string): string {
  const result: number[] = [];
  for (let i = 0; i < text.length; i++) {
    result.push(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return String.fromCharCode(...result);
}

function toBase64(str: string): string {
  if (typeof window === "undefined") return "";
  try {
    return btoa(str);
  } catch {
    return btoa(encodeURIComponent(str));
  }
}

function fromBase64(str: string): string {
  if (typeof window === "undefined") return "";
  try {
    return atob(str);
  } catch {
    return decodeURIComponent(atob(str));
  }
}

export function saveApiKey(key: string): void {
  if (typeof window === "undefined") return;
  const encoded = xorEncode(key, XOR_KEY);
  localStorage.setItem(STORAGE_KEY, toBase64(encoded));
}

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return "";
  try {
    const decoded = fromBase64(stored);
    return xorEncode(decoded, XOR_KEY);
  } catch {
    return "";
  }
}

export function hasApiKey(): boolean {
  return typeof window !== "undefined" && !!getApiKey();
}

export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith("sk-or-") && key.length > 10;
}
