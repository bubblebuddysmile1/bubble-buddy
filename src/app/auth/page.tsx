import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Auth - Bubble Buddy",
};

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading authentication form...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
