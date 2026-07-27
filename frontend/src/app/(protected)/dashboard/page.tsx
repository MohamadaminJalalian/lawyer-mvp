"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-card-foreground">سامانه مدیریت پرونده</h1>
            <p className="text-xs text-muted-foreground">دفتر وکالت</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="text-sm font-medium text-card-foreground">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === "ADMIN" ? "مدیر سیستم" : "کارمند"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-semibold text-card-foreground">
            خوش آمدید، {user?.fullName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            شما با موفقیت وارد سامانه شدید. از منوی بالا می‌توانید به بخش‌های مختلف دسترسی داشته باشید.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="font-semibold text-card-foreground">پرونده‌ها</h3>
            <p className="mt-1 text-sm text-muted-foreground">مدیریت پرونده‌های فعال</p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-semibold text-card-foreground">موکلین</h3>
            <p className="mt-1 text-sm text-muted-foreground">لیست موکلین و مراجعین</p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="font-semibold text-card-foreground">تقویم</h3>
            <p className="mt-1 text-sm text-muted-foreground">جلسات و جلسات دادگاه</p>
          </div>
        </div>
      </main>
    </div>
  );
}
