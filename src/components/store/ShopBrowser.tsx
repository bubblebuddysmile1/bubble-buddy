"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";

type CategoryOption = { id: number; name: string; slug: string };

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  stockQuantity: number;
  thumbnail: string | null;
  category: { name: string; slug: string } | null;
  featured: boolean;
};

type ProductsResponse = {
  products: ApiProduct[];
  total: number;
  page: number;
  perPage: number;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ShopBrowser() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derive effective category from local state or URL query param
  const urlCategory = searchParams?.get("category") ?? "";
  const effectiveCategory = category || urlCategory;

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        const data = await response.json();
        setCategories(data.categories ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (query.trim()) searchParams.set("q", query.trim());
    if (effectiveCategory) searchParams.set("category", effectiveCategory);
    if (sort) searchParams.set("sort", sort);
    searchParams.set("page", String(page));
    searchParams.set("limit", String(perPage));
    return searchParams.toString();
  }, [effectiveCategory, page, perPage, query, sort]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products?${queryString}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data: ProductsResponse = await response.json();
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
      } catch (err) {
        console.error(err);
        setError("Could not fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [queryString]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Search products
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, description, or SKU"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Category
            </span>
            <select
              value={effectiveCategory}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 w-full max-w-xs">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{products.length}</span> of <span className="font-semibold text-foreground">{total}</span> products
          </p>
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No products found for the selected filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={toCartProduct(product)}
              description={product.description}
              featured={product.featured}
            />
          ))}
        </div>
      )}
    </section>
  );
}
