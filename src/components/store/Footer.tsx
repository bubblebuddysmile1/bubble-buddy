"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Mail, MessageCircle } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

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
  const [email, setEmail] = useState("");

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border mt-20 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* MAIN GRID - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* BRAND SECTION */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              bubble buddy smile
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover premium skincare, beauty care, and haircare products
              designed to make you glow naturally.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-4 sm:mt-5">
              <a
                href="https://www.instagram.com/bubble_buddy_smile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Instagram"
                className="text-foreground hover:text-primary transition-colors duration-200 h-9 w-9 sm:h-10 sm:w-10"
              >
                <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>

              <a
                href="mailto:chat@bubblebuddysmile.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open chat"
                className="text-foreground hover:text-primary transition-colors duration-200 h-9 w-9 sm:h-10 sm:w-10"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>

              <a
                href="mailto:info@bubblebuddysmile.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send email"
                className="text-foreground hover:text-primary transition-colors duration-200 h-9 w-9 sm:h-10 sm:w-10"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>

              <a
                href="https://www.facebook.com/bubblebuddysmile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Facebook"
                className="text-foreground hover:text-primary transition-colors duration-200 h-9 w-9 sm:h-10 sm:w-10"
              >
                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground">
              Quick Links
            </h3>

            <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-200 inline-block"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="hover:text-primary transition-colors duration-200 inline-block"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="hover:text-primary transition-colors duration-200 inline-block"
              >
                About Us
              </Link>

              <Link
                href="/offers"
                className="hover:text-primary transition-colors duration-200 inline-block"
              >
                Offers
              </Link>

              <Link
                href="/contact"
                className="hover:text-primary transition-colors duration-200 inline-block"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground">
              Categories
            </h3>

            <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
              {loading ? (
                <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
                  Loading categories...
                </p>
              ) : categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="hover:text-primary transition-colors duration-200 inline-block truncate"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No categories available.
                </p>
              )}
            </div>
          </div>

          {/* NEWSLETTER SECTION */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground">
              Stay Updated
            </h3>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Subscribe to get beauty tips and offers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input text-foreground placeholder:text-muted-foreground flex-1 h-10 sm:h-11 text-sm sm:text-base"
                />
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 h-10 sm:h-11 px-4 sm:px-6"
                >
                  Join
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION - Responsive */}
        <div className="border-t border-border mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm sm:text-base text-muted-foreground">
          <p className="text-center sm:text-left text-xs sm:text-sm">
            © 2025 bubble buddy smile. All rights reserved.
          </p>

          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors duration-200 text-xs sm:text-sm"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="hover:text-primary transition-colors duration-200 text-xs sm:text-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
