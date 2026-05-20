import Image from "next/image";
import Link from "next/link";

const productList = [
  {
    id: 1,
    name: "Radiant Glow Serum",
    price: "₹1,299",
    tagline: "Brightening formula with vitamin C.",
    image: "/category/1.jpg",
    link: "/shop",
  },
  {
    id: 2,
    name: "Silk Repair Shampoo",
    price: "₹899",
    tagline: "Nourishing shampoo for soft, shiny hair.",
    image: "/category/2.jpg",
    link: "/shop",
  },
  {
    id: 3,
    name: "Glow Matte Foundation",
    price: "₹1,499",
    tagline: "Buildable coverage with natural finish.",
    image: "/category/3.jpg",
    link: "/shop",
  },
  {
    id: 4,
    name: "Velvet Parfum Mist",
    price: "₹1,999",
    tagline: "Warm scent with floral and amber notes.",
    image: "/category/4.jpg",
    link: "/shop",
  },
  {
    id: 5,
    name: "Nourishing Body Butter",
    price: "₹890",
    tagline: "Ultra-hydrating cream for silky skin.",
    image: "/category/2.jpg",
    link: "/shop",
  },
  {
    id: 6,
    name: "Rose Petal Toner",
    price: "₹720",
    tagline: "Refresh and soothe with rose water.",
    image: "/category/1.jpg",
    link: "/shop",
  },
  {
    id: 7,
    name: "Herbal Lip Balm",
    price: "₹399",
    tagline: "Soft, protected lips with natural oils.",
    image: "/category/3.jpg",
    link: "/shop",
  },
  {
    id: 8,
    name: "Coconut Glow Mask",
    price: "₹1,150",
    tagline: "Deep hydration and instant radiance.",
    image: "/category/4.jpg",
    link: "/shop",
  },
];

export default function ProductList() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Product List</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Browse our full product catalog
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Find the right beauty essentials with clean descriptions, pricing, and easy buy buttons.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {productList.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={360}
                  height={360}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{product.name}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{product.tagline}</p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-foreground">{product.price}</p>
                <Link
                  href={product.link}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Add
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
