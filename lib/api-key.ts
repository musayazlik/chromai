/**
 * Client-side persistence for the user's personal OpenRouter API key.
 *
 * The key is kept in `localStorage` so it survives reloads without forcing the
 * user to re-enter it, and is lightly obfuscated (XOR + Base64) so it is not
 * written as plain text.
 *
 * ⚠️  This is obfuscation, not encryption. Everything here runs in the browser
 *     and the secret below ships in the client bundle, so a determined user can
 *     always recover the value. Never persist secrets you can't afford to
 *     expose on the client.
 */

/** localStorage key under which the obfuscated value is stored. */
const STORAGE_KEY = process.env.NEXT_PUBLIC_API_KEY_STORAGE || "chromai_or_key";

/** Secret for the XOR pass. Public by design — see the file header. */
const OBFUSCATION_SECRET =
  process.env.NEXT_PUBLIC_API_KEY_SECRET || "ChR0m@1_S3cr3t_K3y_2026";

/** OpenRouter keys look like `sk-or-v1-…`. */
const API_KEY_PREFIX = "sk-or-";
const MIN_API_KEY_LENGTH = 10;

const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Symmetric XOR transform: running it twice with the same secret returns the
 * original input, so a single function both obfuscates and de-obfuscates.
 */
function xorCipher(input: string, secret: string): string {
  let output = "";
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
    output += String.fromCharCode(code);
  }
  return output;
}

/** UTF-8-safe Base64 encode (handles characters outside the Latin-1 range). */
function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** UTF-8-safe Base64 decode, the inverse of {@link encodeBase64}. */
function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Persists the API key (obfuscated). An empty/blank value clears it instead. */
export function saveApiKey(key: string): void {
  if (!isBrowser()) return;

  const trimmed = key.trim();
  if (!trimmed) {
    clearApiKey();
    return;
  }

  const obfuscated = encodeBase64(xorCipher(trimmed, OBFUSCATION_SECRET));
  localStorage.setItem(STORAGE_KEY, obfuscated);
}

/** Returns the stored API key, or an empty string if none is set / readable. */
export function getApiKey(): string {
  if (!isBrowser()) return "";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return "";

  try {
    const key = xorCipher(decodeBase64(stored), OBFUSCATION_SECRET);
    // Guard against a changed secret or corrupted value yielding garbage.
    return isValidApiKeyFormat(key) ? key : "";
  } catch {
    return "";
  }
}

/** Whether a usable API key is currently stored. */
export function hasApiKey(): boolean {
  return getApiKey() !== "";
}

/** Removes the stored API key. */
export function clearApiKey(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Lightweight shape check for an OpenRouter API key. */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length > MIN_API_KEY_LENGTH;
}
