'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { CartProduct } from "@/types/cart";

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: string | null;
  currency: string;
  thumbnail: string | null;
  category: { id: number; name: string; slug: string } | null;
  stockQuantity: number;
};

const STORAGE_KEY = "welcomePopupShown";
const SHOW_DELAY_MS = 2500;
const REOPEN_AFTER_MS = 24 * 60 * 60 * 1000;

function canShowPopup() {
  if (typeof window === "undefined") return false;

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return true;

    const timestamp = Number.parseInt(storedValue, 10);
    if (Number.isNaN(timestamp)) return true;

    return Date.now() - timestamp > REOPEN_AFTER_MS;
  } catch {
    return true;
  }
}

function markPopupSeen() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

function mapApiProduct(product: ApiProduct): CartProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price ?? 0),
    currency: product.currency ?? "USD",
    image: product.thumbnail ?? "/category/1.jpg",
    category: product.category?.name ?? "Uncategorized",
    stockQuantity: product.stockQuantity,
  };
}

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const closePopup = () => {
    markPopupSeen();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!canShowPopup()) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/products?featured=1&limit=4", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to load featured products");

        const data = (await response.json()) as { products?: ApiProduct[] };

        if (!isCancelled) {
          setProducts((data.products ?? []).slice(0, 4).map(mapApiProduct));
        }
      } catch {
        if (!isCancelled) {
          setProducts([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || products.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isOpen, products.length]);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    previousActiveElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    const firstFocusable = focusableElements[0];
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePopup();
        return;
      }

      if (event.key !== "Tab") return;

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4"
      onClick={closePopup}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-popup-title"
        aria-label="Welcome popup"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-155 flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
      >
        <div className="relative overflow-hidden border-b border-border/70 bg-linear-to-r from-primary/10 via-background to-accent/10 px-5 py-5 sm:px-7">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle,rgba(192,132,87,0.2),transparent_70%)]" />
          <button
            type="button"
            aria-label="Close welcome popup"
            onClick={closePopup}
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-3 pr-12 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Trending right now
            </div>
            <h2 id="welcome-popup-title" className="text-2xl font-semibold text-foreground sm:text-3xl">
              Our Best Sellers
            </h2>

          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-56 animate-pulse rounded-[1.5rem] border border-border/60 bg-muted/70" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-card/80 p-6 text-center text-sm text-muted-foreground">
              No featured products are available right now. Please check back soon.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/90 px-2 py-1 shadow-sm shadow-black/5">
                <div className="relative overflow-hidden rounded-[1.25rem] bg-muted/60">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background/40" />
                  <Image
                    src={products[activeIndex]?.image ?? "/category/1.jpg"}
                    alt={products[activeIndex]?.name ?? "Featured product"}
                    width={700}
                    height={480}
                    className="h-56 w-full object-cover sm:h-64"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                        {products[activeIndex]?.category ?? "Featured"}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">
                        {products[activeIndex]?.name}
                      </h3>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {products[activeIndex] ? `${products[activeIndex].currency} ${products[activeIndex].price.toFixed(2)}` : ""}
                    </div>
                    {products[activeIndex] && (
                      <AddToCartButton product={products[activeIndex]} size="sm" label="Add to cart" className="rounded-full" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      {products.map((product, index) => (
                        <button
                          key={product.id}
                          type="button"
                          aria-label={`Show ${product.name}`}
                          onClick={() => setActiveIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-border"}`}
                        />
                      ))}
                    </div>
                    <Link
                      href={`/shop/${products[activeIndex]?.slug ?? ""}`}
                      className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
