"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";

import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4">

        {/* TOP NAVBAR */}
        <div className="flex h-16 items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <Sheet>
              <SheetTrigger
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </SheetTrigger>

              <SheetContent side="left" className="w-72 px-6 py-8 bg-background border-r border-border shadow-2xl">

                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                  <Link
                    href="/"
                    className="w-full rounded-3xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition duration-200 hover:border-primary hover:text-primary hover:bg-muted"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="w-full rounded-3xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition duration-200 hover:border-primary hover:text-primary hover:bg-muted"
                  >
                    Shop
                  </Link>

                  <div className="w-full rounded-3xl border border-border bg-card p-2">
                    <details className="group overflow-hidden rounded-3xl">
                      <summary className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted">
                        Categories
                        <ChevronDown className="h-4 w-4 transition-transform duration-150 group-open:-rotate-180" />
                      </summary>
                      <div className="mt-2 flex flex-col gap-2 px-3 pb-3">
                        <Link
                          href="/categories/skincare"
                          className="block rounded-2xl px-3 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
                        >
                          Skin Care
                        </Link>
                        <Link
                          href="/categories/haircare"
                          className="block rounded-2xl px-3 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
                        >
                          Hair Care
                        </Link>
                        <Link
                          href="/categories/beauty"
                          className="block rounded-2xl px-3 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
                        >
                          Beauty
                        </Link>
                      </div>
                    </details>
                  </div>

                  <Link
                    href="/offers"
                    className="w-full rounded-3xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition duration-200 hover:border-primary hover:text-primary hover:bg-muted"
                  >
                    Offers
                  </Link>
                </div>

              </SheetContent>
            </Sheet>

            {/* LOGO */}
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-primary"
            >
                Bubble Buddy 
            </Link>

          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-xl relative">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search beauty products..."
              className="pl-10 rounded-full bg-input text-foreground border-border focus-visible:border-ring focus-visible:ring-ring/50"
            />

          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-1 md:gap-3">

            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="pb-4 md:hidden">

          <div className="relative">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />

            <Input
              placeholder="Search products..."
              className="pl-10 rounded-full bg-input text-foreground border-border focus-visible:border-ring focus-visible:ring-ring/50"
            />

          </div>

        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex w-full items-center justify-center gap-6 h-12 text-sm font-medium">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>

          <Link href="/shop" className="transition hover:text-primary">
            Shop
          </Link>

          <details className="relative group">
            <summary className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted hover:text-primary [&::-webkit-details-marker]:hidden">
              Categories
              <ChevronDown className="h-4 w-4 transition-transform duration-150 group-open:-rotate-180" />
            </summary>
            <div className="absolute left-1/2 top-full z-20 mt-2 min-w-48 -translate-x-1/2 rounded-3xl border border-border bg-card p-2 shadow-xl">
              <Link
                href="/categories/skincare"
                className="block rounded-2xl px-4 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
              >
                Skin Care
              </Link>
              <Link
                href="/categories/haircare"
                className="block rounded-2xl px-4 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
              >
                Hair Care
              </Link>
              <Link
                href="/categories/beauty"
                className="block rounded-2xl px-4 py-2 text-sm text-secondary-foreground transition hover:bg-muted hover:text-primary"
              >
                Beauty
              </Link>
            </div>
          </details>

          <Link href="/offers" className="transition hover:text-primary">
            Offers
          </Link>
        </nav>

      </div>
    </header>
  );
}