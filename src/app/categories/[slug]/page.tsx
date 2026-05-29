import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryProducts from "@/components/store/CategoryProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: `${category.name} - Bubble Buddy`,
    description: category.description ?? `Shop products in the ${category.name} category.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true, image: true, isActive: true },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_minmax(260px,320px)] items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-primary">Category</p>
            <h1 className="text-4xl font-semibold text-foreground">{category.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {category.description ?? "Explore products selected for this category."}
            </p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Browse filtered products</p>
            <p className="mt-2 text-sm text-muted-foreground">
              All active products in the {category.name} category are shown below.
            </p>
          </div>
        </div>

        <CategoryProducts categorySlug={slug} />
      </div>
    </main>
  );
}
