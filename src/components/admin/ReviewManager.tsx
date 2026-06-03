"use client";
import { useEffect, useState } from "react";

export default function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const perPage = 20;

  async function load(p = page) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews?page=${p}&limit=${perPage}&approved=0`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews ?? []);
        setTotal(data.total ?? 0);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Failed to load reviews (${res.status})`);
        setReviews([]);
      }
    } catch (err) {
      setError("Unable to load reviews. Please refresh the page.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page]);

  async function toggleApprove(id: number, approve: boolean) {
    const res = await fetch(`/api/admin/reviews`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approve }),
    });
    if (res.ok) {
      load(page);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Unable to update review status.");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Review Moderation</h2>
      <div className="mt-4">
        {loading && <div>Loading...</div>}
        {error && <div className="rounded border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        {!loading && !error && reviews.length === 0 && <div>No reviews found.</div>}
        {reviews.map((r) => (
          <div key={r.id} className="mb-3 rounded border p-3">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{r.user?.name ?? r.user?.email ?? 'Anonymous'}</div>
                <div className="text-sm text-muted-foreground">{r.product?.name} · {new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="space-x-2">
                {!r.approved && (
                  <button onClick={() => toggleApprove(r.id, true)} className="rounded bg-primary px-3 py-1 text-white">Approve</button>
                )}
                {r.approved && (
                  <button onClick={() => toggleApprove(r.id, false)} className="rounded border px-3 py-1">Revoke</button>
                )}
              </div>
            </div>
            <div className="mt-2">{r.title && <div className="font-medium">{r.title}</div>}{r.body && <div className="mt-1 text-sm text-muted-foreground">{r.body}</div>}</div>
          </div>
        ))}

        {total > perPage && (
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded border px-3 py-1">Previous</button>
            <div className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / perPage)}</div>
            <button onClick={() => setPage((p) => Math.min(Math.ceil(total / perPage), p + 1))} disabled={page >= Math.ceil(total / perPage)} className="rounded border px-3 py-1">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
