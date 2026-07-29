import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
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
              <ClientProvider>{children}</ClientProvider>
            </TrashProvider>
          </SecretaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}