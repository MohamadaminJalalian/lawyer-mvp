"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  Scale,
} from "lucide-react";

const menuItems = [
  {
    title: "داشبورد",
    href: "#",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "پرونده‌ها",
    href: "#",
    icon: FolderOpen,
  },
  {
    title: "موکلین",
    href: "#",
    icon: Users,
  },
  {
    title: "اسناد",
    href: "#",
    icon: FileText,
  },
  {
    title: "جلسات",
    href: "#",
    icon: CalendarDays,
  },
  {
    title: "اطلاعیه ها",
    href: "#",
    icon: Bell,
  },
  {
    title: "تنظیمات",
    href: "#",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside  dir="rtl"
  className="flex h-screen w-72 flex-col border-l border-slate-200 bg-white text-right">

      {/* Logo */}

      <div className="flex items-center gap-3 border-b border-slate-100 p-6">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Scale size={24} />
        </div>

        <div>
          <h2 className="font-extrabold text-slate-900">
            سامانه مدیریت پرونده موکلین
          </h2>

          <p className="text-sm text-slate-500">
            پنل وکیل
          </p>
        </div>

      </div>

      {/* Menu */}

      <nav className="mt-8 flex-1 px-4">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mb-2 flex items-center gap-4 rounded-2xl px-5 py-4 transition-all

              ${
                item.active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>

            </Link>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="border-t border-slate-100 p-4">

        <button className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-red-500 transition hover:bg-red-50">

          <LogOut size={22} />

          خروج

        </button>

      </div>

    </aside>
  );
}