import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession("/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 hidden h-screen shrink-0 md:flex">
        <AdminSidebar userName={user?.name} userEmail={user?.email ?? session.email} />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
