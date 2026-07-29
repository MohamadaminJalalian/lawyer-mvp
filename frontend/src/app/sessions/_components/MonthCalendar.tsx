"use client";

import { useState } from "react";
import {
  getJalaliMonthDays,
  getJalaliMonthStart,
  getJalaliMonthYearLabel,
  getJalaliDayNumberLatin,
  getWeekdayColumnIndex,
  shiftJalaliMonth,
  toLocalISODate,
  toPersianDigits,
} from "@/lib/date-utils";

const WEEKDAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

interface MonthCalendarProps {
  selectedDate: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
}

export default function MonthCalendar({ selectedDate, onSelect, onClose }: MonthCalendarProps) {
  const [monthStart, setMonthStart] = useState<Date>(() =>
    getJalaliMonthStart(selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date())
  );

  const days = getJalaliMonthDays(monthStart);
  const leadingBlanks = getWeekdayColumnIndex(monthStart);
  const todayISO = toLocalISODate(new Date());

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className="absolute right-0 z-20 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg"
        dir="rtl"
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonthStart((m) => shiftJalaliMonth(m, -1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
            aria-label="ماه قبل"
          >
            ›
          </button>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {getJalaliMonthYearLabel(monthStart)}
          </span>
          <button
            type="button"
            onClick={() => setMonthStart((m) => shiftJalaliMonth(m, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
            aria-label="ماه بعد"
          >
            ‹
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-secondary)]">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const iso = toLocalISODate(day);
            const isSelected = iso === selectedDate;
            const isToday = iso === todayISO;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelect(iso)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition ${
                  isSelected
                    ? "bg-[var(--brand)] text-[var(--brand-foreground)]"
                    : isToday
                    ? "border border-[var(--brand)] text-[var(--text-primary)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {toPersianDigits(getJalaliDayNumberLatin(day))}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
