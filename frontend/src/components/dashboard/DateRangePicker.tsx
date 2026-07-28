"use client";


import DatePicker from "react-multi-date-picker";
import type { DateObject } from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { CalendarDays } from "lucide-react";
interface DateRangePickerProps {
  value: DateObject[];
  onChange: (dates: DateObject[]) => void;
}
export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {

  const renderValue = () => {
    if (value.length === 0) return "";

    if (value.length === 1) {
      return value[0].format("YYYY/MM/DD");
    }

    return `${value[0].format("YYYY/MM/DD")} - ${value[1].format(
      "YYYY/MM/DD"
    )}`;
  };

  return (
    <DatePicker
      value={value}
      onChange={(dates) => {
  if (Array.isArray(dates)) {
    onChange(dates as DateObject[]);
  }
}}
      range
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD"
      render={(_, openCalendar) => (
        <div className="relative w-full">

          <input
            readOnly
            onClick={openCalendar}
            value={renderValue()}
            placeholder="انتخاب بازه تاریخ"
            className="
              w-full
              cursor-pointer
              rounded-xl
              border
              border-[#ddd5c8]
              bg-white
              py-3
              pr-4
              pl-11
              text-sm
              outline-none
              transition
              focus:border-[#a9762f]
            "
          />

          <CalendarDays
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#a9762f]
              pointer-events-none
            "
          />

        </div>
      )}
    />
  );
}