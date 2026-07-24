"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدیر دفتر",
  STAFF: "کارمند",
};

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Right side (RTL): User info */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {user.fullName}
                </span>
                <span className="text-xs text-foreground/50">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {user.fullName.charAt(0)}
              </div>
            </div>
          )}
          <LogoutButton />
        </div>

        {/* Left side (RTL): App title */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary hidden sm:inline">
            سامانه مدیریت پرونده
          </span>
          <span className="text-lg font-bold text-primary sm:hidden">
            مدیریت پرونده
          </span>
        </div>
      </div>
    </header>
  );
}
