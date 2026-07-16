import type { Metadata } from "next";
import ShopBrowser from "@/components/store/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop - Bubble Buddy",
  description: "Browse skincare, haircare, and beauty products with filters and fast loading pages.",
};

export const revalidate = 60;

type ShopPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function ShopPage({ searchParams }: ShopPageProps) {
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

        <ShopBrowser searchParams={searchParams} />
      </div>
    </main>
  );
}
