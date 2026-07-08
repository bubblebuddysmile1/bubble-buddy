"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto px-4 md:px-9 space-y-6">
        <div className="h-64 rounded-2xl overflow-hidden">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton count={4} className="h-40 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton count={3} className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
