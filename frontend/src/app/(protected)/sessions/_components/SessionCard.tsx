"use client";

import type { ConsultationSession } from "@/types/session.types";
import { toJalaliDate, toWeekdayName, formatTime12 } from "@/lib/date-utils";
import SessionStatusBadge from "./SessionStatusBadge";

interface SessionCardProps {
  session: ConsultationSession;
  onView: (session: ConsultationSession) => void;
}

export default function SessionCard({ session, onView }: SessionCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="font-medium text-[var(--text-primary)]">
          {session.clientName}
        </span>

        <SessionStatusBadge status={session.status} />
      </div>

      {/* Phone */}
      <div
        className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]"
        dir="ltr"
      >
        <span className="truncate">{session.clientPhone}</span>

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
      </div>

      {/* Date & Time */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
        <span>{toJalaliDate(session.sessionDate)}</span>

        <span className="text-[var(--border)]">·</span>

        <span>{toWeekdayName(session.sessionDate)}</span>

        <span className="text-[var(--border)]">·</span>

        <span>{formatTime12(session.sessionTime)}</span>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={() => onView(session)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand)]"
      >
        <svg
          width="18"
          height="18"
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

        مشاهده جزئیات
      </button>
    </div>
  );
}