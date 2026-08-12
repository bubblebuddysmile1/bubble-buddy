"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminOrderRow = {
  id: number;
  orderNumber: string;
  customerEmail: string | null;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  shippingPhone: string | null;
  shippingName: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  items: Array<{ id: number; name: string; quantity: number; unitPrice: string; totalPrice: string }>;
  itemCount: number;
  placedAt: string | null;
  returnAllowed: boolean;
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
  const [returnAllowedSelections, setReturnAllowedSelections] = useState<Record<number, boolean>>(
    () => Object.fromEntries(orders.map((order) => [order.id, order.returnAllowed])),
  );
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [refundLoadingId, setRefundLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tableViewportRef = useRef<HTMLDivElement>(null);

  const scrollTable = (direction: "left" | "right") => {
    const container = tableViewportRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.9;
    container.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleSaveStatus = async (orderId: number) => {
    const status = statusSelections[orderId] as StatusOption;
    setError(null);
    setLoadingId(orderId);

    const returnAllowed = returnAllowedSelections[orderId];

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, returnAllowed }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error ?? "Unable to update order status.");
      }

      const data = await response.json();
      setRows((current) =>
        current.map((row) =>
          row.id === orderId ? { ...row, status: data.status, returnAllowed } : row,
        ),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update order status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRefund = async (orderId: number) => {
    setError(null);
    setRefundLoadingId(orderId);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to process refund.");
      }

      setRows((current) =>
        current.map((row) =>
          row.id === orderId ? { ...row, paymentStatus: body.paymentStatus } : row,
        ),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to process refund.");
    } finally {
      setRefundLoadingId(null);
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

      <div className="relative hidden md:block">
        <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full bg-background/95 shadow-sm"
            onClick={() => scrollTable("left")}
            aria-label="Scroll orders table left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full bg-background/95 shadow-sm"
            onClick={() => scrollTable("right")}
            aria-label="Scroll orders table right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div ref={tableViewportRef} className="max-h-[75vh] overflow-auto rounded-4xl border border-border bg-card shadow-lg scroll-smooth">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Mobile</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Placed</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Return reason</th>
                <th className="px-5 py-4">Return Allowed</th>
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
                      {order.customerPhone && <p className="text-xs text-primary">{order.customerPhone}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{order.shippingName ?? order.customerName ?? "—"}</p>
                      <p className="text-xs">{order.shippingPhone ?? order.customerPhone ?? "—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground max-w-72">
                    {order.shippingAddress ? (
                      <p className="text-xs text-muted-foreground truncate">{order.shippingAddress}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">—</p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-foreground">${order.totalAmount}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-xs">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="rounded-2xl bg-background/80 p-2">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × ${item.unitPrice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {order.placedAt ? new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{formatStatus(order.paymentStatus)}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-56 truncate">{order.returnReason ?? "—"}</td>
                  <td className="px-5 py-4">
                    <label className="inline-flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={returnAllowedSelections[order.id]}
                        disabled={loadingId === order.id}
                        onChange={(event) =>
                          setReturnAllowedSelections((current) => ({
                            ...current,
                            [order.id]: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      Allow return
                    </label>
                  </td>
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
                        disabled={
                          loadingId === order.id ||
                          (statusSelections[order.id] === order.status &&
                            returnAllowedSelections[order.id] === order.returnAllowed)
                        }
                        onClick={() => handleSaveStatus(order.id)}
                      >
                        {loadingId === order.id ? "Updating…" : "Save"}
                      </Button>
                      {(order.status === "CANCELLED" || order.status === "RETURNED") && order.paymentStatus === "PAID" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={loadingId === order.id || refundLoadingId === order.id}
                          onClick={() => handleRefund(order.id)}
                        >
                          {refundLoadingId === order.id ? "Refunding…" : "Refund"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((order) => (
          <div key={order.id} className="rounded-[1.5rem] border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.customerName ?? "Guest"} · {order.customerEmail ?? "No email"}
                </p>
              </div>
              <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", getStatusBadgeClasses(order.status))}>
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">${order.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Items</span>
                <span className="text-foreground">{order.itemCount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Placed</span>
                <span className="text-foreground">
                  {order.placedAt ? new Date(order.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                </span>
              </div>
            </div>
              <div className="mt-4 rounded-3xl bg-background/80 p-4">
                <h3 className="text-sm font-semibold text-foreground">Order items</h3>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-card/70 p-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p>{item.quantity} × Rs{item.unitPrice}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-background/70 p-3">
                <label className="flex items-center justify-between gap-3 text-sm text-foreground">
                  <span>Allow return</span>
                  <input
                    type="checkbox"
                    checked={returnAllowedSelections[order.id]}
                    disabled={loadingId === order.id}
                    onChange={(event) =>
                      setReturnAllowedSelections((current) => ({
                        ...current,
                        [order.id]: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <select
                  className="w-full rounded-full border border-border bg-input/70 px-3 py-2 text-sm text-foreground outline-none transition hover:border-primary"
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
                  className="w-full"
                  variant="outline"
                  disabled={
                    loadingId === order.id ||
                    (statusSelections[order.id] === order.status &&
                      returnAllowedSelections[order.id] === order.returnAllowed)
                  }
                  onClick={() => handleSaveStatus(order.id)}
                >
                  {loadingId === order.id ? "Updating…" : "Save"}
                </Button>
                {(order.status === "CANCELLED" || order.status === "RETURNED") && order.paymentStatus === "PAID" && (
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    disabled={refundLoadingId === order.id}
                    onClick={() => handleRefund(order.id)}
                  >
                    {refundLoadingId === order.id ? "Refunding…" : "Refund"}
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
