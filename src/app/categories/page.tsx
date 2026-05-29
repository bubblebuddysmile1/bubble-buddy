import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Categories - Bubble Buddy",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, description: true, image: true },
  });

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Product categories</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Browse categories</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore Bubble Buddy categories and open any category page to view products for that collection.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              {category.image ? (
                <div className="relative mb-5 h-44 w-full overflow-hidden rounded-3xl bg-muted">
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="mb-5 h-44 rounded-3xl bg-primary/10" />
              )}

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">{category.name}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {category.description ?? "Explore curated products for this category."}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  View products
                </span>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No active categories found.
          </div>
        ) : null}
      </div>
    </main>
  );
}
