"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function RouteGuardInner({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const redirectPath = pathname || "/";
      const params = new URLSearchParams(searchParams.toString());
      params.set("redirect", redirectPath);
      router.push(`/auth/login?${params.toString()}`);
    }
  }, [status, router, pathname, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-foreground/60">
            در حال بررسی نشست...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
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
            <p className="mt-4 text-sm text-foreground/60">
              در حال بارگذاری...
            </p>
          </div>
        </div>
      }
    >
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
}
