"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Modal } from "@/components/ui/Modal";

export function LogoutButton() {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleConfirm() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setShowModal(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-danger/80 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        خروج از حساب
      </button>

      <Modal
        open={showModal}
        onClose={() => !loggingOut && setShowModal(false)}
        title="خروج از حساب"
        actions={
          <>
            <button
              onClick={handleConfirm}
              disabled={loggingOut}
              className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-60"
            >
              {loggingOut ? "در حال خروج..." : "خروج از حساب"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              disabled={loggingOut}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:bg-surface-alt transition-colors disabled:opacity-60"
            >
              انصراف
            </button>
          </>
        }
      >
        آیا از خروج از حساب کاربری مطمئن هستید؟
      </Modal>
    </>
  );
}
