"use client";

import { useRouter } from "next/navigation";

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger/10 text-danger mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        عدم دسترسی
      </h1>
      <p className="text-foreground/60 mb-8 max-w-sm">
        شما اجازه دسترسی به این بخش را ندارید.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
      >
        بازگشت به داشبورد
      </button>
    </div>
  );
}
