import type { Metadata } from "next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "دفتر وکالت",
  description: "سامانه مدیریت پرونده‌های حقوقی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}