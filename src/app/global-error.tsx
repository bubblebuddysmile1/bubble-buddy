"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global-error] Unexpected application error");
  }, []);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-destructive">Something went wrong</p>
            <h1 className="mt-4 text-3xl font-semibold">We could not load this page</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Please try again. Your cart and account data are kept safe while we recover.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="mt-8 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}