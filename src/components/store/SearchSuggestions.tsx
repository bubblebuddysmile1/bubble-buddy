import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";

type SuggestedProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: { toString(): string };
  currency: string;
  thumbnail: string | null;
  stockQuantity: number;
  featured: boolean;
  category: { name: string; slug: string } | null;
};

type SearchSuggestionsProps = {
  query: string;
  products: SuggestedProduct[];
};

export default function SearchSuggestions({ query, products }: SearchSuggestionsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="search-suggestions-title" className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Recommended for you</p>
          <h2 id="search-suggestions-title" className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            You may also like
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            We found a few beauty picks related to your search for &quot;{query}&quot;.
          </p>
        </div>
        <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {products.length} picks
        </span>
      </div>

      <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
