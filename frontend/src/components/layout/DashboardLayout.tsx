"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* محتوای اصلی: هدر + بدنه + فوتر، با فاصله از سایدبار در دسکتاپ */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:mr-16" : "lg:mr-64"
        }`}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
