"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectCartCount, useCartStore } from "@/store/cart-store";

const CART_REMINDER_DELAY = 1 * 60 * 1000;
export default function CartNavButton() {
  const count = useCartStore(selectCartCount);
  const pathname = usePathname();
  const [reminderPath, setReminderPath] = useState<string | null>(null);
  const displayCount = count;

  useEffect(() => {
    const reminderTimer = window.setTimeout(() => {
      setReminderPath(pathname);
    }, CART_REMINDER_DELAY);

    return () => window.clearTimeout(reminderTimer);
  }, [pathname]);

  return (
    <div className="relative">
      <Link
        href="/cart"
        aria-label="Cart"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
      >
        <ShoppingCart className={cn("h-5 w-5 transition-transform")} />
        {displayCount > 0 && (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground transition-transform",
            )}
          >
            {displayCount > 9 ? "9+" : displayCount}
          </span>
        )}
      </Link>
      {reminderPath === pathname && (
        <Link
          href="/cart"
          className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-300"
        >
          Check cart
        </Link>
      )}
    </div>
  );
}
