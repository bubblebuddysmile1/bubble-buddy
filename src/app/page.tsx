import CategoriesSection from "@/components/store/CategoriesSection";
import HeroSection from "@/components/store/HeroSection";
import BestSellingProducts from "@/components/store/BestSellingProducts";
import OfferDiscountSection from "@/components/store/OfferDiscountSection";
import ProductList from "@/components/store/ProductList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <CategoriesSection />
      <BestSellingProducts />
      <OfferDiscountSection />
      <ProductList />
    </div>
  );
}
