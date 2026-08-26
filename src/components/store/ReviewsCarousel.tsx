"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "@/components/ui/StarRating";

import "swiper/css";
import "swiper/css/pagination";

type Review = {
  id: number;
  rating: number;
  title?: string | null;
  body?: string | null;
  verifiedPurchase?: boolean;
  user?: { name?: string | null } | null;
  product?: { name: string; slug: string };
  createdAt: string;
};

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      try {
        const response = await fetch("/api/reviews?all=true", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load reviews");
        const data = await response.json();
        if (!ignore) setReviews(data.reviews ?? []);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadReviews();
    return () => {
      ignore = true;
    };
  }, []);

  if (!loading && (error || reviews.length === 0)) return null;

  return (
    <section aria-labelledby="customer-reviews-heading" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Customer love</p>
          <h2 id="customer-reviews-heading" className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            What our customers say
          </h2>
        </div>

        {loading ? (
          <div className="mx-auto h-48 max-w-2xl animate-pulse rounded-3xl bg-muted" />
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={reviews.length > 1}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
            className="reviews-carousel pb-12!"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto!">
                <article className="flex h-full min-h-52 flex-col rounded-3xl border border-[#f0d9d1] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <StarRating value={review.rating} readOnly size={16} />
                    <time className="text-xs text-muted-foreground" dateTime={review.createdAt}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  {review.title && <h3 className="mt-4 font-semibold text-foreground">{review.title}</h3>}
                  {review.body && <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{review.body}</p>}
                  <div className="mt-auto pt-5">
                    <p className="text-sm font-medium text-foreground">{review.user?.name ?? "Anonymous"}</p>
                    {review.verifiedPurchase && <p className="mt-1 text-xs text-green-600">Verified purchase</p>}
                    {review.product && (
                      <Link href={`/shop/${review.product.slug}`} className="mt-2 block truncate text-xs text-primary hover:underline">
                        {review.product.name}
                      </Link>
                    )}
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style jsx global>{`
        .reviews-carousel .swiper-pagination-bullet {
          background: #b94d6b;
          opacity: 0.3;
        }
        .reviews-carousel .swiper-pagination-bullet-active {
          background: #b94d6b;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
