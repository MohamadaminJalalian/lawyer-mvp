"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function LogoutButton() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const { logout } = useAuth();

  async function handleConfirm() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setModalOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        خروج
      </button>
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-opacity"
            onClick={() => !isLoggingOut && setModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              dir="rtl"
              className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl ring-1 ring-border"
            >
              <h3 className="text-lg font-semibold text-card-foreground">
                خروج از حساب
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                آیا از خروج از حساب کاربری مطمئن هستید؟
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoggingOut}
                  className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-destructive-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isLoggingOut}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
