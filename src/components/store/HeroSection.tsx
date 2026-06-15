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
    image: "/slider/slider1.png",
  },

  {
    id: 2,
    title: "Luxury Hair Care",
    subtitle: "Nourish your hair with organic ingredients.",
    image: "/slider/slider12.png",
  },
  {
    id: 3,
    title: "Fragrance Elegance",
    subtitle: "Experience the art of perfumery with our exclusive collection.",
    image: "/slider/slider13.png",
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

            <div className="relative w-full overflow-hidden">

              {/* IMAGE */}
              <Image
                src={banner.image}
                alt={banner.title}
                width={1800}
                height={600}
                className="w-full h-auto object-cover"
              />

              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">  
                    <div className="mt-80 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link href="/shop" className=" w-full items-center justify-center rounded-full bg-pink-400 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-pink-500 sm:w-auto">
                        Shop Now
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
