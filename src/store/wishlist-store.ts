import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistProduct } from "@/types/wishlist";
import { wishlistStorage } from "@/lib/store-persistence";

type WishlistState = {
  items: WishlistProduct[];
  toggleItem: (product: WishlistProduct) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  setItems: (items: WishlistProduct[]) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== product.id),
          }));
          return;
        }
        set((state) => ({
          items: [...state.items, product],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    { name: "bubble-buddy-wishlist", storage: wishlistStorage },
  ),
);

export function selectWishlistCount(state: WishlistState): number {
  return state.items.length;
}

export function selectIsInWishlist(state: WishlistState, productId: number): boolean {
  return state.items.some((item) => item.id === productId);
}
