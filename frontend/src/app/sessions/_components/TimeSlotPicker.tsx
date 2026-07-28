"use client";

import { toPersianDigits } from "@/lib/date-utils";

interface TimeSlotPickerProps {
  time: string;
  onTimeChange: (value: string) => void;
}

const QUICK_SLOTS = ["09:00", "11:00", "14:00", "16:30"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

export default function TimeSlotPicker({ time, onTimeChange }: TimeSlotPickerProps) {
  const [hour, minute] = time ? time.split(":") : ["", ""];

  function handleCustomChange(nextHour: string, nextMinute: string) {
    if (nextHour && nextMinute) onTimeChange(`${nextHour}:${nextMinute}`);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">ساعت جلسه</p>

      <div className="flex flex-wrap gap-2">
        {QUICK_SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onTimeChange(slot)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              time === slot
                ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--brand)]"
            }`}
          >
            {toPersianDigits(slot)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-[var(--text-secondary)]">یا زمان دلخواه:</span>
        <select
          value={hour}
          onChange={(e) => handleCustomChange(e.target.value, minute || "00")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text-primary)]"
        >
          <option value="" disabled>ساعت</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>{toPersianDigits(h)}</option>
          ))}
        </select>
        <span className="text-sm text-[var(--text-secondary)]">:</span>
        <select
          value={minute}
          onChange={(e) => handleCustomChange(hour || "08", e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text-primary)]"
        >
          <option value="" disabled>دقیقه</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>{toPersianDigits(m)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}