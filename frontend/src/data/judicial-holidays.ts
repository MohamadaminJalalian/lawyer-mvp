// دریافت تعطیلات رسمی ایران به‌صورت زنده از یک منبع باز روی گیت‌هاب
// (iyazdanicharati/IranHollidaysJSON) از طریق CDN جی‌اسدلیور.
//
// این‌جوری اگه تعطیلات رسمی یه سالی تغییر کنه (مثلاً به‌خاطر رؤیت هلال ماه یا
// مصوبه‌ی جدید دولت)، با آپدیت شدن اون ریپو، تقویم سامانه هم بدون نیاز به
// دیپلوی مجدد به‌روز می‌شه.
//
// ⚠️ این یه منبع عمومی و غیررسمیه (نه سایت خودِ قوه‌قضاییه)، برای همینه که
// یه fallback محلی (holidaysFallback) هم نگه داشتیم تا اگه فچ شکست خورد یا
// اینترنت نبود، حداقل تعطیلات ثابت ملی درست نمایش داده بشن. پیش از استناد
// حقوقی (مثل محاسبه‌ی مهلت قانونی)، همیشه با تقویم رسمی دفتر خودتون تطبیق بدید.

export interface HolidayEntry {
  month: number;
  day: number;
  title: string;
}

interface RemoteHolidayDay {
  date: string; // "1405/01/01"
  isHoliday: boolean;
  holidayDesription: string | null;
}

interface RemoteHolidayResponse {
  data: RemoteHolidayDay[];
  totalCount: number;
}

// تعطیلات ثابت ملی — همیشه معتبره، مستقل از تقویم قمری، برای fallback استفاده می‌شه
export const fixedNationalHolidaysFallback: HolidayEntry[] = [
  { month: 1, day: 1, title: "نوروز" },
  { month: 1, day: 2, title: "نوروز" },
  { month: 1, day: 3, title: "نوروز" },
  { month: 1, day: 4, title: "نوروز" },
  { month: 1, day: 12, title: "روز جمهوری اسلامی" },
  { month: 1, day: 13, title: "سیزده‌به‌در" },
  { month: 3, day: 14, title: "رحلت امام خمینی (ره)" },
  { month: 3, day: 15, title: "قیام ۱۵ خرداد" },
  { month: 11, day: 22, title: "پیروزی انقلاب اسلامی" },
  { month: 12, day: 29, title: "ملی‌شدن صنعت نفت" },
];

const cache = new Map<number, HolidayEntry[]>();

function cdnUrlFor(jy: number): string {
  return `https://cdn.jsdelivr.net/gh/iyazdanicharati/IranHollidaysJSON@main/${jy}.json`;
}

/**
 * تعطیلات رسمی یک سال شمسی رو در لحظه از منبع باز می‌گیره.
 * نتیجه برای هر سال کش می‌شه تا دوباره فچ نشه.
 * در صورت خطا (نبودِ اینترنت، سال پشتیبانی‌نشده و ...)، fallback ثابت رو برمی‌گردونه.
 */
export async function fetchHolidaysByYear(jy: number): Promise<HolidayEntry[]> {
  if (cache.has(jy)) return cache.get(jy)!;

  try {
    const res = await fetch(cdnUrlFor(jy), {
      // این داده حداکثر یک‌بار در روز عوض می‌شه، نیازی به فچ مکرر نیست
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) throw new Error(`status ${res.status}`);

    const json: RemoteHolidayResponse = await res.json();

    const entries: HolidayEntry[] = json.data
      .filter((d) => d.isHoliday)
      .map((d) => {
        const [, m, d2] = d.date.split("/").map(Number);
        return {
          month: m,
          day: d2,
          title: d.holidayDesription ?? "تعطیل رسمی",
        };
      });

    cache.set(jy, entries);
    return entries;
  } catch {
    // آفلاین یا سالی که هنوز توی منبع نیست — حداقل تعطیلات ثابت رو نشون بده
    return fixedNationalHolidaysFallback;
  }
}
