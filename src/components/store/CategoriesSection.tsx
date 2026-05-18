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
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-background">

      <div className="container mx-auto px-4">

        {/* HEADING */}
        <div className="text-center mb-12">

          <p className="text-primary font-medium uppercase tracking-widest">
            Categories
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-3 text-foreground">
            Shop By Category
          </h2>

          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore premium beauty, skincare, and haircare
            collections crafted for your natural glow.
          </p>

        </div>

        {/* CAROUSEL */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 18 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 2.5, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 26 },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link
                  href={category.link}
                  className="group relative overflow-hidden rounded-3xl block"
                >

                  {/* IMAGE */}
                  <div className="relative h-87.5 w-full overflow-hidden rounded-3xl">

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

                    <h3 className="text-2xl font-bold">
                      {category.title}
                    </h3>

                    <span className="mt-3 text-sm uppercase tracking-widest border-b border-white pb-1">
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