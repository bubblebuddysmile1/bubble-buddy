import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Bubble Buddy",
    template: "%s | Bubble Buddy",
  },
  description:
    "Discover premium beauty essentials for skincare, haircare, and makeup at Bubble Buddy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body> 
       <Navbar />
       {children}
       <Footer />
      </body>
    </html>
  );
}
