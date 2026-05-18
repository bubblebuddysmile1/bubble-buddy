import type { Metadata } from "next";

import "./globals.css";





export const metadata: Metadata = {
  title: "bubble buddy smile",
  description: "A simple app to help you smile more often. Just click the button and see a cute bubble buddy smiling back at you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body>{children}</body>
    </html>
  );
}
