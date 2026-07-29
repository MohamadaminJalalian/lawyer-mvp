"use client";

// مسیر این فایل: app/cases/_components/FilterModal.tsx

import { CalendarDays } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Modal from "./Modal";
import { mockCategories } from "../../../mocks/cases.mock";
import type { CaseStatus } from "../../../mocks/cases.types";

export type UrgencyOption = "URGENT" | "NOT_URGENT";

interface FilterModalProps {
  onClose: () => void;

  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;

  selectedUrgencies: UrgencyOption[];
  onToggleUrgency: (value: UrgencyOption) => void;

  selectedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;

  selectedStatuses: CaseStatus[];
  onToggleStatus: (status: CaseStatus) => void;

  onClearAll: () => void;
}

// تبدیل رشته‌ی میلادی ISO (مثل "2026-04-04") به DateObject شمسی برای نمایش در DatePicker
function toPersianDateObject(isoDate: string): DateObject | null {
  if (!isoDate) return null;
  return new DateObject({
    date: isoDate,
    format: "YYYY-MM-DD",
    calendar: gregorian,
    locale: gregorian_en,
  }).convert(persian, persian_fa);
}

// تبدیل DateObject شمسی انتخاب‌شده در DatePicker به رشته‌ی میلادی ISO برای فیلتر کردن
function toGregorianISO(date: DateObject | null): string {
  if (!date) return "";
  return date.convert(gregorian, gregorian_en).format("YYYY-MM-DD");
}

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-2 font-medium text-sm text-[#262420]";
const sectionClass = "py-4 border-b border-[#EDEBE2]";

export default function FilterModal({
  onClose,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  selectedUrgencies,
  onToggleUrgency,
  selectedCategoryIds,
  onToggleCategory,
  selectedStatuses,
  onToggleStatus,
  onClearAll,
}: FilterModalProps) {
  return (
    <Modal onClose={onClose} maxWidthClass="max-w-md">
      <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2]">
        <h2 className="font-bold text-[#262420]">فیلتر ها</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-[#8C8A80] hover:text-[#262420]"
        >
          ✕
        </button>
      </div>

      <div className="p-5">
        {/* بازه تاریخ تشکیل پرونده */}
        <div className={sectionClass}>
          <label className={labelClass}>بازه تاریخ تشکیل پرونده</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-[#8C8A80] block mb-1">
                از تاریخ
              </span>
              <div className="relative w-full">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9762F] pointer-events-none z-10"
                />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  value={toPersianDateObject(dateFrom)}
                  onChange={(date) =>
                    onDateFromChange(toGregorianISO(date as DateObject | null))
                  }
                  calendarPosition="bottom-right"
                  containerClassName="w-full"
                  inputClass={`${fieldClass} pl-9 w-full`}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-[#8C8A80] block mb-1">
                تا تاریخ
              </span>
              <div className="relative w-full">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9762F] pointer-events-none z-10"
                />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  value={toPersianDateObject(dateTo)}
                  onChange={(date) =>
                    onDateToChange(toGregorianISO(date as DateObject | null))
                  }
                  calendarPosition="bottom-right"
                  containerClassName="w-full"
                  inputClass={`${fieldClass} pl-9 w-full`}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* فوریت پرونده */}
        <div className={sectionClass}>
          <label className={labelClass}>پرونده ضروری</label>
          <div className="flex gap-2">
            {(
              [
                { value: "URGENT", label: "ضروری" },
                { value: "NOT_URGENT", label: "غیرضروری" },
              ] as { value: UrgencyOption; label: string }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onToggleUrgency(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  selectedUrgencies.includes(option.value)
                    ? "bg-[#A9762F] text-white border-[#A9762F]"
                    : "bg-white text-[#4B4A44] border-[#E4E1D8]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* دسته‌بندی — چندانتخابی، به‌شکل Chip */}
        <div className={sectionClass}>
          <label className={labelClass}>دسته‌بندی</label>
          <div className="flex flex-wrap gap-2">
            {mockCategories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onToggleCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? "bg-[#A9762F] text-white border-[#A9762F]"
                      : "bg-white text-[#4B4A44] border-[#E4E1D8]"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* وضعیت پرونده — چندانتخابی، به‌شکل Chip */}
        <div className="py-4">
          <label className={labelClass}>وضعیت</label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "ACTIVE", label: "فعال" },
                { value: "CLOSED", label: "مختومه" },
              ] as { value: CaseStatus; label: string }[]
            ).map((option) => {
              const isSelected = selectedStatuses.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onToggleStatus(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? "bg-[#A9762F] text-white border-[#A9762F]"
                      : "bg-white text-[#4B4A44] border-[#E4E1D8]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 p-5 border-t border-[#EDEBE2]">
        <button
          type="button"
          onClick={onClearAll}
          className="px-4 py-2 text-sm text-[#A32D2D] hover:underline"
        >
          حذف فیلترها
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
        >
          اعمال فیلتر
        </button>
      </div>
    </Modal>
  );
}