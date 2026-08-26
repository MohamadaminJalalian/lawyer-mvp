import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function formatPersianDate(
  date: string | null | undefined,
): string {
  if (!date) return "—";
  return dayjs(date).calendar("jalali").format("YYYY/MM/DD");
}

export function toPersianDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

// تاریخ محلی (بدون شیفت تایم‌زون) - جایگزین toISOString().slice(0,10)
export function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const jalaliDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const weekdayFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
});

const dayMonthFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
});

const jalaliMonthYearFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "long",
  year: "numeric",
});

const jalaliMonthNameFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "long",
});

// عدد روز با ارقام لاتین - فقط برای مقایسه‌ی داخلی (مثل تشخیص «روز اول ماه»)
const jalaliDayNumberLatinFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
  day: "numeric",
});

export function toJalaliDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return jalaliDateFormatter.format(date).replace(/-/g, "/");
}

export function toWeekdayName(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return weekdayFormatter.format(date);
}

export function toDayMonth(date: Date): { day: string; month: string } {
  const parts = dayMonthFormatter.formatToParts(date);
  return {
    day: parts.find((p) => p.type === "day")?.value ?? "",
    month: parts.find((p) => p.type === "month")?.value ?? "",
  };
}

export function formatTime12(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "بعدازظهر" : "صبح";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${toPersianDigits(`${hour12}:${String(m).padStart(2, "0")}`)} ${period}`;
}

// ---------- توابع مخصوص باکس تقویم ماهانه ----------

export function getJalaliMonthYearLabel(date: Date): string {
  return jalaliMonthYearFormatter.format(date);
}

export function getJalaliMonthName(date: Date): string {
  return jalaliMonthNameFormatter.format(date);
}

export function getJalaliDayNumberLatin(date: Date): string {
  return jalaliDayNumberLatinFormatter.format(date);
}

export function getJalaliMonthStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  while (getJalaliDayNumberLatin(d) !== "1") {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

export function getJalaliMonthDays(monthStart: Date): Date[] {
  const days: Date[] = [];
  const startMonthName = getJalaliMonthName(monthStart);
  const d = new Date(monthStart);
  while (getJalaliMonthName(d) === startMonthName) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export function shiftJalaliMonth(monthStart: Date, direction: 1 | -1): Date {
  if (direction === 1) {
    const days = getJalaliMonthDays(monthStart);
    const next = new Date(monthStart);
    next.setDate(next.getDate() + days.length);
    return getJalaliMonthStart(next);
  }
  const prev = new Date(monthStart);
  prev.setDate(prev.getDate() - 1);
  return getJalaliMonthStart(prev);
}

// شنبه=0 ... جمعه=6
export function getWeekdayColumnIndex(date: Date): number {
  return (date.getDay() + 1) % 7;
}
