"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildLoginUrl } from "@/features/auth/utils/auth-redirect";
import DashboardLayout from "@/components/layout/DashboardLayout";

function ProtectedGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "unauthenticated") {
      const query = searchParams.toString();
      const fullPath = query ? `${pathname}?${query}` : pathname;
      router.replace(buildLoginUrl(fullPath));
    }
  }, [status, pathname, searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm text-slate-500">در حال بررسی نشست...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        </div>
      }
    >
      <ProtectedGuard>{children}</ProtectedGuard>
    </Suspense>
  );
}