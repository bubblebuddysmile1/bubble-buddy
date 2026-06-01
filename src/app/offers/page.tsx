import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offers & Promotions - Bubble Buddy",
  description: "Exclusive offers and promotions for Bubble Buddy Smile products",
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

      {/* Current Promotions */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-4xl font-bold">Current Promotions</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Offer 1 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                🎉 Limited Time
              </div>
              <h3 className="text-2xl font-bold">Summer Mega Sale</h3>
              <p className="text-sm text-muted-foreground">
                Get up to 40% off on selected skincare and haircare products this summer.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Valid Till: July 31, 2026</p>
                <p className="text-xs font-medium text-muted-foreground">Minimum Order: ₹5,000</p>
              </div>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                💎 Bulk Orders
              </div>
              <h3 className="text-2xl font-bold">Wholesale Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Special pricing for bulk orders. Perfect for salon owners and beauty brands.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Order 100+ Units: 25% Off</p>
                <p className="text-xs font-medium text-muted-foreground">Order 500+ Units: 35% Off</p>
              </div>
            </div>
          </div>

          {/* Offer 3 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500">
                ✨ New Users
              </div>
              <h3 className="text-2xl font-bold">Welcome Bonus</h3>
              <p className="text-sm text-muted-foreground">
                New customers get ₹1,000 off on their first order over ₹10,000.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Coupon: WELCOME1000</p>
                <p className="text-xs font-medium text-muted-foreground">One time per account</p>
              </div>
            </div>
          </div>

          {/* Offer 4 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-500">
                👥 Referral Program
              </div>
              <h3 className="text-2xl font-bold">Refer & Earn</h3>
              <p className="text-sm text-muted-foreground">
                Refer a friend and both of you get ₹500 discount on next orders.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Unlimited referrals</p>
                <p className="text-xs font-medium text-muted-foreground">Valid for all customers</p>
              </div>
            </div>
          </div>

          {/* Offer 5 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-500">
                🎁 Bundle Offers
              </div>
              <h3 className="text-2xl font-bold">Combo Packages</h3>
              <p className="text-sm text-muted-foreground">
                Buy combo sets and save up to 20% on your purchase.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Skincare Bundle: 20% Off</p>
                <p className="text-xs font-medium text-muted-foreground">Haircare Bundle: 15% Off</p>
              </div>
            </div>
          </div>

          {/* Offer 6 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
                📅 Festival Specials
              </div>
              <h3 className="text-2xl font-bold">Seasonal Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Extra savings during festivals and special occasions throughout the year.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Diwali: 30% Off</p>
                <p className="text-xs font-medium text-muted-foreground">Holi & More: Special Rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
