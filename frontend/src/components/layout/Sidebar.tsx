"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CalendarDays,
  CheckSquare,
  Settings,
  X,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

const menuItems = [
  { title: "داشبورد", href: "/", icon: LayoutDashboard },
  { title: "پرونده‌ها", href: "/cases", icon: FolderKanban },
  { title: "موکلین", href: "/clients", icon: Users },
  { title: "جلسات دادگاه", href: "/hearings", icon: CalendarDays },
  { title: "وظایف", href: "/tasks", icon: CheckSquare },
  { title: "تنظیمات", href: "/settings", icon: Settings },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدیر دفتر",
  STAFF: "کارمند",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-72 border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                دفتر وکالت
              </h1>
              <p className="mt-1 text-sm text-slate-500">مدیریت پرونده‌ها</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="بستن منو"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {user?.fullName?.slice(0, 2) ?? "کا"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user?.fullName ?? "کاربر"}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {user ? ROLE_LABELS[user.role] ?? user.role : ""}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}