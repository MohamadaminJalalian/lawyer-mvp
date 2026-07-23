import type { Metadata } from "next";
import "./globals.css";

import { ClientProvider } from "@/context/ClientContext";

export const metadata: Metadata = {
  title: "دفتر وکالت پارسا",
  description: "سامانه مدیریت پرونده‌های دفتر وکالت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}