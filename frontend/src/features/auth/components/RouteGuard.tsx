"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function RouteGuardInner({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      const redirectPath = pathname || "/";
      const params = new URLSearchParams(searchParams.toString());
      params.set("redirect", redirectPath);
      router.push(`/auth/login?${params.toString()}`);
    }
  }, [loading, authenticated, router, pathname, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-foreground/60">در حال بررسی نشست...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-foreground/80 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-light transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-foreground/60">در حال بارگذاری...</p>
          </div>
        </div>
      }
    >
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
}
