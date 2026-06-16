/** Normalize any string into a safe #RRGGBB uppercase hex, falling back to grey. */
export function normalizeHex(input: string | undefined | null): string {
  const h = String(input ?? "").trim();
  return /^#?[0-9a-fA-F]{6}$/.test(h)
    ? `#${h.replace("#", "")}`.toUpperCase()
    : "#888888";
}
