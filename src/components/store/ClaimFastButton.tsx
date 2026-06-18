"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface ClaimFastButtonProps {
  dealId: number;
  onSuccess?: (couponCode?: string) => void;
}

export default function ClaimFastButton({ dealId, onSuccess }: ClaimFastButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);

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

      // Reset after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error claiming deal:", error);
      alert("An error occurred while claiming the deal");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="rounded-full bg-green-100 px-4 py-2 text-center text-xs font-semibold text-green-700">
        {couponCode ? `Code: ${couponCode}` : "Deal Claimed! ✓"}
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
