import { createJSONStorage } from "zustand/middleware";

const CURRENT_USER_STORAGE_KEY = "bubble-buddy-current-user";
const CART_STORAGE_PREFIX = "bubble-buddy-cart";
const WISHLIST_STORAGE_PREFIX = "bubble-buddy-wishlist";
const COMPARE_STORAGE_PREFIX = "bubble-buddy-compare";

type PersistedState<T> = {
  state?: {
    items: T[];
  };
  items?: T[];
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getActiveUserId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
}

export function setActiveUserId(userId: string | null) {
  if (!isBrowser()) return;
  if (userId) {
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, userId);
  } else {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}

export function getCartStorageKey(userId: string | null = null) {
  return `${CART_STORAGE_PREFIX}:${userId ?? "guest"}`;
}

export function getWishlistStorageKey(userId: string | null = null) {
  return `${WISHLIST_STORAGE_PREFIX}:${userId ?? "guest"}`;
}

export function getCompareStorageKey(userId: string | null = null) {
  return `${COMPARE_STORAGE_PREFIX}:${userId ?? "guest"}`;
}

export function getCurrentCartStorageKey() {
  return getCartStorageKey(getActiveUserId());
}

export function getCurrentWishlistStorageKey() {
  return getWishlistStorageKey(getActiveUserId());
}

export function getCurrentCompareStorageKey() {
  return getCompareStorageKey(getActiveUserId());
}

function parsePersistedItems<T>(raw: string | null): T[] | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedState<T>;
    if (parsed?.state?.items) {
      return parsed.state.items;
    }
    if (parsed?.items) {
      return parsed.items;
    }

    return null;
  } catch {
    return null;
  }
}

export function getPersistedCartItems(userId: string): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getCartStorageKey(userId));
  return parsePersistedItems(raw);
}

export function getPersistedWishlistItems(userId: string): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getWishlistStorageKey(userId));
  return parsePersistedItems(raw);
}

export function getGuestCartItems(): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getCartStorageKey("guest"));
  return parsePersistedItems(raw);
}

export function getGuestWishlistItems(): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getWishlistStorageKey("guest"));
  return parsePersistedItems(raw);
}

export function getPersistedCompareItems(userId: string): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getCompareStorageKey(userId));
  return parsePersistedItems(raw);
}

export function getGuestCompareItems(): unknown[] | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getCompareStorageKey("guest"));
  return parsePersistedItems(raw);
}

export const cartStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(getCurrentCartStorageKey());
  },
  setItem: (name: string, value: string) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(getCurrentCartStorageKey(), value);
  },
  removeItem: (name: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(getCurrentCartStorageKey());
  },
}));

export const wishlistStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(getCurrentWishlistStorageKey());
  },
  setItem: (name: string, value: string) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(getCurrentWishlistStorageKey(), value);
  },
  removeItem: (name: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(getCurrentWishlistStorageKey());
  },
}));

export const compareStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(getCurrentCompareStorageKey());
  },
  setItem: (name: string, value: string) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(getCurrentCompareStorageKey(), value);
  },
  removeItem: (name: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(getCurrentCompareStorageKey());
  },
}));
