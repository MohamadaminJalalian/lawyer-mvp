"use client";

import { toJalaliDate, toWeekdayName } from "@/lib/date-utils";

interface SessionDateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  minDate?: string;
  error?: string;
}

export default function SessionDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
  error,
}: SessionDateTimePickerProps) {
  const weekday = date ? toWeekdayName(date) : "";
  const jalaliPreview = date ? toJalaliDate(date) : "";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        تاریخ و ساعت جلسه
      </label>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {date && (
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
          <span className="font-medium">{weekday}</span>
          <span>·</span>
          <span>{jalaliPreview}</span>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}