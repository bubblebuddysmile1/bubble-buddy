"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminProductRow = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string | null;
  stockQuantity: number;
  isActive: boolean;
  featured: boolean;
  thumbnail: string | null;
  category: { name: string; slug: string } | null;
};

type ProductManageTableProps = {
  products: AdminProductRow[];
};

export default function ProductManageTable({ products }: ProductManageTableProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the shop.`)) {
      return;
    }

    setDeletingSlug(slug);
    setError(null);

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to delete product.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to delete product.");
    } finally {
      setDeletingSlug(null);
    }
  };

  if (products.length === 0) {
    return (
      <p className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No products found. Create your first product to get started.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-lg">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">SKU</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{product.sku}</td>
                <td className="px-5 py-4 text-muted-foreground">{product.category?.name ?? "—"}</td>
                <td className="px-5 py-4 font-medium text-foreground">${product.price ?? "0"}</td>
                <td className="px-5 py-4 text-muted-foreground">{product.stockQuantity}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      product.isActive
                        ? "bg-emerald-500/15 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                  {product.featured && (
                    <span className="ml-2 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.slug}/edit`}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-input/30 px-3 text-xs font-medium transition hover:bg-input/50"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                    <Link
                      href={`/admin/products/${product.slug}/images`}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-input/30 px-3 text-xs font-medium transition hover:bg-input/50"
                    >
                      <ImageIcon className="size-3.5" />
                      Images
                    </Link>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      disabled={deletingSlug === product.slug}
                      onClick={() => handleDelete(product.slug, product.name)}
                    >
                      <Trash2 />
                      {deletingSlug === product.slug ? "…" : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
