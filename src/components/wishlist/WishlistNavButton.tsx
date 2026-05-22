"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectWishlistCount, useWishlistStore } from "@/store/wishlist-store";

export default function WishlistNavButton() {
  const count = useWishlistStore(selectWishlistCount);
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || count === 0) return;
    setBump(true);
    const timer = window.setTimeout(() => setBump(false), 420);
    return () => window.clearTimeout(timer);
  }, [count, mounted]);

  const displayCount = mounted ? count : 0;

  return (
    <Link
      href="/wishlist"
      aria-label="Wishlist"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          displayCount > 0 && "fill-primary/20 text-primary",
          bump && "scale-110",
        )}
      />
      {displayCount > 0 && (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground transition-transform",
            bump && "scale-125",
          )}
        >
          {displayCount > 9 ? "9+" : displayCount}
        </span>
      )}
    </Link>
  );
}
