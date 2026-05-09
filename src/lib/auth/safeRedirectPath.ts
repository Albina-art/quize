/** Не допускает внешние URL в open-redirect («next», «return»). */
export function safeRedirectPath(raw: string | null | undefined, fallback = "/"): string {
  if (raw == null || raw === "") return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  return raw;
}
