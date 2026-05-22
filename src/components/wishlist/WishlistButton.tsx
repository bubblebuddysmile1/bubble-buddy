"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectIsInWishlist, useWishlistStore } from "@/store/wishlist-store";
import type { WishlistProduct } from "@/types/wishlist";

type WishlistButtonProps = {
  product: WishlistProduct;
  variant?: "icon" | "overlay" | "pill";
  className?: string;
  showLabel?: boolean;
};

export default function WishlistButton({
  product,
  variant = "icon",
  className,
  showLabel = false,
}: WishlistButtonProps) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isSaved = useWishlistStore((s) => selectIsInWishlist(s, product.id));
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 500);
  };

  const saved = mounted && isSaved;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={saved}
      className={cn(
        buttonVariants({ variant: variant === "overlay" ? "secondary" : "ghost", size: "icon" }),
        "relative transition-all duration-300",
        variant === "overlay" &&
          "size-10 rounded-full border border-white/40 bg-card/90 shadow-lg backdrop-blur-sm hover:bg-card",
        variant === "pill" && "h-10 w-auto gap-2 rounded-full px-4",
        pulse && "scale-110",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-5 transition-all duration-300",
          saved ? "fill-primary text-primary" : "text-muted-foreground",
          pulse && saved && "animate-ping-once",
        )}
      />
      {showLabel && (
        <span className="text-sm font-semibold">{saved ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}
