import { Suspense } from "react";
import PaymentFailureClient from "@/components/payment/PaymentFailureClient";

export const metadata = {
  title: "Payment failed",
};

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <PaymentFailureClient />
    </Suspense>
  );
}
