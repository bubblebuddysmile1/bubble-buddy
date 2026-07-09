"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type Product = {
  id: number;
  name: string;
  slug: string;
  thumbnail?: string | null;
  price?: number | null;
  currency?: string | null;
};

export default function HeroSection({ products = [] }: { products?: Product[] }) {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const hasEnoughForLoop = products.length > 2;

  return (
    <section
      role="region"
      aria-label="Featured collection"
      className="relative w-full overflow-hidden h-[450px] md:h-[550px] bg-[#2B1B24]"
    >
      {/* Background video */}
      {!reducedMotion && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/slider/slider12.png"
        >
          <source
            src="https://res.cloudinary.com/djb7ybhl4/video/upload/v1781523967/download_d0jty8.mp4"
            type="video/mp4"
          />
        </video>
      )}
      {reducedMotion && (
        <Image
          src="/slider/slider12.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      )}

      {/* Overlay: deep plum wash, stronger on the left where text sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2B1B24]/85 via-[#2B1B24]/45 to-[#2B1B24]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B24]/60 via-transparent to-transparent" />

      {/* Main content */}
      <div className="container mx-auto relative z-20 px-6 md:px-10 flex items-center h-full">
        <div className="w-full md:w-[55%]">
          {/* Eyebrow, flanked by hairlines instead of a frosted pill */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#D9B98C]/70" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#F3DDD2]/90">
              Limited-time offers
            </span>
          </div>

          <h1
            className="mt-5 text-4xl md:text-6xl text-[#FBF4ED] max-w-xl leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-hero-display, Georgia, 'Times New Roman', serif)" }}
          >
            The ritual of radiant skin
          </h1>

          <p className="mt-5 text-base md:text-lg text-[#F3DDD2]/85 max-w-md leading-relaxed">
            Clean, effective, quietly indulgent — the edit for your everyday
            routine, made from ingredients you can actually pronounce.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/shop"
              className="rounded-full bg-[#C08457] px-7 py-3.5 text-sm font-semibold text-[#2B1B24] transition-colors hover:bg-[#D9B98C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3DDD2]"
            >
              SHOP NOW
            </Link>
            <Link
              href="/about"
              className="group relative text-sm font-medium text-[#FBF4ED]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3DDD2] pb-1"
            >
              LEARN MORE
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#D9B98C]/50 transition-transform duration-300 origin-left group-hover:scale-x-0" />
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#D9B98C] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </div>
        </div>

        {/* Right-side product card */}
        {products.length > 0 && (
          <div className="hidden md:block md:w-[45%]">
            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-72 md:w-[19rem] z-30">
              {/* Rotated placard tab, the one signature flourish */}
              <div
                className="absolute -left-7 top-10 origin-left -rotate-90 text-[10px] uppercase tracking-[0.35em] text-[#F3DDD2]/70 whitespace-nowrap"
                aria-hidden="true"
              >
                Today&rsquo;s edit
              </div>

              <div className="rounded-[1.5rem] overflow-hidden border border-[#D9B98C]/40 bg-[#FBF4ED] p-5 shadow-2xl shadow-black/40">
                <div className="mb-4 flex items-center justify-between gap-2 border-b border-[#2B1B24]/10 pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C08457]">
                      New arrivals
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#2B1B24]">
                      Top picks for today
                    </p>
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#2B1B24]/20 text-[11px] text-[#2B1B24]/70">
                    {products.length}
                  </span>
                </div>

                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={reducedMotion ? false : { delay: 3200, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  loop={hasEnoughForLoop}
                  slidesPerView={1}
                  spaceBetween={12}
                  className="hero-swiper"
                >
                  {products.map((p) => (
                    <SwiperSlide key={p.id}>
                      <Link
                        href={`/shop/${p.slug}`}
                        className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C08457]"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-[#2B1B24]/5">
                          <Image
                            src={p.thumbnail || "/slider/slider12.png"}
                            alt={p.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2B1B24] line-clamp-2">
                            {p.name}
                          </p>
                          {p.price != null && (
                            <p className="mt-1 text-sm text-[#C08457] tabular-nums">
                              {p.currency ?? "₹"}
                              {p.price}
                            </p>
                          )}
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: #614a57;
          opacity: 0.25;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #c08457;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
