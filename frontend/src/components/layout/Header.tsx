"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex min-h-16 items-center gap-3 px-3 sm:px-6">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            خوش آمدید
          </h2>
          <p className="hidden truncate text-xs text-slate-500 sm:block">
            مرور کلی وضعیت پرونده‌ها
          </p>
        </div>
      </div>
    </header>
  );
}