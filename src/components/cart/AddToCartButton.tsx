"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartProduct } from "@/types/cart";

type AddToCartButtonProps = {
  product: CartProduct;
  quantity?: number;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  label?: string;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = "default",
  variant = "default",
  label = "Add to cart",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  const handleClick = () => {
    if (status === "adding") return;

    setStatus("adding");
    addItem(product, quantity);

    window.setTimeout(() => {
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1400);
    }, 280);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={status === "adding" || product.stockQuantity <= 0}
      className={cn(
        "relative overflow-hidden rounded-full transition-all duration-300",
        status === "added" && "bg-emerald-700 text-white hover:bg-emerald-700/90",
        status === "adding" && "scale-[0.98]",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center gap-2 transition-all duration-300",
          status === "adding" && "scale-90 opacity-70",
        )}
      >
        {status === "added" ? (
          <>
            <Check className="size-4 animate-in zoom-in duration-300" />
            Added!
          </>
        ) : (
          <>
            <ShoppingBag
              className={cn("size-4", status === "adding" && "animate-bounce")}
            />
            {product.stockQuantity <= 0 ? "Out of stock" : label}
          </>
        )}
      </span>
      {status === "adding" && (
        <span className="pointer-events-none absolute inset-0 animate-pulse bg-white/20" />
      )}
    </Button>
  );
}
