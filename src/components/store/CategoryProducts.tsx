import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type CategoryProductsProps = {
  categorySlug: string;
};

export default async function CategoryProducts({ categorySlug }: CategoryProductsProps) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });

  if (!category) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No products were found in this category.
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId: category.id },
    take: 24,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

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
