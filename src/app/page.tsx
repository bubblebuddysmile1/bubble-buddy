import CategoriesSection from "@/components/store/CategoriesSection";
import HeroSection from "@/components/store/HeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
<HeroSection />
<CategoriesSection />
      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-primary">
              Natural skincare crafted for radiant skin
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Discover premium ingredients, sustainable packaging, and formulations
              designed to bring out your natural glow.
            </p>

            <div className="mt-6 flex gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Shop Now</Button>
              <Button variant="ghost">Learn More</Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
              <h3 className="font-semibold text-lg text-foreground">Featured Bundle</h3>
              <p className="mt-2 text-sm text-muted-foreground">Cleanse + Glow set — limited edition</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-foreground">$48</div>
                  <div className="text-sm text-muted-foreground">(save 20%)</div>
                </div>
                <Button className="bg-primary text-primary-foreground">Add to cart</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted"></div>
              <h4 className="mt-4 font-medium text-foreground">Skin Care</h4>
              <p className="mt-2 text-sm text-muted-foreground">Cleansers, serums & moisturizers</p>
            </div>
            <div className="rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted"></div>
              <h4 className="mt-4 font-medium text-foreground">Hair Care</h4>
              <p className="mt-2 text-sm text-muted-foreground">Nourishing shampoos & treatments</p>
            </div>
            <div className="rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted"></div>
              <h4 className="mt-4 font-medium text-foreground">Makeup</h4>
              <p className="mt-2 text-sm text-muted-foreground">Clean, buildable coverage</p>
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground">Featured Products</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-card p-4 shadow-sm">
                <div className="h-40 bg-muted rounded-md" />
                <h3 className="mt-3 font-medium text-foreground">Product {i + 1}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">$24</div>
                  <Button size="sm" variant="ghost">Add</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-16 bg-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Join our newsletter</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get beauty tips and exclusive offers.</p>
          </div>
          <div className="w-full sm:w-auto flex gap-2">
            <Input placeholder="Your email" className="bg-input text-foreground placeholder:text-muted-foreground" />
            <Button className="bg-primary text-primary-foreground">Subscribe</Button>
          </div>
        </section>
      </main>

    </div>
  );
}
