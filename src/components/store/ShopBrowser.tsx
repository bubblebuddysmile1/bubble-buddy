import Link from "next/link";
import type { Prisma } from "@prisma/client";
import ShopProductCard from "@/components/store/ShopProductCard";
import SearchSuggestions from "@/components/store/SearchSuggestions";
import { toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

type ShopBrowserProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const perPage = 12;

function buildShopUrl(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const queryString = searchParams.toString();
  return queryString ? `/shop?${queryString}` : "/shop";
}

export default async function ShopBrowser({ searchParams }: ShopBrowserProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const categorySlug = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "";
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "featured";
  const page = Number.parseInt(typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : "1", 10) || 1;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categorySlug ? { category: { slug: categorySlug, isActive: true } } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : [{ featured: "desc" }, { createdAt: "desc" }];

  const [categories, products, total] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  let suggestedProducts = products;
  if (query && products.length === 0) {
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length > 1)
      .slice(0, 5);

    const suggestionWhere: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug, isActive: true } } : {}),
      ...(searchTerms.length > 0
        ? {
            OR: searchTerms.flatMap((term) => [
              { name: { contains: term, mode: "insensitive" as const } },
              { description: { contains: term, mode: "insensitive" as const } },
              { benefits: { contains: term, mode: "insensitive" as const } },
            ]),
          }
        : {}),
    };

    suggestedProducts = await prisma.product.findMany({
      where: suggestionWhere,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 4,
      include: { category: { select: { name: true, slug: true } } },
    });

    if (suggestedProducts.length === 0) {
      suggestedProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          ...(categorySlug ? { category: { slug: categorySlug, isActive: true } } : {}),
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 4,
        include: { category: { select: { name: true, slug: true } } },
      });
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);

  return (
    <section className="space-y-8">
      <form method="get" action="/shop" className="grid gap-4 rounded-[2rem] border border-border bg-card p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px_minmax(310px,auto)] lg:items-end">
        <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Search products
            </span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by name, description, or SKU"
              className="w-full rounded-3xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Category
          </span>
          <select
            name="category"
            defaultValue={categorySlug}
            className="w-full rounded-3xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Sort by
            </span>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-3xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-3 pb-0.5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
            >
              Apply
            </button>
            <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
              Reset
            </Link>
          </div>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center sm:p-10">
            <p className="text-lg font-semibold text-foreground">
              No products found for &quot;{query}&quot;.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search or explore these products you may like.
            </p>
          </div>
          <SearchSuggestions query={query} products={suggestedProducts} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={toCartProduct({
                ...product,
                price: product.price.toString(),
              })}
              description={product.description}
              featured={product.featured}
            />
          ))}
        </div>
      )}

       <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{products.length}</span> of <span className="font-semibold text-foreground">{total}</span> products
          </p>
          <p className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={buildShopUrl({
              q: query || undefined,
              category: categorySlug || undefined,
              sort: sort === "featured" ? undefined : sort,
              page: String(Math.max(1, safePage - 1)),
            })}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </Link>
          <Link
            href={buildShopUrl({
              q: query || undefined,
              category: categorySlug || undefined,
              sort: sort === "featured" ? undefined : sort,
              page: String(Math.min(totalPages, safePage + 1)),
            })}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </Link>
        </div>
      </div>

    </section>
  );
}
