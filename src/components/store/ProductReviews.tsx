"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import StarRating from "@/components/ui/StarRating";

type Review = {
  id: number;
  rating: number;
  title?: string | null;
  body?: string | null;
  user?: { id: number; name?: string | null } | null;
  createdAt: string;
};

export default function ProductReviews({ productId, productSlug, averageRating, reviewCount }:
  { productId: number; productSlug: string; averageRating?: number | null; reviewCount?: number | null }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [displayReviewCount, setDisplayReviewCount] = useState(reviewCount ?? 0);
  const [displayAverageRating, setDisplayAverageRating] = useState(averageRating ?? 0);
  const perPage = 4;
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function load(currentPage = page) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&page=${currentPage}&limit=${perPage}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews ?? []);
        setTotal(data.total ?? 0);
        setDisplayReviewCount(data.total ?? 0);
        setDisplayAverageRating(data.averageRating ?? displayAverageRating);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    setDisplayReviewCount(reviewCount ?? 0);
    setDisplayAverageRating(averageRating ?? 0);
  }, [productId, reviewCount, averageRating]);

  useEffect(() => { load(page); }, [productId, page]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    if (res.ok) {
      setTitle("");
      setBody("");
      setRating(5);
      setPage(1);
      load(1);
    } else {
      const err = await res.json();
      alert(err?.error ?? "Failed to submit review");
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">Reviews</h2>
      <div className="mt-2 flex items-center gap-4">
        <div className="text-2xl font-bold">{Number(displayAverageRating ?? 0).toFixed(1)}</div>
        <div>
          <StarRating value={Math.round(displayAverageRating ?? 0)} readOnly size={18} />
          <div className="text-sm text-muted-foreground">{displayReviewCount ?? 0} reviews</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Write a review</h3>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block text-sm">Your rating</label>
            <StarRating value={rating} onChange={setRating} />

            <label className="block text-sm">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2" />

            <label className="block text-sm">Review</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded border px-3 py-2" rows={5} />

            <div>
              <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Submit review</button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="font-semibold">Customer reviews</h3>
          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                    <Skeleton className="mt-3 h-4 w-3/4 rounded-md" />
                    <Skeleton className="mt-2 h-3 w-full rounded-md" />
                    <Skeleton className="mt-2 h-3 w-5/6 rounded-md" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">              </div>
            ) : null}
            {reviews.map((r) => (
              <div key={r.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.user?.name ?? "Anonymous"}</div>
                  <StarRating value={r.rating} readOnly size={14} />
                </div>
                {r.title && <div className="mt-2 font-medium">{r.title}</div>}
                {r.body && <div className="mt-1 text-sm text-muted-foreground">{r.body}</div>}
                <div className="mt-2 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          {total > perPage && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="rounded border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.max(1, Math.ceil(total / perPage))}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(Math.max(1, Math.ceil(total / perPage)), prev + 1))}
                disabled={page >= Math.ceil(total / perPage)}
                className="rounded border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
