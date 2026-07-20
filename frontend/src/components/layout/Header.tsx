import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CalendarDays,
  CheckSquare,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "داشبورد",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "پرونده‌ها",
    href: "/cases",
    icon: FolderKanban,
  },
  {
    title: "موکلین",
    href: "/clients",
    icon: Users,
  },
  {
    title: "جلسات دادگاه",
    href: "/hearings",
    icon: CalendarDays,
  },
  {
    title: "وظایف",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "تنظیمات",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 border-l border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">
            دفتر وکالت
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            مدیریت پرونده‌ها
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-sm font-medium text-slate-800">
              محمد احمدی
            </p>

            <p className="mt-1 text-xs text-slate-500">
              وکیل پایه یک دادگستری
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}