"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/Skeleton";

import { Mail, MessageCircle } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { BUSINESS_EMAIL, BUSINESS_WHATSAPP_LINK } from "@/lib/contact";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFeedback({ type: "error", message: "Please enter your email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to subscribe right now.");
      }

      setFeedback({ type: "success", message: data?.message || "Thanks for subscribing!" });
      setEmail("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to subscribe right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-16 sm:mt-20 text-foreground">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* MAIN GRID - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-6 lg:gap-10">
          {/* BRAND SECTION */}
          <div className="sm:col-span-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary text-left">
              bubble buddy smile
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
              Premium skincare, beauty care, and haircare products designed for natural glow.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-start gap-3 mt-5">
              <a
                href="https://www.instagram.com/bubble_buddy_smile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Instagram"
                className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              <a
                href={BUSINESS_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open WhatsApp chat"
                className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>

              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send email"
                className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>

              <a
                href="https://www.facebook.com/bubblebuddysmile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Facebook"
                className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS & CATEGORIES - 2 Columns */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-6">
            {/* QUICK LINKS */}
            <div>
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground text-left">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground text-left">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>

              <Link href="/shop" className="hover:text-primary transition-colors">
                Shop
              </Link>

              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>

              <Link href="/offers" className="hover:text-primary transition-colors">
                Offers
              </Link>

              <Link href="/contact-us" className="hover:text-primary transition-colors">
                Contact
              </Link>
              
              <Link href="/frequently-asked-questions" className="hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground text-left">
              Categories
            </h3>

            <div className="mt-4 flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground text-left">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-3 w-3/4 rounded-full" />
                  ))}
                </div>
              ) : categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No categories available.</p>
              )}
            </div>
            </div>
          </div>

          {/* NEWSLETTER SECTION */}
          <div className="sm:col-span-1">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground text-left">
              Stay Updated
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-muted-foreground text-left">
              Subscribe to get beauty tips and offers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (feedback) setFeedback(null);
                  }}
                  required
                  className="bg-input text-foreground placeholder:text-muted-foreground w-full h-9 sm:h-10 text-xs sm:text-sm"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full h-9 sm:h-10 text-xs sm:text-sm disabled:opacity-70"
                >
                  {isSubmitting ? "Joining..." : "Join"}
                </Button>
              </div>
              {feedback && (
                <p className={`mt-2 text-xs ${feedback.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                  {feedback.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION - Responsive */}
        <div className="border-t border-border mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © 2025 bubble buddy smile. All rights reserved.
          </p>

          <div className="flex gap-3 sm:gap-4 lg:gap-6 flex-wrap justify-center mt-4 sm:mt-6">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Privacy Policy
            </Link>

            <span className="text-muted-foreground">•</span>

            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Terms & Conditions
            </Link>

            <span className="text-muted-foreground">•</span>

            <Link href="/shipping-policy" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Shipping Policy
            </Link>

            <span className="text-muted-foreground">•</span>

            <Link href="/refund-policy" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
