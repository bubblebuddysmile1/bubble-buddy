"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type CartQuantityControlProps = {
  productId: number;
  quantity: number;
  stockQuantity: number;
  className?: string;
};

export default function CartQuantityControl({
  productId,
  quantity,
  stockQuantity,
  className,
}: CartQuantityControlProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const decrease = () => {
    if (quantity <= 1) {
      removeItem(productId);
      return;
    }
    updateQuantity(productId, quantity - 1);
  };

  const increase = () => {
    if (quantity >= stockQuantity) return;
    updateQuantity(productId, quantity + 1);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="inline-flex items-center rounded-full border border-border bg-background p-1 shadow-sm">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={quantity <= 1 ? "Remove item" : "Decrease quantity"}
          onClick={decrease}
          className="rounded-full"
        >
          {quantity <= 1 ? <Trash2 className="size-4 text-destructive" /> : <Minus className="size-4" />}
        </Button>
        <span className="min-w-10 text-center text-sm font-semibold tabular-nums">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Increase quantity"
          onClick={increase}
          disabled={quantity >= stockQuantity}
          className="rounded-full"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
