import { Suspense } from "react";
import PaymentPendingClient from "@/components/payment/PaymentPendingClient";

export const metadata = {
  title: "Payment processing",
};

export default function PaymentPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <PaymentPendingClient />
    </Suspense>
  );
}
