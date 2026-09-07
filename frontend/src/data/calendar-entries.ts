// لایه‌ی داده برای «سررسید دیجیتال» وکیل — یادداشت روی هر تاریخ + سطح اهمیت.
//
// فعلاً روی localStorage ذخیره می‌شه (چون هنوز بک‌اند وصل نیست)، ولی همه‌ی
// توابع async هستن و امضاشون دقیقاً شبیه چیزیه که یه فراخوانی fetch واقعی
// می‌داشت — یعنی وقتی بک‌اند آماده شد، فقط کافیه بدنه‌ی هر تابع رو با یه
// fetch به API واقعی عوض کنی؛ کامپوننت‌هایی که این توابع رو صدا می‌زنن
// نیازی به تغییر ندارن.

export type Priority = "NORMAL" | "URGENT" | "CRITICAL";

export const priorityLabels: Record<Priority, string> = {
  NORMAL: "عادی",
  URGENT: "ضروری",
  CRITICAL: "فوری",
};

// تعداد «نقطه‌ی هشدار میانی» به‌غیر از روز قبل و روز موعد (که برای همه ثابته)
export const priorityExtraStageCount: Record<Priority, number> = {
  NORMAL: 1,
  URGENT: 2,
  CRITICAL: 3,
};

export const priorityColors: Record<Priority, string> = {
  NORMAL: "#8C8A80",
  URGENT: "#B9832F",
  CRITICAL: "#A32D2D",
};

export interface CalendarEntry {
  id: string;
  jy: number;
  jm: number;
  jd: number; // تاریخ موعد (شمسی)
  title: string;
  description?: string;
  priority: Priority;
  createdAt: string; // ISO — برای محاسبه‌ی نسبی نقاط هشدار میانی لازمه
  // در آینده می‌تونه به یه پرونده/موکل هم وصل بشه:
  caseId?: string;
}

const STORAGE_KEY = "lawyer-mvp:calendar-entries";

function readAll(): CalendarEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalendarEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: CalendarEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export async function getAllEntries(): Promise<CalendarEntry[]> {
  return readAll();
}

export async function getEntriesForDate(
  jy: number,
  jm: number,
  jd: number,
): Promise<CalendarEntry[]> {
  return readAll().filter((e) => e.jy === jy && e.jm === jm && e.jd === jd);
}

export async function addEntry(
  input: Omit<CalendarEntry, "id" | "createdAt">,
): Promise<CalendarEntry> {
  const entry: CalendarEntry = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(entry);
  writeAll(all);
  return entry;
}

export async function updateEntry(
  id: string,
  patch: Partial<Omit<CalendarEntry, "id" | "createdAt">>,
): Promise<void> {
  const all = readAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
  writeAll(all);
}

export async function deleteEntry(id: string): Promise<void> {
  writeAll(readAll().filter((e) => e.id !== id));
}
