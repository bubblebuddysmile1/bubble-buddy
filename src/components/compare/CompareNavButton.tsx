"use client";

import Link from "next/link";
import { Columns } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { selectCompareCount, useCompareStore } from "@/store/compare-store";

export default function CompareNavButton() {
  const count = useCompareStore(selectCompareCount);

  return (
    <Link
      href="/compare"
      aria-label="Compare products"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <div className="relative inline-flex items-center justify-center">
        <Columns className="size-5 text-foreground" />
        {count > 0 ? (
          <span className="pointer-events-none absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground">
            {count}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
