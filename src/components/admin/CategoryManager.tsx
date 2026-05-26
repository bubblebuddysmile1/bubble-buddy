"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  productCount: number;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
};

export default function CategoryManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories?all=1");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setSlugTouched(false);
    setEditingSlug(null);
  };

  const startEdit = (category: Category) => {
    setEditingSlug(category.slug);
    setSlugTouched(true);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
      isActive: category.isActive,
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
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      isActive: form.isActive,
    };

    try {
      const url = editingSlug
        ? `/api/categories/${encodeURIComponent(editingSlug)}`
        : "/api/categories";
      const method = editingSlug ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save category.");
        return;
      }

      setSuccess(editingSlug ? "Category updated." : "Category created.");
      resetForm();
      await loadCategories();
      router.refresh();
    } catch {
      setError("Unable to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(category.slug)}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to delete category.");
        return;
      }

      if (editingSlug === category.slug) {
        resetForm();
      }

      setSuccess("Category deleted.");
      await loadCategories();
      router.refresh();
    } catch {
      setError("Unable to delete category.");
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-lg"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {editingSlug ? "Edit category" : "Add category"}
          </h2>
          {editingSlug && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Name *</span>
          <Input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: slugTouched ? prev.slug : slugify(name),
              }));
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
          <span className="font-medium">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Image URL</span>
          <Input
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            className="size-4 rounded border-border"
          />
          Active category
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}

        <Button type="submit" disabled={isSaving} className="rounded-full">
          {isSaving ? (
            "Saving…"
          ) : (
            <>
              <Plus />
              {editingSlug ? "Update category" : "Add category"}
            </>
          )}
        </Button>
      </form>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">All categories</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-background/80 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.slug} · {category.productCount} product(s)
                    {!category.isActive && " · Inactive"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium transition hover:bg-muted"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-destructive/30 px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
