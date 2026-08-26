"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Footer from "@/components/store/Footer";
import Navbar from "@/components/store/Navbar";
import TopProgress from "@/components/ui/TopProgress";
import CursorEffect from "@/components/ui/CursorEffect";

const WelcomePopup = dynamic(() => import("@/components/store/WelcomePopup"), {
  ssr: false,
});

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        <CursorEffect />
        {children}
      </>
    );
  }

  return (
    <>
      <CursorEffect />
      <TopProgress />
      <Navbar />
      {children}
      <Footer />
      <WelcomePopup />
    </>
  );
}
