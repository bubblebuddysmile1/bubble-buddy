"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  heading: string | null;
  content: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  faq: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  relatedSlugs: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  heading: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  faq: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  relatedSlugs: string;
  isPublished: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  heading: "",
  content: "",
  featuredImage: "",
  featuredImageAlt: "",
  faq: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  relatedSlugs: "",
  isPublished: false,
};

export default function BlogManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs?admin=1");
      const data = await response.json();
      if (response.ok) setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setSlugTouched(false);
    setEditingSlug(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
    setSlugTouched(true);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      heading: post.heading ?? "",
      content: post.content,
      featuredImage: post.featuredImage ?? "",
      featuredImageAlt: post.featuredImageAlt ?? "",
      faq: post.faq ?? "",
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      metaKeywords: post.metaKeywords ?? "",
      relatedSlugs: post.relatedSlugs ?? "",
      isPublished: post.isPublished,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      heading: form.heading.trim() || null,
      content: form.content.trim(),
      featuredImage: form.featuredImage.trim() || null,
      featuredImageAlt: form.featuredImageAlt.trim() || null,
      faq: form.faq.trim() || null,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
      metaKeywords: form.metaKeywords.trim() || null,
      relatedSlugs: form.relatedSlugs.trim() || null,
      isPublished: form.isPublished,
    };

    try {
      const url = editingSlug ? `/api/blogs/${encodeURIComponent(editingSlug)}` : "/api/blogs";
      const method = editingSlug ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save blog post.");
        return;
      }

      setSuccess(editingSlug ? "Blog post updated." : "Blog post created.");
      resetForm();
      await loadPosts();
      router.refresh();
    } catch {
      setError("Unable to save blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete blog post "${post.title}"?`)) return;
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(post.slug)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to delete blog post.");
        return;
      }
      setSuccess("Blog post deleted.");
      await loadPosts();
      router.refresh();
    } catch {
      setError("Unable to delete blog post.");
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">{editingSlug ? "Edit blog post" : "Add blog post"}</h2>
          {editingSlug && (
            <button type="button" onClick={resetForm} className="text-sm font-semibold text-primary hover:underline">
              Cancel edit
            </button>
          )}
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Title *</span>
          <Input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
            }}
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Slug *</span>
          <Input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
            }}
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Excerpt</span>
          <textarea value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} rows={2} className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Hero heading</span>
          <Input value={form.heading} onChange={(e) => setForm((prev) => ({ ...prev, heading: e.target.value }))} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Main content *</span>
          <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={10} className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" required />
          <p className="text-xs text-muted-foreground">Tip: internal links add karne ke liye [text](/shop) ya [text](/blogs/slug) use karein.</p>
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Featured image URL</span>
          <Input value={form.featuredImage} onChange={(e) => setForm((prev) => ({ ...prev, featuredImage: e.target.value }))} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Featured image alt text</span>
          <Input value={form.featuredImageAlt} onChange={(e) => setForm((prev) => ({ ...prev, featuredImageAlt: e.target.value }))} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">FAQ / structured content</span>
          <textarea value={form.faq} onChange={(e) => setForm((prev) => ({ ...prev, faq: e.target.value }))} rows={4} className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Meta title</span>
          <Input value={form.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Meta description</span>
          <textarea value={form.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))} rows={3} className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Meta keywords</span>
          <Input value={form.metaKeywords} onChange={(e) => setForm((prev) => ({ ...prev, metaKeywords: e.target.value }))} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Related blog slugs</span>
          <Input value={form.relatedSlugs} onChange={(e) => setForm((prev) => ({ ...prev, relatedSlugs: e.target.value }))} />
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))} className="size-4 rounded border-border" />
          Publish immediately
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}

        <Button type="submit" disabled={isSaving} className="rounded-full">
          {isSaving ? "Saving…" : <><Plus /> {editingSlug ? "Update blog" : "Add blog"}</>}
        </Button>
      </form>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">All blog posts</h2>
        {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading…</p> : posts.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No blogs yet.</p> : <div className="mt-4 space-y-3">{posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-background/80 px-4 py-3">
            <div>
              <p className="font-semibold text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground">{post.slug} · {post.isPublished ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(post)} className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium transition hover:bg-muted">
                <Pencil className="size-3.5" /> Edit
              </button>
              <button type="button" onClick={() => handleDelete(post)} className="inline-flex h-8 items-center gap-1 rounded-full border border-destructive/30 px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10">
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}</div>}
      </div>
    </div>
  );
}
