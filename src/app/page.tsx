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

export default function Home() {
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
      <HeroSection />
      <CategoriesSection />
      <BestSellingProducts />
      <OfferDiscountSection />
      <ProductList />
      <div className="container mx-auto px-4 md:px-9 mb-10 flex flex-col gap-3 rounded-[1.125rem] border border-[#ddd6c8] bg-[#f5f0e8] py-7">
        {/* Top row — badge + subtitle */}
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-[#b8956a] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6d3f]">
            Best Sellers
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#9e9488]">
            Curated collection for your daily beauty ritual.
          </span>
        </div>

        {/* ✦ Decorative divider line ✦ */}
        <div className="flex items-center gap-3.5 my-0.5">
          <div className="h-px flex-1 bg-gradient from-transparent via-[#c9a97a] to-transparent" />
          <span className="text-[13px] tracking-[6px] text-[#b8956a] select-none">
            ✦ ✦ ✦
          </span>
          <div className="h-px flex-1 bg-gradient from-transparent via-[#c9a97a] to-transparent" />
        </div>

      </div>
      <AdvancedPromoSection />
      <PromoBannerSection/>
    </div>
  );
}
