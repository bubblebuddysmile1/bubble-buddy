"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShareProductButtonProps = {
  name: string;
  slug: string;
  className?: string;
};

export default function ShareProductButton({
  name,
  slug,
  className,
}: ShareProductButtonProps) {
  const [status, setStatus] = useState<"idle" | "shared">("idle");

  const handleShare = async () => {
    const url = `${window.location.origin}/shop/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: `Check out ${name}`, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        return;
      }

      setStatus("shared");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      // Sharing can be cancelled by the user.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={status === "shared" ? "Product link copied" : `Share ${name}`}
      title={status === "shared" ? "Product link copied" : "Share product"}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "rounded-full text-foreground transition hover:bg-muted",
        className,
      )}
    >
      {status === "shared" ? <Check className="size-4 text-emerald-600" /> : <Share2 className="size-4" />}
    </button>
  );
}