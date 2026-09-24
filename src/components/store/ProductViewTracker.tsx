"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";
import type { CartProduct } from "@/types/cart";

export default function ProductViewTracker({ product }: { product: CartProduct }) {
  useEffect(() => {
    trackViewItem(product);
  }, [product]);

  return null;
}
