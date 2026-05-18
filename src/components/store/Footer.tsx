import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Globe, Mail, MessageCircle, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 text-foreground">

      <div className="container mx-auto px-4 py-12">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-primary">
              bubble buddy smile
            </h2>

            <p className="mt-4 text-sm text-muted-foreground leading-6">
              Discover premium skincare, beauty care,
              and haircare products designed to make
              you glow naturally.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-3 mt-5">

              <Button variant="ghost" size="icon" aria-label="Visit website" className="text-foreground hover:text-primary">
                <Globe className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" aria-label="Open chat" className="text-foreground hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" aria-label="Send email" className="text-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" aria-label="Favorites" className="text-foreground hover:text-primary">
                <Star className="h-5 w-5" />
              </Button>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">

              <Link href="/" className="hover:text-primary">
                Home
              </Link>

              <Link href="/shop" className="hover:text-primary">
                Shop
              </Link>

              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>

              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>

            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Categories
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">

              <Link href="/categories/skincare" className="hover:text-primary">
                Skin Care
              </Link>

              <Link href="/categories/haircare" className="hover:text-primary">
                Hair Care
              </Link>

              <Link href="/categories/makeup" className="hover:text-primary">
                Makeup
              </Link>

              <Link href="/categories/beauty" className="hover:text-primary">
                Beauty Products
              </Link>

            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Stay Updated
            </h3>

            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe to get beauty tips and offers.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">

              <Input
                placeholder="Enter your email"
                className="bg-input text-foreground placeholder:text-muted-foreground"
              />

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join
              </Button>

            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

          <p>
            © 2025 bubble buddy smile. All rights reserved.
          </p>

          <div className="flex gap-4">

            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-primary">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}