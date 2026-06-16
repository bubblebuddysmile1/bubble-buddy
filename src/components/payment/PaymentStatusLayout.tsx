import Link from "next/link";
import type { ReactNode } from "react";

type PaymentStatusLayoutProps = {
  icon: ReactNode;
  badge: string;
  title: string;
  description: ReactNode;
  actions: ReactNode;
  variant?: "success" | "failure";
};

export default function PaymentStatusLayout({
  icon,
  badge,
  title,
  description,
  actions,
  variant = "success",
}: PaymentStatusLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-16 text-foreground">
      <div
        className={`pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl ${
          variant === "success" ? "bg-emerald-500/10" : "bg-destructive/10"
        }`}
      />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div
          className={`checkout-success-enter mx-auto max-w-lg rounded-[2rem] border border-border bg-card p-10 text-center shadow-xl ${
            variant === "failure" ? "checkout-field-error" : ""
          }`}
        >
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              variant === "success" ? "bg-emerald-500/15" : "bg-destructive/10"
            }`}
          >
            {icon}
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.32em] text-primary">{badge}</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">{title}</h1>
          <div className="mt-3 text-sm leading-7 text-muted-foreground">{description}</div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Need assistance?{" "}
          <Link href="/shop" className="font-semibold text-primary hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    </main>
  );
}
