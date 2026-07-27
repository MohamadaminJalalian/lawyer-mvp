"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildLoginUrl } from "@/features/auth/utils/auth-redirect";

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

  if (status === "loading")
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">در حال بررسی نشست...</p>
        </div>
      </div>
    );
  if (status === "unauthenticated") return null;
  return <>{children}</>;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    }>
      <ProtectedGuard>{children}</ProtectedGuard>
    </Suspense>
  );
}
