"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/store/Footer";
import Navbar from "@/components/store/Navbar";
import TopProgress from "@/components/ui/TopProgress";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopProgress />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
