"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

type OrderReturnRequestProps = {
  orderNumber: string;
  status: string;
  returnReason?: string | null;
};

export default function OrderReturnRequest({ orderNumber, status, returnReason }: OrderReturnRequestProps) {
  const [reason, setReason] = useState(returnReason ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(status);

  const canRequestReturn = requestStatus === "DELIVERED" || requestStatus === "SHIPPED";
  const isRequested = requestStatus === "RETURN_REQUESTED";
  const isReturned = requestStatus === "RETURNED";

  const helperText = useMemo(() => {
    if (isReturned) {
      return "Your return has been approved and refund processing has been completed.";
    }
    if (isRequested) {
      return "A return request is pending approval. You will be notified once it is reviewed.";
    }
    if (requestStatus === "SHIPPED") {
      return "Your order is on the way — you can request a return if the package does not arrive or is damaged.";
    }
    return "You can request a return for this order if items arrive damaged or not as described.";
  }, [isReturned, isRequested, requestStatus]);

  const handleRequestReturn = async () => {
    if (!reason.trim()) {
      setMessage("Please provide a reason for your return request.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/orders/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, reason }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to submit return request.");
      }

      setRequestStatus(body.status);
      setMessage("Your return request has been submitted. The admin team will review it soon.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit return request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <ArrowUpRight className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Return request</h2>
          <p className="mt-2 text-sm text-muted-foreground">{helperText}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <div className="rounded-3xl border border-border bg-background/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Order</p>
          <p className="mt-2 font-semibold text-foreground">#{orderNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">Current status: {requestStatus.replace("_", " ")}</p>
        </div>

        {isRequested || isReturned ? (
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <p className="font-semibold">Return status:</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isReturned
                ? "A return has been processed and refund status updated."
                : "Return request is awaiting admin approval."}
            </p>
            {returnReason && (
              <p className="mt-2 text-sm text-muted-foreground">Reason: {returnReason}</p>
            )}
          </div>
        ) : null}

        {canRequestReturn ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Return reason</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-32.5 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Describe why you'd like to return this order"
              disabled={isSubmitting}
            />
            {message ? (
              <div className="rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                {message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleRequestReturn}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting request…" : "Request a return"}
            </button>
          </div>
        ) : null}

        {!canRequestReturn && !isRequested && !isReturned ? (
          <div className="rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
            Return requests can be made after the order is delivered.
          </div>
        ) : null}
      </div>

      {requestStatus !== "RETURNED" && (
        <div className="mt-6 flex items-center gap-2 rounded-3xl border border-border bg-background/90 px-4 py-3 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 text-amber-600" />
          Please note: admin approval is required before the return is finalized and refund is applied.
        </div>
      )}
    </div>
  );
}
