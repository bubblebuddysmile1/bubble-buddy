import type { Metadata } from "next";
import CategoriesSection from "@/components/store/CategoriesSection";
import HeroSection from "@/components/store/HeroSection";
import BestSellingProducts from "@/components/store/BestSellingProducts";
import OfferDiscountSection from "@/components/store/OfferDiscountSection";
import AdvancedPromoSection from "@/components/store/AdvancedPromoSection";
import ProductList from "@/components/store/ProductList";
import PromoBannerSection from "@/components/store/PromoBannerSection";

export const metadata: Metadata = {
  title: "Premium Beauty Essentials",
  description:
    "Discover premium skincare, haircare, and makeup essentials at Bubble Buddy with curated collections and secure shopping.",
};

export const revalidate = 60;

export default async function Home() {
  const { prisma } = await import("@/lib/prisma");

  const latestProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, slug: true, thumbnail: true, price: true, currency: true },
  });

  function decimalToNumber(value: unknown): number | null {
    if (value == null) return null;
    const v = value as { toNumber?: () => number };
    if (typeof v.toNumber === "function") return v.toNumber();
    return Number(value as unknown as number);
  }

  const latestProductsNormalized = latestProducts.map((p) => ({
    ...p,
    price: decimalToNumber(p.price),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Bubble Buddy Smile",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://bubblebuddysmile.com",
            description:
              "Bubble Buddy offers premium skincare, haircare, and makeup essentials with secure checkout and fast delivery.",
            areaServed: "India",
            priceRange: "$",
            sameAs: ["https://www.instagram.com/"],
          }),
        }}
      />
      <HeroSection products={latestProductsNormalized} />
      <CategoriesSection />
      <BestSellingProducts />
      <OfferDiscountSection />
      <ProductList />
      <BestSellingProducts />
      <AdvancedPromoSection />
      <PromoBannerSection/>
    </div>
  );
}
