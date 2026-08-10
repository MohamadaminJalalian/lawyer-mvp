"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f6f2]" dir="rtl">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* دکمه‌ی شناور باز کردن منو - فقط موبایل */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E1D8] bg-white text-[#4B4A44] shadow-sm transition hover:bg-[#FAF8F3] lg:hidden"
        aria-label="باز کردن منو"
      >
        <Menu size={20} />
      </button>

      {/* محتوای اصلی: بدنه + فوتر، با فاصله از سایدبار در دسکتاپ */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:mr-16" : "lg:mr-64"
        }`}
      >
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}