"use client";

// مسیر این فایل: app/cases/_components/Sidebar.tsx

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  // رو موبایل، این مقدار می‌گه منو باز باشه یا بسته
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* نوار بالای موبایل — فقط زیر سایز md دیده می‌شه (md:hidden) */}
      <div className="md:hidden flex items-center justify-between bg-[#1E2A44] text-[#F7F5F0] p-4">
        <span className="font-bold text-sm">دفتر وکالت پارسا</span>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="باز کردن منو"
          className="text-2xl leading-none"
        >
          ☰
        </button>
      </div>

      {/* پس‌زمینه نیمه‌شفاف پشت منو، فقط وقتی منو باز باشه — با کلیک روش، منو بسته می‌شه */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* خود منوی کناری */}
      <aside
        className={`
          w-[190px] shrink-0 bg-[#1E2A44] text-[#F7F5F0] p-5 flex flex-col gap-1
          fixed md:static top-0 bottom-0 right-0 z-50
          transition-transform duration-200
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[15px]">دفتر وکالت پارسا</span>
          {/* دکمه بستن، فقط رو موبایل دیده می‌شه */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-xl leading-none"
            aria-label="بستن منو"
          >
            ×
          </button>
        </div>
        <div className="h-0.5 w-9 bg-[#A9762F] mb-5" />

        <Link
          href="/cases"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm bg-[#A9762F]/20 text-[#E7C888]"
        >
          پرونده‌ها
        </Link>
        <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[#9BA3B4]">
          موکل‌ها (به‌زودی)
        </div>
        <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[#9BA3B4]">
          جلسات (به‌زودی)
        </div>
      </aside>
    </>
  );
}