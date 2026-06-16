import { getActiveUserId } from "./store-persistence";

export async function fetchServerCart() {
  try {
    const res = await fetch(`/api/user/cart`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.items ?? null;
  } catch (e) {
    return null;
  }
}

export async function postServerCart(items: { id: number; quantity: number }[]) {
  if (!getActiveUserId()) return;
  try {
    await fetch(`/api/user/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
      cache: "no-store",
    });
  } catch (e) {
    // ignore
  }
}

export async function fetchServerWishlist() {
  try {
    const res = await fetch(`/api/user/wishlist`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.items ?? null;
  } catch (e) {
    return null;
  }
}

export async function postServerWishlist(items: { id: number }[]) {
  if (!getActiveUserId()) return;
  try {
    await fetch(`/api/user/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
      cache: "no-store",
    });
  } catch (e) {
    // ignore
  }
}
