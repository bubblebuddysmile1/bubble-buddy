"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishlistItemCard from "@/components/wishlist/WishlistItemCard";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPageClient() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wishlist-empty-enter mx-auto max-w-lg rounded-[2rem] border border-border bg-card p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Heart className="size-9 text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-foreground">Your wishlist is empty</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Tap the heart on any product to save it here. Your list stays on this device.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Discover products
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-card/80 px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          {items.length} saved {items.length === 1 ? "product" : "products"}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearWishlist}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Clear all
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((product, index) => (
          <WishlistItemCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
