import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartProduct } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            const nextQty = clampQuantity(existing.quantity + quantity, product.stockQuantity);
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: nextQty } : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                quantity: clampQuantity(quantity, product.stockQuantity),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== productId) return item;
            if (quantity <= 0) return item;
            return {
              ...item,
              quantity: clampQuantity(quantity, item.stockQuantity),
            };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "bubble-buddy-cart" },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartSubtotal(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function selectCartItem(state: CartState, productId: number): CartItem | undefined {
  return state.items.find((item) => item.id === productId);
}

export function getCartCount(): number {
  return selectCartCount(useCartStore.getState());
}

export function getCartSubtotal(): number {
  return selectCartSubtotal(useCartStore.getState());
}
