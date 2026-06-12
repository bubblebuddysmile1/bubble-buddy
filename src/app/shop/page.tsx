import { Suspense } from "react";
import ShopBrowser from "@/components/store/ShopBrowser";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Shop</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Browse all products</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore our full catalog of beauty products, handcrafted for skincare, haircare, and makeup lovers.
          </p>
        </div>

        <Suspense fallback={<div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading shop browser...</div>}>
          <ShopBrowser />
        </Suspense>
      </div>
    </main>
  );
}
