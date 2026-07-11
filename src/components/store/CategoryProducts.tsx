import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type CategoryProductsProps = {
  categorySlug: string;
};

async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });
}

async function getCategoryProducts(categoryId: number) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId },
    take: 24,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true, slug: true } },
    },
  });
}

export default async function CategoryProducts({ categorySlug }: CategoryProductsProps) {
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No products were found in this category.
      </div>
    );
  }

  const products = await getCategoryProducts(category.id);

  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No products were found in this category.
      </div>
    );
  }

  return (
    <section className="space-y-6">
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
    </section>
  );
}
