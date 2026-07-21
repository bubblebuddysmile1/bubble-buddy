import type { Metadata } from "next";
import ShopBrowser from "@/components/store/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop Beauty Products Online | Bubble Buddy Smile",
  description:
    "Browse our full range of skincare, haircare & makeup essentials. Filter by category, price & bestsellers — fast shipping across India.",
  keywords: ["buy skincare online", "shop beauty products", "haircare online india","face wash","primium"],
  alternates: { canonical: "https://bubblebuddysmile.com/shop" },
  openGraph: {
    title: "Shop All Products | Bubble Buddy Smile",
    description: "Explore our full collection of beauty essentials — face care, skincare, haircare & more.",
    url: "https://bubblebuddysmile.com/shop",
    type: "website",
  },
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
