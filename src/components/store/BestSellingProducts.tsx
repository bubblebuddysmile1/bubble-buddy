import BestSellingProductsClient from "./BestSellingProductsClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type BestSellingProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  currency: string;
  category: { name: string; slug: string } | null;
  stockQuantity: number;
};

export default async function BestSellingProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    take: 8,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  const serializedProducts: BestSellingProduct[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumbnail: product.thumbnail,
    price: Number(product.price.toString()),
    currency: "₹",
    category: product.category,
    stockQuantity: product.stockQuantity,
  }));

  return <BestSellingProductsClient products={serializedProducts} />;
}
