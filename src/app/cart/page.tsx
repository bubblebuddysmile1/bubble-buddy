import CartPageClient from "@/components/cart/CartPageClient";
import BestSellingProducts from "@/components/store/BestSellingProducts";

export const metadata = {
  title: "Your cart bubble buddy smile",
};

export default function CartPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-8 text-foreground sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-3 sm:px-4">
        <div className="mb-8 text-center sm:mb-10 md:text-left">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Shopping bag</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Your cart</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Adjust quantities, remove items, and review your order total with a smooth, modern
            checkout-ready layout.
          </p>
        </div>

        <CartPageClient emptyCartRecommendations={<BestSellingProducts />} />
      </div>
    </main>
  );
}
