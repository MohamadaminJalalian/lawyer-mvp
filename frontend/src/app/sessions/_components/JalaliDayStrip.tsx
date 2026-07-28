"use client";

import { useMemo, useState } from "react";
import { toDayMonth, toWeekdayName, toLocalISODate } from "@/lib/date-utils";
import MonthCalendar from "./MonthCalendar";

interface JalaliDay {
  iso: string;
  weekday: string;
  dayNumber: string;
  monthName: string;
}

const DAYS_PER_PAGE = 7;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDay(date: Date): JalaliDay {
  const iso = toLocalISODate(date);
  const { day, month } = toDayMonth(date);
  return { iso, weekday: toWeekdayName(iso), dayNumber: day, monthName: month };
}

interface JalaliDayStripProps {
  selectedDate: string;
  onSelect: (iso: string) => void;
}

export default function JalaliDayStrip({ selectedDate, onSelect }: JalaliDayStripProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [anchor, setAnchor] = useState<Date>(today);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const days = useMemo(() => {
    return Array.from({ length: DAYS_PER_PAGE }, (_, i) => {
      const d = new Date(anchor);
      d.setDate(d.getDate() + i);
      return buildDay(d);
    });
  }, [anchor]);

  const isAtStart = toLocalISODate(anchor) === toLocalISODate(today);

  function handleSelectFromCalendar(iso: string) {
    onSelect(iso);
    setAnchor(startOfDay(new Date(`${iso}T00:00:00`)));
    setCalendarOpen(false);
  }

  return (
    <div>
      <div className="relative mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">تاریخ جلسه</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCalendarOpen((o) => !o)}
            className="flex h-7 items-center gap-1 rounded-full border border-[var(--border)] px-2.5 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
          >
            📅 انتخاب از تقویم
          </button>

          <button
            type="button"
            onClick={() =>
              setAnchor((a) => {
                const d = new Date(a);
                d.setDate(d.getDate() - DAYS_PER_PAGE);
                return d < today ? today : d;
              })
            }
            disabled={isAtStart}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] disabled:opacity-30"
            aria-label="هفته قبل"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() =>
              setAnchor((a) => {
                const d = new Date(a);
                d.setDate(d.getDate() + DAYS_PER_PAGE);
                return d;
              })
            }
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
            aria-label="هفته بعد"
          >
            ‹
          </button>
        </div>

        {calendarOpen && (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelect={handleSelectFromCalendar}
            onClose={() => setCalendarOpen(false)}
          />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const isActive = day.iso === selectedDate;
          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => onSelect(day.iso)}
              className={`flex min-w-[76px] flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition ${
                isActive
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--brand)]"
              }`}
            >
              <span className="text-xs font-medium">{day.weekday}</span>
              <span className="text-base font-bold">{day.dayNumber}</span>
              <span
                className={`text-[11px] ${isActive ? "text-white/80" : "text-[var(--text-secondary)]"}`}
              >
                {day.monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}