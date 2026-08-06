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
      <div className="relative overflow-hidden border-b border-border bg-card/70 backdrop-blur-lg">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-6 text-center sm:max-w-4xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary sm:text-base">Limited Time Offers</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Exclusive Deals for Your Beauty Routine
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover amazing discounts on premium cosmetics, skincare, and haircare products. Shop smart, save more, and enjoy fast delivery.
            </p>
          </div>
        </div>
      </div>

      <FlashSaleSection />

      {/* How to Use Coupons */}
      <div className="border-t border-border bg-card/30 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-primary">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Apply coupon codes in 3 easy steps</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Add Products",
                description: "Choose your favorite cosmetics and add them to the cart.",
                icon: "1️⃣",
              },
              {
                title: "Proceed to Checkout",
                description: "Review your order and add the coupon code at checkout.",
                icon: "2️⃣",
              },
              {
                title: "Apply & Save",
                description: "See instant savings and complete your purchase.",
                icon: "3️⃣",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5 p-8 shadow-lg sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_35%)]" />
            <div className="relative grid gap-8 text-center sm:grid-cols-[1.5fr_1fr] sm:items-center sm:text-left">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Shop today</p>
                <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Ready to save on beauty essentials?</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  Grab the best deals now and refresh your skincare routine with trusted favourites at amazing prices.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <Button className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
                <Button variant="secondary" className="rounded-full border border-border bg-background px-6 py-3 text-base font-semibold text-foreground transition hover:bg-muted">
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
