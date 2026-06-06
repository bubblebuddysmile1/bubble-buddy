"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminOrderRow = {
  id: number;
  orderNumber: string;
  customerEmail: string | null;
  customerName: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  itemCount: number;
  placedAt: string | null;
  returnReason?: string | null;
};

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "RETURN_REQUESTED",
  "CANCELLED",
  "RETURNED",
] as const;

type StatusOption = (typeof statusOptions)[number];

function formatStatus(status: string) {
  const normalized = status.replace(/_/g, " ").toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "PROCESSING":
      return "bg-primary/10 text-primary";
    case "SHIPPED":
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-700";
    case "RETURN_REQUESTED":
      return "bg-amber-500/10 text-amber-700";
    case "CANCELLED":
    case "RETURNED":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function OrderManagementTable({ orders }: { orders: AdminOrderRow[] }) {
  const [rows, setRows] = useState(orders);
  const [statusSelections, setStatusSelections] = useState<Record<number, string>>(
    () => Object.fromEntries(orders.map((order) => [order.id, order.status])),
  );
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSaveStatus = async (orderId: number) => {
    const status = statusSelections[orderId] as StatusOption;
    setError(null);
    setLoadingId(orderId);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error ?? "Unable to update order status.");
      }

      const data = await response.json();
      setRows((current) =>
        current.map((row) => (row.id === orderId ? { ...row, status: data.status } : row)),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update order status.");
    } finally {
      setLoadingId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <p className="rounded-4xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No orders found. Once customers place orders, they will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-4xl border border-border bg-card shadow-lg">
        <table className="w-full min-w-240 text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Placed</th>
              <th className="px-5 py-4">Payment</th>
            <th className="px-5 py-4">Return reason</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">#{order.orderNumber}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <div className="max-w-55 truncate">
                    <p className="font-medium text-foreground">{order.customerName ?? "Guest"}</p>
                    <p className="text-xs">{order.customerEmail ?? "No email"}</p>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-foreground">${order.totalAmount}</td>
                <td className="px-5 py-4 text-muted-foreground">{order.itemCount}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {order.placedAt ? new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{formatStatus(order.paymentStatus)}</td>
                <td className="px-5 py-4 text-muted-foreground max-w-56 truncate">{order.returnReason ?? "—"}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", getStatusBadgeClasses(order.status))}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <select
                      className="rounded-full border border-border bg-input/70 px-3 py-2 text-sm text-foreground outline-none transition hover:border-primary"
                      value={statusSelections[order.id]}
                      disabled={loadingId === order.id}
                      onChange={(event) =>
                        setStatusSelections((current) => ({
                          ...current,
                          [order.id]: event.target.value,
                        }))
                      }
                    >
                      {statusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {formatStatus(statusOption)}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={loadingId === order.id || statusSelections[order.id] === order.status}
                      onClick={() => handleSaveStatus(order.id)}
                    >
                      {loadingId === order.id ? "Updating…" : "Save"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
