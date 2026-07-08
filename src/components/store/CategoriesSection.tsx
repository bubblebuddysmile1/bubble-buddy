import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type CategoryCard = {
  id: number;
  title: string;
  image: string;
  slug: string;
  link: string;
};

export default async function CategoriesSection() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, image: true },
  });

  const items: CategoryCard[] = categories.map((category) => ({
    id: category.id,
    title: category.name,
    image: category.image ?? "/images/default-category.jpg",
    slug: category.slug,
    link: `/categories/${encodeURIComponent(category.slug)}`,
  }));

  return (
    <section className="bg-background py-4">
      <div className="mx-auto w-full px-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <span className="mt-2 border-b border-white pb-0.5 text-xs uppercase tracking-wider">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
