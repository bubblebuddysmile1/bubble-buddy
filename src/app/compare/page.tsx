import ComparePageClient from "@/components/compare/ComparePageClient";
import BestSellingProducts from "@/components/store/BestSellingProducts";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <ComparePageClient />
        <BestSellingProducts />
      </div>
    </main>
  );
}
