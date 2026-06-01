"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Globe, Mail, MessageCircle, Star } from "lucide-react";

type CategoryLink = {
  name: string;
  slug: string;
};

type CategoriesResponse = {
  categories: CategoryLink[];
};

export default function Footer() {
  const [categories, setCategories] = useState<CategoryLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!active) return;

        if (!response.ok) {
          setCategories([]);
          return;
        }

        const data = (await response.json()) as CategoriesResponse;
        setCategories(data.categories ?? []);
      } catch {
        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);


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

            <p className="mt-4 text-md text-muted-foreground leading-6">
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

            <div className="mt-4 flex flex-col gap-3 text-md text-muted-foreground">

              <Link href="/" className="hover:text-primary">
                Home
              </Link>

              <Link href="/shop" className="hover:text-primary">
                Shop
              </Link>

              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>

              <Link href="/offers" className="hover:text-primary">
                Offers
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

            <div className="mt-4 flex flex-col gap-3 text-md text-muted-foreground">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories available.</p>
              )}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Stay Updated
            </h3>

            <p className="mt-4 text-md text-muted-foreground">
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
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-md text-muted-foreground">

          <p>
            © 2025 bubble buddy smile. All rights reserved.
          </p>

          <div className="flex gap-4 flex-wrap">

            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="/terms-and-conditions" className="hover:text-primary">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}