"use client";

import type { ConsultationSession } from "@/types/session.types";
import {
  toJalaliDate,
  toWeekdayName,
  formatTime12,
} from "@/lib/date-utils";
import SessionStatusBadge from "./SessionStatusBadge";
import SessionCard from "./SessionCard";

interface SessionsTableProps {
  sessions: ConsultationSession[];
  onViewSession: (session: ConsultationSession) => void;
}

export default function SessionsTable({
  sessions,
  onViewSession,
}: SessionsTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] py-16 text-center">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          جلسه‌ای با این مشخصات پیدا نشد
        </p>
      </div>
    );
  }

  return (
    <>
      {/* دسکتاپ / تبلت: جدول */}
      <div
        className="hidden overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] md:block"
        dir="rtl"
      >
        <table className="min-w-full border-collapse">
          <thead className="bg-[var(--surface-muted)]">
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">
                نام موکل
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                شماره تماس
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                تاریخ جلسه
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                روز
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                ساعت
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                وضعیت
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                عملیات
              </th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-[var(--border)] transition hover:bg-[var(--surface-muted)]/60"
              >
                {/* Client */}
                <td className="px-4 py-3">
                  <span className="font-medium text-[var(--text-primary)]">
                    {session.clientName}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={`tel:${session.clientPhone}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-[var(--brand-foreground)]"
                      aria-label={`تماس با ${session.clientName}`}
                      title="تماس"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>

                    <span dir="ltr" className="text-[var(--text-secondary)]">
                      {session.clientPhone}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-center text-[var(--text-secondary)] whitespace-nowrap">
                  {toJalaliDate(session.sessionDate)}
                </td>

                {/* Weekday */}
                <td className="px-4 py-3 text-center text-[var(--text-secondary)] whitespace-nowrap">
                  {toWeekdayName(session.sessionDate)}
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-center text-[var(--text-secondary)] whitespace-nowrap">
                  {formatTime12(session.sessionTime)}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SessionStatusBadge status={session.status} />
                  </div>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => onViewSession(session)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand)]"
                      aria-label="مشاهده جزئیات"
                      title="مشاهده جزئیات"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* موبایل: کارت */}
      <div className="flex flex-col gap-3 md:hidden">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onView={onViewSession} />
        ))}
      </div>
    </>
  );
}