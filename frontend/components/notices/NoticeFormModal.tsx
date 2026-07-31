"use client";

import { useState } from "react";
import { Paperclip, X, CalendarDays } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import type { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { NoticeListItem } from "./NoticesTable";

// دیتای موقتِ موکل‌ها و دسته‌بندی‌ها — بعداً از API واقعی (searchClients / getCategories) میاد
const mockClients = ["محمد احمدی", "علی رضایی", "زهرا کریمی"];
const mockCategories = ["ملکی", "کیفری", "خانواده", "تجاری"];

// تاریخ رو با اعداد انگلیسی ذخیره می‌کنیم (نه فارسی) تا فیلتر/جستجوی تاریخ درست کار کنه
const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

interface NoticeFormModalProps {
  onClose: () => void;
  onSubmit: (notice: Omit<NoticeListItem, "id">) => void;
}

export default function NoticeFormModal({ onClose, onSubmit }: NoticeFormModalProps) {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const isValid = title.trim() !== "" && category !== "" && dueDate !== null;

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!isValid || !dueDate) return;

    onSubmit({
      title,
      clientName,
      category,
      documentsCount: files.length,
      date: toEnglishDigits(dueDate.format("YYYY/MM/DD")),
      isImportant: false,
      description,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#ece7dd] px-4 py-4 sm:px-8 sm:py-6">
          <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            ثبت اطلاعیه جدید
          </h3>
          <button
            onClick={onClose}
            className="text-3xl text-slate-500 transition hover:text-[#a9762f]"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-8">
          {/* عنوان */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              عنوان اطلاعیه <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: جلسه دادگاه پرونده احمدی"
              className="w-full rounded-xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#a9762f]"
            />
          </div>

          {/* موکل مرتبط */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              موکل مرتبط
            </label>
            <select
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#a9762f]"
            >
              <option value="">انتخاب موکل...</option>
              {mockClients.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* تاریخ موعد */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              تاریخ موعد <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a9762f]"
              />
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                value={dueDate}
                onChange={(date) => setDueDate(date as DateObject)}
                calendarPosition="bottom-right"
                inputClass="w-full rounded-xl border border-[#ddd5c8] bg-white px-4 py-2.5 pr-11 text-sm outline-none focus:border-[#a9762f]"
              />
            </div>
          </div>

          {/* دسته‌بندی */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#a9762f]"
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {mockCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* متن اطلاعیه */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              متن اطلاعیه
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="متن کامل اطلاعیه رو اینجا بنویس..."
              className="w-full resize-none rounded-xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#a9762f]"
            />
          </div>

          {/* اسناد */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              اسناد
            </label>

            <label
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-dashed
                border-[#ddd5c8]
                bg-white
                px-4
                py-6
                text-sm
                text-[#a9762f]
                transition
                hover:bg-[#f8f5ef]
              "
            >
              <Paperclip size={18} />
              انتخاب فایل یا رها کردن اینجا
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
            </label>

            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-[#ece7dd] bg-white px-3 py-2 text-sm text-[#4b4b4b]"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="shrink-0 rounded p-1 text-slate-400 transition hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* دکمه‌ها */}
          <div className="flex flex-col gap-3 border-t border-[#ece7dd] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#ddd5c8] bg-white px-6 py-3 text-[#a9762f] transition hover:bg-[#f8f3e8] sm:w-auto"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full rounded-xl bg-[#a9762f] px-7 py-3 text-white transition hover:bg-[#946727] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              ثبت اطلاعیه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
