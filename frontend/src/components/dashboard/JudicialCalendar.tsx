"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

import {
  jalaliMonthNames,
  jalaliWeekdayNamesShort,
  jalaliMonthLength,
  jalaliWeekday,
  toPersianDigits,
  today as todayJalali,
  type JalaliDate,
} from "@/lib/jalali";
import { fetchHolidaysByYear, type HolidayEntry } from "@/data/judicial-holidays";
import { getAllEntries, priorityColors, type CalendarEntry } from "@/data/calendar-entries";
import { highestPriorityForDate } from "@/lib/reminders";
import DayEntriesModal from "./DayEntriesModal";

export default function JudicialCalendar() {
  const [open, setOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const t = todayJalali();
  const [viewYear, setViewYear] = useState(t.jy);
  const [viewMonth, setViewMonth] = useState(t.jm);

  const [holidays, setHolidays] = useState<HolidayEntry[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [holidaysFailed, setHolidaysFailed] = useState(false);

  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<JalaliDate | null>(null);

  async function refreshEntries() {
    setEntries(await getAllEntries());
  }

  useEffect(() => {
    refreshEntries();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingHolidays(true);
    setHolidaysFailed(false);

    fetchHolidaysByYear(viewYear)
      .then((data) => {
        if (cancelled) return;
        setHolidays(data);
      })
      .catch(() => {
        if (cancelled) return;
        setHolidaysFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingHolidays(false);
      });

    return () => {
      cancelled = true;
    };
  }, [viewYear]);

  function handleToggle() {
    if (!open && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
      setViewYear(t.jy);
      setViewMonth(t.jm);
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function goPrevMonth() {
    setViewMonth((m) => {
      if (m === 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }

  function goNextMonth() {
    setViewMonth((m) => {
      if (m === 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }

  const holidayMap = new Map(holidays.map((h) => [`${h.month}-${h.day}`, h.title]));

  const monthLen = jalaliMonthLength(viewYear, viewMonth);
  const firstWeekday = jalaliWeekday(viewYear, viewMonth, 1); // شنبه=۰ ... جمعه=۶

  const cells: (JalaliDate | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= monthLen; d += 1) cells.push({ jy: viewYear, jm: viewMonth, jd: d });

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-primary"
      >
        <CalendarIcon size={16} className="text-primary" />
        <span className="font-medium">
          {toPersianDigits(t.jd)} {jalaliMonthNames[t.jm - 1]} {toPersianDigits(t.jy)}
        </span>
      </button>

      {open &&
        buttonRect &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[70] w-[300px] rounded-xl border border-border bg-card p-3 shadow-xl"
            style={{
              top: buttonRect.bottom + 8,
              left: Math.min(
                Math.max(buttonRect.right - 300, 8),
                (typeof window !== "undefined" ? window.innerWidth : 1200) - 308,
              ),
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={goNextMonth}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="ماه بعد"
              >
                <ChevronRight size={16} />
              </button>

              <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                {jalaliMonthNames[viewMonth - 1]} {toPersianDigits(viewYear)}
                {loadingHolidays && (
                  <Loader2 size={13} className="animate-spin text-muted-foreground" />
                )}
              </span>

              <button
                type="button"
                onClick={goPrevMonth}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="ماه قبل"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {jalaliWeekdayNamesShort.map((wd, i) => (
                <span key={i} className={i === 6 ? "text-destructive" : ""}>
                  {wd}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, idx) => {
                if (!cell) return <span key={`empty-${idx}`} />;

                const isFriday = idx % 7 === 6;
                const holidayTitle = holidayMap.get(`${cell.jm}-${cell.jd}`);
                const isHoliday = isFriday || Boolean(holidayTitle);
                const isToday =
                  cell.jy === t.jy && cell.jm === t.jm && cell.jd === t.jd;
                const entryPriority = highestPriorityForDate(entries, cell.jy, cell.jm, cell.jd);

                return (
                  <button
                    key={idx}
                    type="button"
                    title={holidayTitle}
                    onClick={() => setSelectedDay(cell)}
                    className={`relative flex h-8 items-center justify-center rounded-lg text-xs transition-colors ${
                      isToday
                        ? "bg-primary font-bold text-white"
                        : isHoliday
                          ? "text-destructive hover:bg-muted"
                          : "text-foreground hover:bg-muted"
                    }`}
                    style={
                      entryPriority && !isToday
                        ? { boxShadow: `inset 0 0 0 1.5px ${priorityColors[entryPriority]}` }
                        : undefined
                    }
                  >
                    {toPersianDigits(cell.jd)}
                    {holidayTitle && !isToday && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-destructive" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 border-t border-border pt-2 text-[11px] leading-5 text-muted-foreground">
              {holidaysFailed
                ? "اتصال به منبع تعطیلات برقرار نشد؛ فقط تعطیلات ثابت ملی نشون داده می‌شه."
                : "نقطه‌ی قرمز = تعطیل رسمی. کادر رنگی = کار ثبت‌شده. برای ثبت کار روی هر روز کلیک کنید."}
            </p>
          </div>,
          document.body,
        )}

      {selectedDay && (
        <DayEntriesModal
          jy={selectedDay.jy}
          jm={selectedDay.jm}
          jd={selectedDay.jd}
          onClose={() => setSelectedDay(null)}
          onChanged={refreshEntries}
        />
      )}
    </>
  );
}
