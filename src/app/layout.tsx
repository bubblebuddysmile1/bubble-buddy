import type { Metadata } from "next";

import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Bubble Buddy",
    template: "%s | Bubble Buddy",
  },
  description:
    "Discover premium beauty essentials for skincare, haircare, and makeup at Bubble Buddy.",
  keywords: [
    "beauty store",
    "skincare",
    "haircare",
    "makeup",
    "bubble buddy",
    "online beauty shop",
  ],
  openGraph: {
    title: "Bubble Buddy",
    description:
      "Discover premium beauty essentials for skincare, haircare, and makeup at Bubble Buddy.",
    type: "website",
    siteName: "Bubble Buddy",
    images: [
      {
        url: "/category/1.jpg",
        alt: "Bubble Buddy beauty products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bubble Buddy",
    description:
      "Discover premium beauty essentials for skincare, haircare, and makeup at Bubble Buddy.",
    images: ["/category/1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
