"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function CasesPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole("ADMIN");

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">پرونده\u200cها</h1>
          <p className="text-sm text-foreground/60 mt-1">
            مدیریت پرونده\u200cهای حقوقی
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:bg-surface-alt transition-colors">
              بایگانی پرونده
            </button>
          )}
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors">
            پرونده جدید
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-8 text-center">
        <p className="text-foreground/60">
          لیست پرونده\u200cها در اینجا نمایش داده خواهد شد.
        </p>
        {isAdmin && (
          <p className="text-xs text-primary mt-2">
            (دکمه بایگانی پرونده فقط برای مدیر دفتر نمایش داده می\u200cشود)
          </p>
        )}
      </div>
    </div>
  );
}
