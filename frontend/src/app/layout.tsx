import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Vazirmatn } from "next/font/google";
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
});
export const metadata: Metadata = {
  title: "سامانه مدیریت پرونده‌های وکالت",
  description: "سامانه مدیریت پرونده‌های وکالت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} bg-slate-50`}>
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="min-h-screen md:mr-64">
          <Header />

          <main className="min-h-[calc(100vh-80px)] p-4 md:p-8">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}