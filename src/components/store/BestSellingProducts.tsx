'use client';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    name: "Radiant Glow Serum",
    category: "Skin Care",
    price: "₹1,299",
    rating: 4.9,
    tag: "Best Seller",
    image: "/category/1.jpg",
    link: "/shop",
  },
  {
    id: 2,
    name: "Silk Repair Shampoo",
    category: "Hair Care",
    price: "₹899",
    rating: 4.8,
    tag: "Trending",
    image: "/category/2.jpg",
    link: "/shop",
  },
  {
    id: 3,
    name: "Glow Matte Foundation",
    category: "Face Care",
    price: "₹1,499",
    rating: 4.7,
    tag: "Popular",
    image: "/category/3.jpg",
    link: "/shop",
  },
  {
    id: 4,
    name: "Velvet Parfum Mist",
    category: "Fragrance",
    price: "₹1,999",
    rating: 4.9,
    tag: "Premium",
    image: "/category/4.jpg",
    link: "/shop",
  },
  {
    id: 5,
    name: "Nourishing Body Butter",
    category: "Body Care",
    price: "₹890",
    rating: 4.8,
    tag: "Trending",
    image: "/category/2.jpg",
    link: "/shop",
  },
];

export default function BestSellingProducts() {
  return (
    <section className="relative overflow-hidden py-4 bg-background">
      <div className="w-full mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-8 shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-primary">
            <span className="inline-flex rounded-full bg-primary/80 px-3 py-1 text-white">Best Sellers</span>
            <span className="text-muted-foreground">Curated collection for your daily beauty ritual.</span>
          </div>
          <div className="w-full space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-center sm:text-4xl">
              Discover our most-loved products with a premium animated design.
            </h2>
            <p className=" text-sm text-muted-foreground text-center sm:text-base">
              Each product card glows with subtle motion, gradient accents, and a polished layout built to make your best sellers feel irresistible.
            </p>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          loop
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2.8, spaceBetween: 18 },
            1280: { slidesPerView: 3.5, spaceBetween: 20 },
          }}
          className="pb-8"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <article
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-lg shadow-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
              >
              <div className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute -left-12 bottom-6 h-28 w-28 rounded-full bg-accent/10 blur-3xl animate-pulse" />
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent to-secondary" />

              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-secondary-foreground">
                  {product.tag}
                </span>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {product.rating} ★
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-muted p-4 transition duration-500 group-hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/10 to-card/20" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{product.category}</p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xl font-semibold text-foreground">{product.price}</p>
                  <Link
                    href={product.link}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </article>
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
