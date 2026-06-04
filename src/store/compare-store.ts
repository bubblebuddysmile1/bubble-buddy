import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompareProduct } from "@/types/compare";
import { compareStorage } from "@/lib/store-persistence";

type CompareState = {
  items: CompareProduct[];
  toggleItem: (product: CompareProduct) => void;
  removeItem: (productId: number) => void;
  clearCompare: () => void;
  setItems: (items: CompareProduct[]) => void;
};

export const useCompareStore = create<CompareState>()(
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

      clearCompare: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    { name: "bubble-buddy-compare", storage: compareStorage },
  ),
);

export function selectCompareCount(state: CompareState): number {
  return state.items.length;
}

export function selectIsInCompare(state: CompareState, productId: number): boolean {
  return state.items.some((item) => item.id === productId);
}
