"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title:
      "Discover premium skincare essentials crafted to nourish, hydrate, and enhance your natural glow every day.",
    subtitle: "Luxury Skin Care",
    button: "Shop Skin Care",
    image: "/category/1.jpg",
  },

  {
    id: 2,
    title:
      "Explore high-quality makeup collections designed to give you a flawless and confident beauty look.",
    subtitle: "Beauty & Makeup",
    button: "Explore Makeup",
    image: "/category/2.jpg",
  },

  {
    id: 3,
    title:
      "Transform your hair care routine with organic beauty products made for healthy, shiny, and silky hair.",
    subtitle: "Premium Hair Care",
    button: "Shop Hair Care",
    image: "/category/3.jpg",
  },
];

export default function PromoBannerSection() {
  return (
    <section className="py-14 bg-pink-50">

      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {banners.map((banner) => (

            <div
              key={banner.id}
              className="relative overflow-hidden rounded-3xl group min-h-[620px]"
            >

              {/* IMAGE */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-start p-8 text-white">

                {/* SUBTITLE */}
                <p className="uppercase tracking-[4px] text-sm font-medium text-pink-200">
                  {banner.subtitle}
                </p>

                {/* TITLE */}
                <h2 className="mt-5 text-3xl md:text-4xl font-bold leading-tight max-w-md">
                  {banner.title}
                </h2>

                {/* BUTTON */}
                <div className="mt-8">

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 bg-pink-100 text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white transition"
                  >

                    {banner.button}

                    <ArrowRight className="h-5 w-5" />

                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}