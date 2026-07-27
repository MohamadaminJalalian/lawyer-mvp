"use client";

import { useState } from "react";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientProvider } from "@/context/ClientContext";
import { AuthProvider } from "@/context/AuthContext";
import { SecretaryProvider } from "@/context/SecretaryContext";
import { TrashProvider } from "@/context/TrashContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="fa" dir="rtl">
      <body className="bg-slate-50">
        <AuthProvider>
          <SecretaryProvider>
            <TrashProvider>
              <ClientProvider>
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="min-h-screen lg:mr-64">
                  <Header onMenuClick={() => setSidebarOpen(true)} />

                  <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
                    {children}
                  </main>

                  <Footer />
                </div>
              </ClientProvider>
            </TrashProvider>
          </SecretaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}