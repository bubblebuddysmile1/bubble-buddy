"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
}

interface Deal {
  id: number;
  title: string;
  description?: string;
  dealType: string;
  urgencyLevel: string;
  discountPercent?: number;
  discountFixed?: string;
  limitedQuantity?: number;
  couponCode?: string;
  maxCoupons?: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  products: Product[];
}

export default function EditDealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dealType: "LIMITED_STOCK",
    urgencyLevel: "NORMAL",
    discountPercent: "",
    discountFixed: "",
    limitedQuantity: "",
    couponCode: "",
    maxCoupons: "",
    isActive: true,
    startsAt: "",
    endsAt: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealRes, productsRes] = await Promise.all([
          fetch(`/api/deals/${params.id}`),
          fetch("/api/products?limit=1000")
        ]);

        if (dealRes.ok) {
          const deal: Deal = await dealRes.json();
          setFormData({
            title: deal.title,
            description: deal.description || "",
            dealType: deal.dealType,
            urgencyLevel: deal.urgencyLevel,
            discountPercent: deal.discountPercent?.toString() || "",
            discountFixed: deal.discountFixed || "",
            limitedQuantity: deal.limitedQuantity?.toString() || "",
            couponCode: deal.couponCode || "",
            maxCoupons: deal.maxCoupons?.toString() || "",
            isActive: deal.isActive,
            startsAt: deal.startsAt ? new Date(deal.startsAt).toISOString().slice(0, 16) : "",
            endsAt: deal.endsAt ? new Date(deal.endsAt).toISOString().slice(0, 16) : ""
          });
          setSelectedProducts(deal.products.map(p => p.id));
        }

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : null,
        discountFixed: formData.discountFixed ? parseFloat(formData.discountFixed) : null,
        limitedQuantity: formData.limitedQuantity ? parseInt(formData.limitedQuantity) : null,
        maxCoupons: formData.maxCoupons ? parseInt(formData.maxCoupons) : null,
        productIds: selectedProducts
      };

      const response = await fetch(`/api/deals/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to update deal");
      }

      router.push("/admin/deals");
    } catch (error) {
      alert("Error updating deal: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="p-6 text-center">Loading deal...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/admin/deals" className="inline-block">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Deals
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Edit Deal</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update deal details and settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4 md:col-span-2">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Deal Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Summer Flash Sale"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this deal..."
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Deal Configuration */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Deal Configuration</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Deal Type *</label>
              <select
                name="dealType"
                value={formData.dealType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="LIMITED_STOCK">Limited Stock</option>
                <option value="COUPON_CODE">Coupon Code</option>
                <option value="FLASH_SALE">Flash Sale</option>
                <option value="BUNDLE_DEAL">Bundle Deal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urgency Level</label>
              <select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Is Active</label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Discount Information */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Discount</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Discount %</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fixed Discount Amount</label>
              <input
                type="number"
                name="discountFixed"
                value={formData.discountFixed}
                onChange={handleChange}
                placeholder="e.g., 100"
                step="0.01"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Limited Stock / Coupons */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Limits</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Limited Quantity</label>
              <input
                type="number"
                name="limitedQuantity"
                value={formData.limitedQuantity}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Coupon Code</label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="e.g., SUMMER20"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Coupons</label>
              <input
                type="number"
                name="maxCoupons"
                value={formData.maxCoupons}
                onChange={handleChange}
                placeholder="e.g., 100"
                min="0"
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Schedule</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="datetime-local"
                name="startsAt"
                value={formData.startsAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="datetime-local"
                name="endsAt"
                value={formData.endsAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold">Select Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
            {products.map(product => (
              <label key={product.id} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductSelect(product.id)}
                  className="w-4 h-4 border border-border rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? "Updating..." : "Update Deal"}
          </Button>
          <Link href="/admin/deals">
            <Button type="button" variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
