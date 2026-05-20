'use client';
import Image from "next/image";
import Link from "next/link";

const offerCards = [
  {
    id: 1,
    title: "Up to 80% off | Latest collections from Indian designs",
    badge: "Trending",
    images: ["/category/1.jpg", "/category/2.jpg"],
  },
  {
    id: 2,
    title: "Up to 75% off | Curated products for small business",
    badge: "Home Decor",
    images: ["/slider/1.jpg", "/slider/2.jpg"],
  },
  {
    id: 3,
    title: "One stop shop for all your wedding shopping",
    badge: "Wedding Sale",
    actions: [
      { label: "Shop for her", image: "/slider/2.jpg" },
      { label: "Shop for him", image: "/slider/3.jpg" },
    ],
  },
  {
    id: 4,
    title: "Best Sellers in Clothing & Accessories",
    badge: "Best Seller",
    images: ["/category/2.jpg", "/category/4.jpg",],
  },
];

export default function OfferDiscountSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Offers & Discounts</p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Explore limited-time deals across categories
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Find the latest drop, wedding essentials, fashion favorites, and curated home décor offers in one place.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-4">
          {offerCards.map((card) => (
            <article
              key={card.id}
              className="overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="text-sm font-bold leading-tight text-foreground">{card.title}</div>
                <span className="rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                  {card.badge}
                </span>
              </div>

              {card.images ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {card.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-[1.5rem] bg-muted h-32">
                      <Image
                        src={image}
                        alt={`${card.title} image ${index + 1}`}
                        fill
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                      {/* <div className="absolute inset-0 bg-linear-to-b from-transparent to-card/70" /> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {card.actions.map((action) => (
                    <Link
                      key={action.label}
                      href="/shop"
                      className="group overflow-hidden rounded-[1.5rem] border border-border bg-muted p-3 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-primary/5"
                    >
                      <div className="relative mb-3 h-24 overflow-hidden rounded-[1.5rem] bg-muted">
                        <Image
                          src={action.image}
                          alt={action.label}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-card/70" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{action.label}</p>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
