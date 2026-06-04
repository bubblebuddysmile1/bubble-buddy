const RECENTLY_VIEWED_KEY = "bubble-buddy-recently-viewed";
const MAX_RECENTLY_VIEWED = 8;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getRecentlyViewedSlugs(): string[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}

export function addRecentlyViewedSlug(slug: string) {
  if (!isBrowser()) return;
  const normalized = String(slug ?? "").trim();
  if (!normalized) return;

  const slugs = getRecentlyViewedSlugs().filter((item) => item !== normalized);
  slugs.unshift(normalized);

  window.localStorage.setItem(
    RECENTLY_VIEWED_KEY,
    JSON.stringify(slugs.slice(0, MAX_RECENTLY_VIEWED)),
  );
}
