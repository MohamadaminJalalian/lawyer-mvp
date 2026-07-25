"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="relative w-full max-w-sm">
        <Search
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="جست‌وجو..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-10 pl-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
        />
      </div>

      <button className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}