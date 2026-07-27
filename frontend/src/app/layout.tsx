import type { Metadata } from "next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ClientProvider } from "@/context/ClientContext";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
});

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
      <body className={`${vazirmatn.className} bg-slate-50`}>
        <ClientProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </ClientProvider>
      </body>
    </html>
  );
}