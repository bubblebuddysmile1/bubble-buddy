import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Auth - Bubble Buddy",
};

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthForm />
    </main>
  );
}
