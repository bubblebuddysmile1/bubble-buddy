"use client";
import Link from "next/link";

export default function AdvancedPromoSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Gradient Backgrounds - Adjusted for mobile */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 sm:h-56 md:h-64 lg:h-72 bg-[radial-gradient(circle_at_top,rgba(166,124,82,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-48 md:h-56 lg:h-64 bg-[radial-gradient(circle_at_bottom,rgba(185,154,107,0.15),transparent_55%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:grid xl:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* LEFT CONTENT - Text Section */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8 order-2 xl:order-1">
            {/* Badge */}
            <span className="inline-flex rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary shadow-sm shadow-primary/10 w-fit mx-auto sm:mx-0">
              Video Showcase
            </span>
            
            {/* Heading */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground px-2 sm:px-0">
                Watch our promo video to discover the best of the store.
              </h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto sm:mx-0 px-4 sm:px-0">
                Enjoy an immersive showcase featuring product highlights, brand
                storytelling, and exclusive deal previews—all in one place.
              </p>
            </div>
            
            {/* Button */}
            <div className="flex justify-center sm:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95"
              >
                About us
              </Link>
            </div>
            
            {/* Feature Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-6">
              {/* Card 1 */}
              <div className="rounded-2xl sm:rounded-[1.5rem] md:rounded-[1.75rem] border border-border bg-card p-3 sm:p-4 text-center shadow-sm shadow-black/5 transition-all duration-200 hover:shadow-md hover:scale-105">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Instant inspiration
                </p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  See new collections come to life.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="rounded-2xl sm:rounded-[1.5rem] md:rounded-[1.75rem] border border-border bg-card p-3 sm:p-4 text-center shadow-sm shadow-black/5 transition-all duration-200 hover:shadow-md hover:scale-105">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Engaging stories
                </p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  A visual journey through our bestsellers.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="rounded-2xl sm:rounded-[1.5rem] md:rounded-[1.75rem] border border-border bg-card p-3 sm:p-4 text-center shadow-sm shadow-black/5 transition-all duration-200 hover:shadow-md hover:scale-105 sm:col-span-2 lg:col-span-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Shop with confidence
                </p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  Video-backed product recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Video Section */}
          <div className="relative w-full order-1 xl:order-2 mb-6 sm:mb-8 md:mb-10 xl:mb-0">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-border bg-card p-1 shadow-2xl shadow-black/10">
              {/* Video Container */}
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] bg-black aspect-video w-full">
                <iframe
                  src="https://player.cloudinary.com/embed/?cloud_name=djb7ybhl4&public_id=download_d0jty8&source_types[0]=mp4"
                  className="h-full w-full object-cover"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="Promo video"
                  loading="lazy"
                />
              </div>
              
              {/* Decorative Blur Elements - Hidden on mobile */}
              <div className="pointer-events-none absolute -right-8 sm:-right-10 md:-right-12 top-8 sm:top-10 md:top-12 h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-full bg-primary/10 blur-2xl sm:blur-3xl" />
              <div className="pointer-events-none absolute -left-8 sm:-left-10 md:-left-12 bottom-8 sm:bottom-10 md:bottom-12 h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-full bg-secondary/10 blur-2xl sm:blur-3xl" />
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
}
