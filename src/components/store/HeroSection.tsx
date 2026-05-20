"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    id: 1,
    title: "Glow Naturally",
    subtitle: "Premium skincare products for radiant beauty.",
    image: "/slider/1.jpg",
  },

  {
    id: 2,
    title: "Luxury Hair Care",
    subtitle: "Nourish your hair with organic ingredients.",
    image: "/slider/2.jpg",
  },
  {
    id: 3,
    title: "Fragrance Elegance",
    subtitle: "Experience the art of perfumery with our exclusive collection.",
    image: "/slider/3.jpg",
  }
];

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        className="rounded-none"
      >

        {banners.map((banner) => (

          <SwiperSlide key={banner.id}>

            <div className="relative h-65 sm:h-90 md:h-105 lg:h-135 xl:h-150 w-full overflow-hidden">

              {/* IMAGE */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <p className="mb-3 text-xs uppercase tracking-[0.32em] text-pink-200 sm:text-sm">
                      Beauty & Cosmetics
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {banner.title}
                    </h1>
                    <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200 max-w-xl">
                      {banner.subtitle}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link href="/shop" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-auto">
                        Shop Now
                      </Link>
                      <Link href="/about" className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

        ))}

      </Swiper>
    </section>
  );
}