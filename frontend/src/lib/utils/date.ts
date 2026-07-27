import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export function formatPersianDate(date?: string | null) {
  if (!date) return "—";

  return dayjs(date)
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/MM/DD");
}