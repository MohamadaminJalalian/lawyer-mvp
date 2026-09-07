// موتور محاسبه‌ی «نقاط هشدار» برای هر ردیف سررسید، بر اساس سطح اهمیت.
//
// قانون: برای هر سه سطح، «یک روز قبل از موعد» و «خود روز موعد» همیشه هشدار
// دارن. علاوه‌بر این‌ها، بسته به سطح، چندتا «نقطه‌ی میانی» هم هست که به‌جای
// عدد روز ثابت، متناسب با فاصله‌ی زمانی بین لحظه‌ی ثبت تا موعد پخش می‌شن:
// عادی = ۱ نقطه (وسط فاصله)، ضروری = ۲ نقطه، فوری = ۳ نقطه.

import {
  jalaliToJsDate,
  gregorianToJalali,
  today as todayJalali,
  type JalaliDate,
} from "./jalali";
import {
  getAllEntries,
  priorityExtraStageCount,
  type CalendarEntry,
  type Priority,
} from "@/data/calendar-entries";

export interface ReminderCheckpoint {
  jy: number;
  jm: number;
  jd: number;
  label: string;
}

function toMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((toMidnight(b).getTime() - toMidnight(a).getTime()) / 86400000);
}

function toJalaliDate(d: Date): JalaliDate {
  return gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** همه‌ی نقاط هشدار یه ردیف رو (میانی + روز قبل + روز موعد) برمی‌گردونه. */
export function computeCheckpoints(entry: CalendarEntry): ReminderCheckpoint[] {
  const due = toMidnight(jalaliToJsDate(entry.jy, entry.jm, entry.jd));
  const dayBefore = addDays(due, -1);
  const created = toMidnight(new Date(entry.createdAt));

  const checkpoints: ReminderCheckpoint[] = [];

  const extraCount = priorityExtraStageCount[entry.priority];
  const usableSpan = daysBetween(created, dayBefore); // فاصله‌ی ثبت تا «یک روز قبل موعد»

  if (usableSpan > 1 && extraCount > 0) {
    for (let i = 1; i <= extraCount; i += 1) {
      const fraction = i / (extraCount + 1);
      const offset = Math.round(fraction * usableSpan);
      const clamped = Math.min(Math.max(offset, 1), usableSpan - 1);
      const stageDate = addDays(created, clamped);
      const jd = toJalaliDate(stageDate);
      checkpoints.push({ ...jd, label: `یادآوری زودهنگام (${i} از ${extraCount})` });
    }
  }

  const dayBeforeJalali = toJalaliDate(dayBefore);
  checkpoints.push({ ...dayBeforeJalali, label: "یک روز مانده به موعد" });
  checkpoints.push({ jy: entry.jy, jm: entry.jm, jd: entry.jd, label: "روز موعد" });

  // حذف نقاط تکراری (وقتی فاصله‌ها خیلی کوتاهن ممکنه دو نقطه رو یه روز بیفتن)
  const seen = new Set<string>();
  return checkpoints.filter((c) => {
    const key = `${c.jy}-${c.jm}-${c.jd}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface ActiveAlert {
  entry: CalendarEntry;
  checkpointLabel: string;
}

const SHOWN_LOG_KEY = "lawyer-mvp:calendar-entries:shown-log";

function readShownLog(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SHOWN_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeShownLog(log: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHOWN_LOG_KEY, JSON.stringify(log));
}

/**
 * بین همه‌ی ردیف‌ها می‌گرده، هرکدوم که امروز دقیقاً روی یه نقطه‌ی هشدار
 * می‌افته و هنوز امروز نشون داده نشده رو برمی‌گردونه و به‌عنوان دیده‌شده
 * علامت می‌زنه (تا در همون روز دوباره تکراری نشه).
 */
export async function checkForTodaysAlerts(): Promise<ActiveAlert[]> {
  const t = todayJalali();
  const entries = await getAllEntries();
  const log = readShownLog();
  const result: ActiveAlert[] = [];

  for (const entry of entries) {
    const checkpoints = computeCheckpoints(entry);
    const hit = checkpoints.find(
      (c) => c.jy === t.jy && c.jm === t.jm && c.jd === t.jd,
    );
    if (!hit) continue;

    const logKey = `${entry.id}:${t.jy}-${t.jm}-${t.jd}`;
    if (log[logKey]) continue;

    result.push({ entry, checkpointLabel: hit.label });
    log[logKey] = true;
  }

  if (result.length > 0) writeShownLog(log);
  return result;
}

/** برای نمایش نشانگر رنگی روی خانه‌های تقویم: بالاترین سطح اهمیتِ آن روز. */
export function highestPriorityForDate(
  entries: CalendarEntry[],
  jy: number,
  jm: number,
  jd: number,
): Priority | null {
  const dayEntries = entries.filter(
    (e) => e.jy === jy && e.jm === jm && e.jd === jd,
  );
  if (dayEntries.length === 0) return null;
  if (dayEntries.some((e) => e.priority === "CRITICAL")) return "CRITICAL";
  if (dayEntries.some((e) => e.priority === "URGENT")) return "URGENT";
  return "NORMAL";
}
