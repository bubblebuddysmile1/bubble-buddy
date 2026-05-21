"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ChevronDown, Heart, Menu, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartNavButton from "@/components/cart/CartNavButton";
import { Button } from "../ui/button";

// ============================================================
// ✅ SIRF YEH ARRAY EDIT KARO — baaki sab automatically update ho jayega
// ============================================================
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  {
    label: "Categories",
    dropdown: [
      { label: "Skin Care", href: "/categories/skincare" },
      { label: "Hair Care", href: "/categories/haircare" },
      { label: "Beauty", href: "/categories/beauty" },
    ],
  },
  { label: "Offers", href: "/offers" },
];
// ============================================================

function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; email: string } | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!active) return;
        if (!response.ok) {
          setUser(null);
          return;
        }

        const json = await response.json();
        setUser(json.user ?? null);
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [pathname]);

  const returnTo = pathname || "/";

  const onProtectedNavigate = (path: string) => {
    if (!user) {
      router.push(`/auth?returnTo=${encodeURIComponent(path)}`);
      return;
    }

    router.push(path);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/auth");
  };

  return (
    <details
      className="group relative"
      open={menuOpen}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <summary className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary [&::-webkit-details-marker]:hidden">
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">{user ? user.name ?? "My Account" : "Account"}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </summary>

      <div className="absolute right-0 z-30 mt-3 min-w-55 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-xl">
        {user ? (
          <div className="space-y-2">
            <div className="rounded-3xl bg-muted p-3 text-sm">
              <div className="font-semibold text-foreground">{user.name ?? "Your account"}</div>
              <div className="text-xs text-muted-foreground wrap-break-word">{user.email}</div>
            </div>
            <button
              type="button"
              onClick={() => onProtectedNavigate("/profile")}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-foreground transition hover:bg-muted hover:text-primary"
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={() => onProtectedNavigate("/orders")}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-foreground transition hover:bg-muted hover:text-primary"
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => onProtectedNavigate("/wishlist")}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-foreground transition hover:bg-muted hover:text-primary"
            >
              Wishlist
            </button>
            <div className="border-t border-border pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm text-destructive transition hover:bg-destructive/10"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => router.push(`/auth?returnTo=${encodeURIComponent(returnTo)}`)}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => router.push(`/auth?returnTo=${encodeURIComponent(returnTo)}&mode=signup`)}
              className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground transition hover:bg-muted"
            >
              Create account
            </button>
          </div>
        )}
      </div>
    </details>
  );
}

export default function Navbar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

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
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-md font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </SheetTrigger>

              <SheetContent side="left" className="w-72 px-4 py-6 bg-card shadow-md">
                <div className="mt-6 flex flex-col items-start gap-3 text-left">

                  {NAV_LINKS.map((item) =>
                    item.dropdown ? (
                      // Dropdown item — mobile (simplified)
                      <div key={item.label} className="w-full p-0">
                        <details className="group overflow-hidden">
                          <summary className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-md font-semibold text-foreground transition hover:bg-muted">
                            {item.label}
                            <ChevronDown className="h-4 w-4 transition-transform duration-150 group-open:-rotate-180" />
                          </summary>
                          <div className="mt-2 flex flex-col gap-2 px-3 pb-3">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block rounded-2xl px-3 py-2 text-md text-muted-foreground transition hover:bg-muted hover:text-primary"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </details>
                      </div>
                    ) : (
                      // Normal link — mobile (simplified)
                      <Link
                        key={item.href}
                        href={item.href}
                        className="w-full px-4 py-3 text-md font-medium text-foreground transition hover:text-primary hover:bg-muted rounded-md"
                      >
                        {item.label}
                      </Link>
                    )
                  )}

                </div>
              </SheetContent>
            </Sheet>

            {/* LOGO */}
            <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
              Bubble Buddy
            </Link>
          </div>

          {/* SEARCH BAR — Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search beauty products..."
              className="pl-10 rounded-full bg-input text-foreground border-border focus-visible:border-ring focus-visible:ring-ring/50"
            />
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button variant="ghost" size="icon" aria-label="Wishlist"><Heart className="h-5 w-5" /></Button>
            <CartNavButton />

            <UserMenu />
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products..."
              className="pl-10 rounded-full bg-input text-foreground border-border focus-visible:border-ring focus-visible:ring-ring/50"
            />
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex w-full items-center justify-center gap-6 h-12 text-md font-medium">
          {NAV_LINKS.map((item) =>
            item.dropdown ? (
              // Dropdown — desktop
              <details
                key={item.label}
                className="relative group"
                open={hoveredDropdown === item.label}
                onMouseEnter={() => setHoveredDropdown(item.label)}
                onMouseLeave={() => setHoveredDropdown(null)}
              >
                <summary className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-md font-semibold text-foreground transition hover:bg-muted hover:text-primary [&::-webkit-details-marker]:hidden">
                  {item.label}
                  <ChevronDown className="h-4 w-4 transition-transform duration-150" />
                </summary>
                <div className="absolute left-1/2 top-full z-20 mt-2 min-w-48 -translate-x-1/2 rounded-3xl border border-border bg-card p-2 shadow-xl">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block rounded-2xl px-4 py-2 text-md text-secondary-foreground transition hover:bg-muted hover:text-primary"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              // Normal link — desktop
              <Link key={item.href} href={item.href} className="transition hover:text-primary">
                {item.label}
              </Link>
            )
          )}
        </nav>

      </div>
    </header>
  );
}