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
  Repeat,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useSecretaries } from "@/context/SecretaryContext";

const menuItems = [
  { title: "داشبورد", href: "/", icon: LayoutDashboard },
  { title: "پرونده‌ها", href: "/cases", icon: FolderKanban },
  { title: "موکلین", href: "/clients", icon: Users },
  { title: "جلسات دادگاه", href: "/hearings", icon: CalendarDays },
  { title: "وظایف", href: "/tasks", icon: CheckSquare },
  { title: "تنظیمات", href: "/settings", icon: Settings },
];

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();
  const { currentUser, toggleRole } = useAuth();
  const { getSecretaryById } = useSecretaries();

  const secretaryRecord =
    currentUser.role === "SECRETARY" && currentUser.secretaryId
      ? getSecretaryById(currentUser.secretaryId)
      : undefined;

  const displayName = secretaryRecord?.name ?? currentUser.name;
  const displayTitle = currentUser.title;

  return (
    <>
      {/* Overlay - only on mobile when open */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-64 border-l border-slate-200 bg-white transition-transform duration-200
        ${open ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900">دفتر وکالت</h1>
              <p className="mt-1 text-sm text-slate-500">مدیریت پرونده‌ها</p>
            </div>

            <button
              onClick={onClose}
              title="بستن منو"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition
                  ${active
                      ? "bg-[#A9762F]/10 text-[#A9762F] font-medium"
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
            {/* موقت: چون هنوز صفحه‌ی لاگین پیاده نشده، با کلیک روی این کارت
               می‌شود بین حالت ورود «وکیل» و «منشی» جابه‌جا شد تا هر دو نما
               از صفحات به‌صورت مجزا قابل بررسی باشند. */}
            <button
              type="button"
              onClick={toggleRole}
              title="جابه‌جایی بین حالت وکیل و منشی (موقت، تا پیاده‌سازی لاگین)"
              className="w-full rounded-xl bg-slate-100 p-3 text-right transition hover:bg-slate-200"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {displayName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{displayTitle}</p>
                </div>
                <Repeat size={16} className="shrink-0 text-slate-400" />
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}