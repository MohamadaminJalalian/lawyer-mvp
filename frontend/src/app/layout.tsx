import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import { SecretaryProvider } from "@/context/SecretaryContext";
import { TrashProvider } from "@/context/TrashContext";
import { ClientProvider } from "@/context/ClientContext";
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
        <AuthProvider>
          <SecretaryProvider>
            <TrashProvider>
              <ClientProvider>
                <DashboardLayout>{children}</DashboardLayout>
              </ClientProvider>
            </TrashProvider>
          </SecretaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}