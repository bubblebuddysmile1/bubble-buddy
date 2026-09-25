import Link from "next/link";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">404</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">This page has moved on</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          The link may be outdated or the product is no longer available. Start from a trusted
          page below and keep shopping.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <ShoppingBag className="size-4" />
            Browse shop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Go home
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Search className="size-4" />
            Get help
          </Link>
        </div>
      </div>
    </main>
  );
}