import Link from "next/link";
import { Button } from "@/components/ui/button";
import FlashSaleSection from "@/components/store/FlashSaleSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beauty Deals & Discounts | Bubble Buddy Smile Offers",
  description:
    "Grab exclusive deals on skincare & haircare essentials. Limited-time offers with coupon codes — save more on every order.",
  alternates: { canonical: "https://bubblebuddysmile.com/offers" },
};


export default function OffersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Exclusive Offers
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Discover amazing deals on premium cosmetic products. Special discounts for bulk orders and loyal customers.
            </p>
          </div>
        </div>
      </div>
      <FlashSaleSection />

      {/* How to Use Coupons */}
      <div className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-4xl font-bold">How to Use Coupon Codes</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                1️⃣
              </div>
              <h3 className="text-xl font-semibold">Add Products</h3>
              <p className="text-sm text-muted-foreground">
                Browse and add your desired cosmetic products to the shopping cart.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                2️⃣
              </div>
              <h3 className="text-xl font-semibold">Proceed to Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Review your order and proceed to the checkout page to enter your coupon code.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                3️⃣
              </div>
              <h3 className="text-xl font-semibold">Apply & Save</h3>
              <p className="text-sm text-muted-foreground">
                Enter the coupon code in the discount section and see your savings instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-linear-to-r from-primary/10 via-accent/5 to-primary/10 p-12 sm:p-16 backdrop-blur-lg">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-linear-to-r from-primary/0 via-primary/5 to-accent/5" />
            
            <div className="relative space-y-6 text-center">
              <h2 className="text-4xl font-bold">Ready to Shop?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Browse our full collection of premium cosmetic products and take advantage of these amazing offers today.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Button className="rounded-full px-8 py-3 text-base font-semibold">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
                <Button variant="secondary" className="rounded-full px-8 py-3 text-base font-semibold">
                  <Link href="/contact-us">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
