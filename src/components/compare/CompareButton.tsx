"use client";

import { useEffect, useState } from "react";
import { Columns } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectIsInCompare, useCompareStore } from "@/store/compare-store";
import type { CompareProduct } from "@/types/compare";

type CompareButtonProps = {
  product: CompareProduct;
  variant?: "icon" | "overlay" | "pill";
  className?: string;
  showLabel?: boolean;
};

export default function CompareButton({
  product,
  variant = "icon",
  className,
  showLabel = false,
}: CompareButtonProps) {
  const toggleItem = useCompareStore((s) => s.toggleItem);
  const isCompared = useCompareStore((s) => selectIsInCompare(s, product.id));
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 400);
  };

  const compared = mounted && isCompared;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={compared ? `Remove ${product.name} from compare` : `Compare ${product.name}`}
      aria-pressed={compared}
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
      <Columns
        className={cn(
          "size-5 transition-all duration-300",
          compared ? "text-primary" : "text-muted-foreground",
          pulse && compared && "animate-ping-once",
        )}
      />
      {showLabel && (
        <span className="text-sm font-semibold">{compared ? "Compared" : "Compare"}</span>
      )}
    </button>
  );
}
