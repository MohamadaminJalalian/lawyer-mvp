"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ClientsPage() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">موکل\u200cها</h1>
          <p className="text-sm text-foreground/60 mt-1">
            مدیریت اطلاعات موکلین
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors">
          موکل جدید
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-8 text-center">
        <p className="text-foreground/60">
          لیست موکل\u200cها در اینجا نمایش داده خواهد شد.
        </p>
      </div>
    </div>
  );
}
