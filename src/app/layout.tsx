import type { Metadata } from "next";

import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblebuddy.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Bubble Buddy | Premium Beauty Essentials",
    template: "%s | Bubble Buddy",
  },
  description:
    "Shop premium skincare, haircare, and makeup essentials at Bubble Buddy with secure checkout and fast delivery.",
  keywords: [
    "beauty store",
    "skincare",
    "haircare",
    "makeup",
    "bubble buddy",
    "online beauty shop",
    "cosmetics online",
    "beauty essentials",
  ],
  applicationName: "Bubble Buddy smile",
  authors: [{ name: "Bubble Buddy smile" }],
  creator: "Bubble Buddy smile",
  publisher: "Bubble Buddy  smile",
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: "Bubble Buddy smile | Premium Beauty Essentials",
    description:
      "Shop premium skincare, haircare, and makeup essentials at Bubble Buddy with secure checkout and fast delivery.",
    type: "website",
    siteName: "Bubble Buddy",
    url: appUrl,
    images: [
      {
        url: "/category/1.jpg",
        alt: "Bubble Buddy beauty products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bubble Buddy | Premium Beauty Essentials",
    description:
      "Shop premium skincare, haircare, and makeup essentials at Bubble Buddy with secure checkout and fast delivery.",
    images: ["/category/1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
