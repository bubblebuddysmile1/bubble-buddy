'use client';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const categories = [
  {
    id: 1,
    title: "Skin Care",
    image: "/category/1.jpg",
    link: "#",
  },

  {
    id: 2,
    title: "Hair Care",
    image: "/category/2.jpg",
    link: "#",
  },

  {
    id: 3,
    title: "Face Care",
    image: "/category/3.jpg",
    link: "#",
  },

  {
    id: 4,
    title: "Beauty Products",
    image: "/category/4.jpg",
    link: "#",
  },
   {
    id: 5,
    title: "Parfum",
    image: "/category/2.jpg",
    link: "#",
  },
  {
    id: 6,
    title: "Skin Care",
    image: "/category/1.jpg",
    link: "#",
  },
];

export default function CategoriesSection() {
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
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link
                  href={category.link}
                  className="group relative overflow-hidden rounded-3xl block"
                >

                  {/* IMAGE */}
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl">

                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                  </div>

                  {/* CONTENT */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">

                    <h3 className="text-lg font-semibold">
                      {category.title}
                    </h3>

                    <span className="mt-2 text-xs uppercase tracking-wider border-b border-white pb-0.5">
                      Shop Now
                    </span>

                  </div>

                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}