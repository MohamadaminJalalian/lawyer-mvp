// تبدیل تقویم شمسی (جلالی) <-> میلادی
// پیاده‌سازی الگوریتم استاندارد و عمومی تبدیل جلالی (بدون وابستگی به کتابخانه‌ی بیرونی)

export interface JalaliDate {
  jy: number; // سال شمسی
  jm: number; // ماه شمسی (۱ تا ۱۲)
  jd: number; // روز شمسی
}

function div(a: number, b: number) {
  return ~~(a / b);
}

function jalCal(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error("Invalid Jalali year " + jy);
  }

  let jm = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm2 = breaks[i];
    jump = jm2 - jp;
    if (jy < jm2) {
      jm = jump;
      break;
    }
    leapJ += div(jump, 33) * 8 + div(jump % 33, 4);
    jp = jm2;
  }
  let n = jy - jp;

  leapJ += div(n, 33) * 8 + div(((n % 33) + 3), 4);
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = (((n + 1) % 33) - 1) % 4;
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * ((gm + 9) % 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div((j % 1461), 4) * 5 + 308;
  const gd = div(i % 153, 5) + 1;
  const gm = (div(i, 153) % 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): JalaliDate {
  let gy = d2g(jdn).gy;
  let jy = gy - 621;
  let r = jalCal(jy);
  let jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      const jm = 1 + div(k, 31);
      const jd = (k % 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = (k % 30) + 1;
  return { jy, jm, jd };
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  return d2j(g2d(gy, gm, gd));
}

export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  const jdn = j2d(jy, jm, jd);
  return d2g(jdn);
}

export function jalaliToJsDate(jy: number, jm: number, jd: number): Date {
  const g = jalaliToGregorian(jy, jm, jd);
  return new Date(g.gy, g.gm - 1, g.gd);
}

export function isJalaliLeapYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

export function today(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

// شماره‌ی روز هفته با شنبه = ۰ ... جمعه = ۶ (به‌جای یکشنبه=۰ در جاوااسکریپت)
export function jalaliWeekday(jy: number, jm: number, jd: number): number {
  const g = jalaliToGregorian(jy, jm, jd);
  const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay(); // یکشنبه=۰ ... شنبه=۶
  return (jsDay + 1) % 7; // شنبه=۰ ... جمعه=۶
}

export const jalaliMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const jalaliWeekdayNamesShort = [
  "ش",
  "ی",
  "د",
  "س",
  "چ",
  "پ",
  "ج",
];

export function toPersianDigits(value: number | string): string {
  const map: Record<string, string> = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };
  return String(value).replace(/[0-9]/g, (d) => map[d]);
}
