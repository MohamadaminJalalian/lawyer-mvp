import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientProvider } from "@/context/ClientContext";

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
      <body className="bg-slate-50">
        <ClientProvider>
          <Sidebar />

          <div className="mr-64 min-h-screen">
            <Header />

            <main className="min-h-[calc(100vh-80px)] p-8">
              {children}
            </main>

            <Footer />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}