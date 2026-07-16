"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

export type CategoryOption = {
  slug: string;
  name: string;
};

export type ProductFormValues = {
  name: string;
  sku: string;
  slug: string;
  description: string;
  benefits: string;
  howToApply: string;
  faq: string;
  details: string;
  price: string;
  compareAtPrice: string;
  currency: string;
  stockQuantity: number;
  categorySlug: string;
  thumbnail: string;
  featured: boolean;
  isActive: boolean;
};

type ProductFormProps = {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  categories: CategoryOption[];
  currentSlug?: string;
};

const defaultValues: ProductFormValues = {
  name: "",
  sku: "",
  slug: "",
  description: "",
  benefits: "",
  howToApply: "",
  faq: "",
  details: "",
  price: "",
  compareAtPrice: "",
  currency: "USD",
  stockQuantity: 0,
  categorySlug: "",
  thumbnail: "",
  featured: false,
  isActive: true,
};

export default function ProductForm({
  mode,
  initialValues,
  categories,
  currentSlug,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...defaultValues, ...initialValues });
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categoryOptions = useMemo(() => categories, [categories]);

  const updateField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload = {
      ...values,
      price: values.price,
      compareAtPrice: values.compareAtPrice || null,
      thumbnail: values.thumbnail || null,
      benefits: values.benefits || null,
      howToApply: values.howToApply || null,
      faq: values.faq || null,
      details: values.details || null,
    };

    try {
      const url =
        mode === "create" ? "/api/products" : `/api/products/${encodeURIComponent(currentSlug ?? "")}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Unable to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Product name *</span>
          <Input value={values.name} onChange={(e) => updateField("name", e.target.value)} required />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">SKU *</span>
          <Input value={values.sku} onChange={(e) => updateField("sku", e.target.value)} required />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Slug *</span>
          <Input
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              updateField("slug", slugify(e.target.value));
            }}
            required
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Description *</span>
          <textarea
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            rows={4}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Benefits</span>
          <textarea
            value={values.benefits}
            onChange={(e) => updateField("benefits", e.target.value)}
            rows={3}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Enter product benefits (supports HTML)"
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">How To Apply</span>
          <textarea
            value={values.howToApply}
            onChange={(e) => updateField("howToApply", e.target.value)}
            rows={3}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Enter application instructions (supports HTML)"
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">FAQ</span>
          <textarea
            value={values.faq}
            onChange={(e) => updateField("faq", e.target.value)}
            rows={4}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Enter FAQs (supports HTML)"
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Details</span>
          <textarea
            value={values.details}
            onChange={(e) => updateField("details", e.target.value)}
            rows={3}
            className="w-full rounded-3xl border border-input bg-input/30 px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Price *</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Compare at price</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={values.compareAtPrice}
            onChange={(e) => updateField("compareAtPrice", e.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Currency</span>
          <Input value={values.currency} onChange={(e) => updateField("currency", e.target.value)} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Stock quantity</span>
          <Input
            type="number"
            min="0"
            value={values.stockQuantity}
            onChange={(e) => updateField("stockQuantity", Number(e.target.value))}
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Category *</span>
          <select
            value={values.categorySlug}
            onChange={(e) => updateField("categorySlug", e.target.value)}
            required
            className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">Thumbnail URL</span>
          <Input
            value={values.thumbnail}
            onChange={(e) => updateField("thumbnail", e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="size-4 rounded border-border"
          />
          Best seller product
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="size-4 rounded border-border"
          />
          Active (visible in shop)
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving} className="rounded-full">
          {isSaving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
