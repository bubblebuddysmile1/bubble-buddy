"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Promotion = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  productId: number | null;
  availableQuantity: number | null;
  product: { id: number; name: string; slug: string; thumbnail: string | null } | null;
  activeFrom: string | null;
  activeUntil: string | null;
  isActive: boolean;
};

type ProductOption = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
};

type FormState = {
  code: string;
  title: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minOrderAmount: string;
  productId: string;
  availableQuantity: string;
  activeFrom: string;
  activeUntil: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  code: "",
  title: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  productId: "",
  availableQuantity: "",
  activeFrom: "",
  activeUntil: "",
  isActive: true,
};

export default function PromotionManager() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const [promotionsRes, productsRes] = await Promise.all([
        fetch("/api/promotions?admin=1&all=1"),
        fetch("/api/products?admin=1"),
      ]);

      const promotionsData = await promotionsRes.json();
      const productsData = await productsRes.json();

      if (promotionsRes.ok) {
        setPromotions(promotionsData.promotions ?? []);
      }

      if (productsRes.ok) {
        setProducts(productsData.products ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const resetForm = () => {
    setEditingCode(null);
    setForm(emptyForm);
    setError(null);
    setSuccess(null);
  };

  const startEdit = (promotion: Promotion) => {
    setEditingCode(promotion.code);
    setForm({
      code: promotion.code,
      title: promotion.title,
      description: promotion.description ?? "",
      discountType: promotion.discountType,
      discountValue: promotion.discountValue.toString(),
      minOrderAmount: promotion.minOrderAmount.toString(),
      productId: promotion.productId?.toString() ?? "",
      availableQuantity: promotion.availableQuantity?.toString() ?? "",
      activeFrom: promotion.activeFrom ?? "",
      activeUntil: promotion.activeUntil ?? "",
      isActive: promotion.isActive,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue: Number(form.discountValue || 0),
      minOrderAmount: Number(form.minOrderAmount || 0),
      productId: form.productId ? Number(form.productId) : null,
      availableQuantity: form.availableQuantity ? Number(form.availableQuantity) : null,
      activeFrom: form.activeFrom || null,
      activeUntil: form.activeUntil || null,
      isActive: form.isActive,
    };

    try {
      const url = editingCode
        ? `/api/promotions/${encodeURIComponent(editingCode)}`
        : "/api/promotions";
      const method = editingCode ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save promotion.");
        return;
      }

      setSuccess(editingCode ? "Promotion updated." : "Promotion created.");
      resetForm();
      await loadPromotions();
      router.refresh();
    } catch {
      setError("Unable to save promotion.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (promotion: Promotion) => {
    if (!window.confirm(`Delete promotion "${promotion.title}" (${promotion.code})?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/promotions/${encodeURIComponent(promotion.code)}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to delete promotion.");
        return;
      }

      if (editingCode === promotion.code) {
        resetForm();
      }

      setSuccess("Promotion deleted.");
      await loadPromotions();
      router.refresh();
    } catch {
      setError("Unable to delete promotion.");
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {editingCode ? "Edit promotion" : "Add promotion"}
          </h2>
          {editingCode && (
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
          <span className="font-medium">Coupon code *</span>
          <Input
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">Title *</span>
          <Input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Discount type</span>
            <select
              value={form.discountType}
              onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value as "PERCENTAGE" | "FIXED" }))}
              className="h-11 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed amount</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Discount value *</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.discountValue}
              onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Minimum order amount</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.minOrderAmount}
              onChange={(e) => setForm((prev) => ({ ...prev, minOrderAmount: e.target.value }))}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Limited product</span>
            <select
              value={form.productId}
              onChange={(e) => setForm((prev) => ({ ...prev, productId: e.target.value }))}
              className="h-11 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Any product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Available quantity</span>
            <Input
              type="number"
              min="0"
              step="1"
              value={form.availableQuantity}
              onChange={(e) => setForm((prev) => ({ ...prev, availableQuantity: e.target.value }))}
              placeholder="Leave blank for unlimited"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Status</span>
            <div className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="size-4 rounded border-border"
              />
              <span className="text-sm">Active promotion</span>
            </div>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Start date</span>
            <Input
              type="date"
              value={form.activeFrom}
              onChange={(e) => setForm((prev) => ({ ...prev, activeFrom: e.target.value }))}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">End date</span>
            <Input
              type="date"
              value={form.activeUntil}
              onChange={(e) => setForm((prev) => ({ ...prev, activeUntil: e.target.value }))}
            />
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}

        <Button type="submit" disabled={isSaving} className="rounded-full">
          {isSaving ? "Saving…" : editingCode ? "Update promotion" : "Create promotion"}
        </Button>
      </form>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">All promotions</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : promotions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No promotions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="flex flex-col gap-3 rounded-3xl border border-border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{promotion.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {promotion.code} · {promotion.discountType === "PERCENTAGE" ? `${promotion.discountValue}% off` : `₹${promotion.discountValue} off`}
                    {promotion.minOrderAmount > 0 && ` · Min ${promotion.minOrderAmount.toFixed(2)}`}
                    {!promotion.isActive && " · Inactive"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(promotion)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-xs font-medium transition hover:bg-muted"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promotion)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-destructive/30 px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10"
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
