"use client";

import { useRouter } from "next/navigation";

export function AccessDenied() {
  const router = useRouter();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 text-center shadow-lg ring-1 ring-border">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-card-foreground">دسترسی غیرمجاز</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          شما اجازه دسترسی به این بخش را ندارید.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
        >
          بازگشت به داشبورد
        </button>
      </div>
    </div>
  );
}
