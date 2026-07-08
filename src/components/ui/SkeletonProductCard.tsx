"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function SkeletonProductCard() {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-card p-0 shadow-lg">
      <div className="relative h-80 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
