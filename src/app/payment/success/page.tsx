import { Suspense } from "react";
import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";

export const metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
