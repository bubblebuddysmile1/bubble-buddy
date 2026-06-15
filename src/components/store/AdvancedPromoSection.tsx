'use client';
import Link from "next/link";

export default function AdvancedPromoSection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(166,124,82,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_bottom,rgba(185,154,107,0.15),transparent_55%)]" />

      <div className="container mx-auto px-4">
        <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary shadow-sm shadow-primary/10">
              Video Showcase
            </span>
            <div className="space-y-5">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Watch our promo video to discover the best of the store.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Enjoy an immersive showcase featuring product highlights, brand storytelling, and exclusive deal previews—all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Watch the video
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                About us
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-border bg-card p-4 text-center shadow-sm shadow-black/5">
                <p className="text-sm font-semibold text-foreground">Instant inspiration</p>
                <p className="mt-2 text-sm text-muted-foreground">See new collections come to life.</p>
              </div>
              <div className="rounded-[1.75rem] border border-border bg-card p-4 text-center shadow-sm shadow-black/5">
                <p className="text-sm font-semibold text-foreground">Engaging stories</p>
                <p className="mt-2 text-sm text-muted-foreground">A visual journey through our bestsellers.</p>
              </div>
              <div className="rounded-[1.75rem] border border-border bg-card p-4 text-center shadow-sm shadow-black/5">
                <p className="text-sm font-semibold text-foreground">Shop with confidence</p>
                <p className="mt-2 text-sm text-muted-foreground">Video-backed product recommendations.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-1 shadow-2xl shadow-black/10">
            <div className="overflow-hidden rounded-[2rem] bg-black">
              <video
                controls
                poster="/category/1.jpg"
                className="h-full w-full min-h-80 object-cover"
              >
                <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="pointer-events-none absolute -right-12 top-12 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-12 h-24 w-24 rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
  