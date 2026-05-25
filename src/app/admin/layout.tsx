import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/auth?returnTo=/admin/products");
  }

  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== "ADMIN") {
    redirect("/auth?returnTo=/admin/products");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin</p>
            <h1 className="text-lg font-bold text-foreground">Bubble Buddy Dashboard</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Product images
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              View store
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
