"use client";

import type { ConsultationSession } from "@/types/session.types";
import {
  toJalaliDate,
  toWeekdayName,
  formatTime12,
} from "@/lib/date-utils";
import SessionStatusBadge from "./SessionStatusBadge";

interface ViewSessionModalProps {
  session: ConsultationSession | null;
  onClose: () => void;
}

export default function ViewSessionModal({
  session,
  onClose,
}: ViewSessionModalProps) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-6 shadow-xl"
        dir="rtl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            جزئیات جلسه مشاوره
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">نام موکل</span>

            <span className="font-medium text-[var(--text-primary)]">
              {session.clientName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">
              شماره تماس
            </span>

            <a
              href={`tel:${session.clientPhone}`}
              className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              dir="ltr"
            >
              {session.clientPhone}
            </a>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">
              تاریخ جلسه
            </span>

            <span className="font-medium text-[var(--text-primary)]">
              {toWeekdayName(session.sessionDate)} ·{" "}
              {toJalaliDate(session.sessionDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">ساعت</span>

            <span className="font-medium text-[var(--text-primary)]">
              {formatTime12(session.sessionTime)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">وضعیت</span>

            <SessionStatusBadge status={session.status} />
          </div>

          <div>
            <span className="mb-1 block text-[var(--text-secondary)]">
              توضیحات
            </span>

            <p className="rounded-xl bg-[var(--surface-muted)] p-3 text-[var(--text-primary)]">
              {session.description || "توضیحی ثبت نشده است."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}