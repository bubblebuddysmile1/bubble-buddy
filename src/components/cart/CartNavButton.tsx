"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectCartCount, useCartStore } from "@/store/cart-store";

export default function CartNavButton() {
  const count = useCartStore(selectCartCount);
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
      href="/cart"
      aria-label="Cart"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
    >
      <ShoppingCart className={cn("h-5 w-5 transition-transform", bump && "scale-110")} />
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
