"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "داشبورد", icon: "خ" },
  { href: "/clients", label: "موکل\u200cها", icon: "م" },
  { href: "/cases", label: "پرونده\u200cها", icon: "پ" },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1 text-xs transition-colors ${
              isActive(item.href)
                ? "text-primary font-medium"
                : "text-foreground/50"
            }`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
              isActive(item.href) ? "bg-primary/10 text-primary" : "bg-surface-alt"
            }`}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
