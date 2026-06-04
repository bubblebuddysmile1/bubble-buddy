"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCartMoney } from "@/lib/cart";
import { useCompareStore } from "@/store/compare-store";

export default function ComparePageClient() {
  const compareItems = useCompareStore((s) => s.items);
  const removeItem = useCompareStore((s) => s.removeItem);
  const clearCompare = useCompareStore((s) => s.clearCompare);

  if (compareItems.length === 0) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowUpRight className="size-6" />
        </div>
        <h2 className="text-3xl font-semibold text-foreground">No products to compare yet</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Add products from the shop to compare key features and pricing side by side.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Product comparison</p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">Compare {compareItems.length} product{compareItems.length > 1 ? "s" : ""}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review pricing, availability, and product details side by side, then choose the best match for your routine.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => clearCompare()}>
              Clear comparison
            </Button>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-sm">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="border-b border-border bg-background/60 px-4 py-4 text-sm font-semibold text-muted-foreground"></th>
              {compareItems.map((product) => (
                <th key={product.id} className="border-b border-border bg-background/60 px-4 py-4 text-left text-sm font-semibold text-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{product.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{product.category ?? "Uncategorized"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="rounded-full border border-border bg-background p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[
              {
                label: "Price",
                render: (product: typeof compareItems[number]) => formatCartMoney(product.price, product.currency),
              },
              {
                label: "Stock",
                render: (product: typeof compareItems[number]) =>
                  product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock",
              },
              {
                label: "Category",
                render: (product: typeof compareItems[number]) => product.category ?? "—",
              },
              {
                label: "Product page",
                render: (product: typeof compareItems[number]) => (
                  <Link
                    href={`/shop/${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    View details
                  </Link>
                ),
              },
            ].map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th className="px-4 py-4 text-sm font-semibold text-muted-foreground align-top">{row.label}</th>
                {compareItems.map((product) => (
                  <td key={`${row.label}-${product.id}`} className="px-4 py-4 align-top text-sm text-foreground">
                    {row.render(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
