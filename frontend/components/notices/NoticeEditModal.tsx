"use client";

import { X, CalendarDays } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import type { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { NoticeListItem } from "./NoticesTable";

const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

// دقیقاً همون کلاس‌های مشترکِ فایل EditCaseModal.tsx در src
const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

const mockCategories = ["ملکی", "کیفری", "خانواده", "تجاری", "اسناد", "جلسه", "مالی"];

interface NoticeEditModalProps {
  open: boolean;
  notice: NoticeListItem | null;
  onClose: () => void;
  onChange: (field: keyof NoticeListItem, value: string) => void;
  onSave: () => void;
}

export default function NoticeEditModal({
  open,
  notice,
  onClose,
  onChange,
  onSave,
}: NoticeEditModalProps) {
  if (!open || !notice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* هدر */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#EDEBE2] bg-white p-5">
          <h2 className="font-bold text-[#262420]">ویرایش اطلاعیه</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="text-[#8C8A80] transition-colors hover:text-[#262420]"
          >
            <X size={20} />
          </button>
        </div>

        {/* بدنه */}
        <div className="p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="space-y-5"
          >
            {/* عنوان + موکل */}
            <div className={rowClass}>
              <div>
                <label className={labelClass}>عنوان اطلاعیه</label>
                <input
                  type="text"
                  value={notice.title}
                  onChange={(e) => onChange("title", e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>نام موکل</label>
                <div className="w-full rounded-lg border border-[#E4E1D8] bg-[#F7F5F0] p-2 text-right text-sm text-[#6B6A63]">
                  {notice.clientName}
                </div>
                <p className="mt-1 text-sm text-[#8C8A80]">
                  موکل اطلاعیه پس از ثبت قابل تغییر نیست.
                </p>
              </div>
            </div>

            {/* تاریخ موعد + دسته‌بندی */}
            <div className={rowClass}>
              <div>
                <label className={labelClass}>تاریخ موعد</label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A9762F]"
                  />
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={notice.date}
                    onChange={(date) =>
                      onChange(
                        "date",
                        date
                          ? toEnglishDigits(
                              (date as DateObject).format("YYYY/MM/DD")
                            )
                          : ""
                      )
                    }
                    calendarPosition="bottom-right"
                    inputClass={`${fieldClass} pr-8`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>دسته‌بندی</label>
                <select
                  value={notice.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className={fieldClass}
                >
                  {mockCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* متن اطلاعیه */}
            <div>
              <label className={labelClass}>متن اطلاعیه</label>
              <textarea
                rows={5}
                value={notice.description}
                onChange={(e) => onChange("description", e.target.value)}
                className={`${fieldClass} resize-none p-3`}
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#E4E1D8] bg-white px-4 py-2 text-sm transition-colors hover:bg-[#f8f5ef]"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#A9762F] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#946A2A]"
              >
                ذخیره تغییرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
