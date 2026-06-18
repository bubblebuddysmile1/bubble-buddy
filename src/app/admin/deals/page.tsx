"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, AlertCircle, Zap, Gift, Clock } from "lucide-react";

interface Deal {
  id: number;
  title: string;
  dealType: "LIMITED_STOCK" | "COUPON_CODE" | "FLASH_SALE" | "BUNDLE_DEAL";
  urgencyLevel: "NORMAL" | "URGENT" | "CRITICAL";
  discountPercent?: number | null;
  discountFixed?: string | null;
  limitedQuantity?: number | null;
  claimedQuantity: number;
  maxCoupons?: number | null;
  usedCoupons: number;
  isActive: boolean;
  endsAt?: string | null;
  createdAt: string;
  _count?: {
    dealClaims: number;
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/deals");
        if (!response.ok) throw new Error("Failed to fetch deals");
        const data = await response.json();
        setDeals(data.deals || []);
      } catch (err) {
        setError("Failed to load deals");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      const response = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete deal");
      setDeals(deals.filter(deal => deal.id !== id));
    } catch (err) {
      alert("Failed to delete deal");
      console.error(err);
    }
  };

  const getDealIcon = (dealType: string) => {
    switch (dealType) {
      case "LIMITED_STOCK":
        return <AlertCircle className="w-4 h-4" />;
      case "FLASH_SALE":
        return <Zap className="w-4 h-4" />;
      case "COUPON_CODE":
        return <Gift className="w-4 h-4" />;
      case "BUNDLE_DEAL":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "text-red-600 bg-red-50";
      case "URGENT":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getDiscountText = (deal: Deal) => {
    if (deal.discountPercent) return `${deal.discountPercent}% OFF`;
    if (deal.discountFixed) return `${deal.discountFixed} OFF`;
    return "Special Deal";
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading deals...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deal Management</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage limited offers, flash sales, and coupon deals
          </p>
        </div>
        <Link href="/admin/deals/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Deal
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-semibold">Deal</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Discount</th>
                <th className="px-6 py-3 text-left font-semibold">Progress</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Expires</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">{deal.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getDealIcon(deal.dealType)}
                      <span className="text-xs">{deal.dealType.replace(/_/g, " ")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{getDiscountText(deal)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {deal.dealType === "LIMITED_STOCK" && deal.limitedQuantity ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">
                          {deal.claimedQuantity} / {deal.limitedQuantity}
                        </p>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${(deal.claimedQuantity / deal.limitedQuantity) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ) : deal.dealType === "COUPON_CODE" && deal.maxCoupons ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">
                          {deal.usedCoupons} / {deal.maxCoupons}
                        </p>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{
                              width: `${(deal.usedCoupons / deal.maxCoupons) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        deal.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {deal.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deal.endsAt ? (
                      <span className="text-xs">
                        {new Date(deal.endsAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No expiry</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/deals/${deal.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(deal.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deals.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No deals created yet</p>
            <Link href="/admin/deals/new">
              <Button>Create Your First Deal</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
