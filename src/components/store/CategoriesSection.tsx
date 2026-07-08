'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type CategoryCard = {
  id: number;
  title: string;
  image: string;
  slug: string;
  link: string;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryCard[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (!Array.isArray(data.categories)) return;

        const categoriesData = data.categories as ApiCategory[];
        const items = categoriesData.map((category) => ({
          id: category.id,
          title: category.name,
          image: category.image ?? "/images/default-category.jpg",
          slug: category.slug,
          link: `/categories/${encodeURIComponent(category.slug)}`,
        }));

        if (items.length > 0) {
          setCategories(items);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }

    loadCategories();
  }, []);

  const slides = categories.length === 0
    ? Array.from({ length: 5 }).map((_, i) => (
        <SwiperSlide key={`skeleton-${i}`}>
          <div className="group relative overflow-hidden rounded-3xl block">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl">
              <div className="h-40 w-full bg-muted" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <div className="h-6 w-32 bg-white/20 rounded-md" />
              <div className="mt-2 h-4 w-20 bg-white/15 rounded-md" />
            </div>
          </div>
        </SwiperSlide>
      ))
    : categories.map((category) => (
        <SwiperSlide key={category.id}>
          <Link
            href={category.link}
            className="group relative overflow-hidden rounded-3xl block"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-2xl">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <span className="mt-2 text-xs uppercase tracking-wider border-b border-white pb-0.5">Shop Now</span>
            </div>
          </Link>
        </SwiperSlide>
      ));

  return (
    <section className="py-4 bg-background">

      <div className="w-full mx-auto px-4">
        {/* CAROUSEL */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={12}
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 8 },
              640: { slidesPerView: 2.5, spaceBetween: 10 },
              768: { slidesPerView: 3.5, spaceBetween: 12 },
              1024: { slidesPerView: 4.5, spaceBetween: 14 },
              1280: { slidesPerView: 5, spaceBetween: 16 },
            }}
          >
            {slides}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
