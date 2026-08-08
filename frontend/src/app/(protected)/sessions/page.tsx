"use client";

import { useMemo, useState } from "react";
import { mockSessions } from "@/mocks/sessions.mock";
import type { ConsultationSession, CreateSessionInput } from "@/types/session.types";
import { toJalaliDate, toWeekdayName } from "@/lib/date-utils";
import SessionsSearchBar from "./_components/SessionsSearchBar";
import SessionsTable from "./_components/SessionsTable";
import AddSessionModal from "./_components/AddSessionModal";
import ViewSessionModal from "./_components/ViewSessionModal";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ConsultationSession[]>(mockSessions);
  const [query, setQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewingSession, setViewingSession] = useState<ConsultationSession | null>(null);

  const filteredSessions = useMemo(() => {
    const q = query.trim();
    return sessions
      .filter((s) => {
        if (!q) return true;
        const nameMatch = s.clientName.includes(q);
        const jalaliMatch = toJalaliDate(s.sessionDate).includes(q);
        const weekdayMatch = toWeekdayName(s.sessionDate).includes(q);
        const isoMatch = s.sessionDate.includes(q);
        return nameMatch || jalaliMatch || weekdayMatch || isoMatch;
      })
      .sort((a, b) => (a.sessionDate + a.sessionTime > b.sessionDate + b.sessionTime ? -1 : 1));
  }, [sessions, query]);

  function handleAddSession(input: CreateSessionInput) {
    const newSession: ConsultationSession = {
      id: `session-${Date.now()}`,
      ...input,
      status: "SCHEDULED",
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="mx-auto max-w-5xl p-6" dir="rtl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">جلسات مشاوره</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            ثبت و پیگیری جلسات مشاوره با موکلین
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setAddModalOpen(true)}
            className="order-2 w-full rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-[var(--brand-foreground)] shadow-sm transition hover:bg-[var(--brand-hover)] sm:order-1 sm:w-auto"
          >
            + افزودن جلسه جدید
          </button>
          <SessionsSearchBar query={query} onQueryChange={setQuery} />
        </div>
        <SessionsTable sessions={filteredSessions} onViewSession={setViewingSession} />

        <AddSessionModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSession}
        />

        <ViewSessionModal session={viewingSession} onClose={() => setViewingSession(null)} />
      </div>
    </div>
  );
}