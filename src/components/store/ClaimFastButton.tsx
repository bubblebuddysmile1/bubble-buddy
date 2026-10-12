"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Zap } from "lucide-react";

interface ClaimFastButtonProps {
  dealId: number;
  onSuccess?: (couponCode?: string) => void;
}

export default function ClaimFastButton({ dealId, onSuccess }: ClaimFastButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/deals/${dealId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to claim deal");
        return;
      }

      const data = await response.json();
      setCouponCode(data.couponCode || null);
      setShowSuccess(true);

      onSuccess?.(data.couponCode);
    } catch (error) {
      console.error("Error claiming deal:", error);
      alert("An error occurred while claiming the deal");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
        <span>{couponCode ? `Deal code: ${couponCode}` : "Deal claimed!"}</span>
        {couponCode && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(couponCode);
                setCopyError(null);
              } catch {
                setCopyError("Could not copy code. Please copy it manually.");
              }
            }}
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 hover:bg-white"
          >
            <Copy className="size-3" />
            Copy
          </button>
        )}
        <Check className="size-4" />
        {copyError && <span className="basis-full font-normal">{copyError}</span>}
      </div>
    );
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={isLoading}
      size="sm"
      className="gap-2 rounded-full bg-linear-to-r from-primary to-accent hover:opacity-90"
    >
      <Zap className="w-4 h-4" />
      {isLoading ? "Claiming..." : "Claim Fast"}
    </Button>
  );
}
