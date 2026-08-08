"use client";

// مسیر این فایل: app/cases/_components/EditCaseModal.tsx

import { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Modal from "./Modal";
import { mockCategories } from "../../../../mocks/cases.mock";
import type { CaseListItem, CasePriority } from "../../../../mocks/cases.types";

const CURRENT_USER_ROLE: "ADMIN" | "SECRETARY" = "ADMIN";

interface FormValues {
  internalNumber: string;
  title: string;
  categoryId: string;
  priority: CasePriority;
  courtCaseNumber: string;
  courtName: string;
  branch: string;
  opponentName: string;
  formedAt: string;
  description: string;
}

const internalNumberPattern = /^[\u0600-\u06FFa-zA-Z0-9\s\-\/]+$/;

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const internalNumber = values.internalNumber.trim();

  if (!internalNumber) {
    errors.internalNumber = "شماره داخلی پرونده الزامی است.";
  } else if (internalNumber.length > 50) {
    errors.internalNumber =
      "شماره داخلی پرونده نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.";
  } else if (!internalNumberPattern.test(internalNumber)) {
    errors.internalNumber =
      "شماره داخلی فقط می‌تواند شامل حروف، اعداد، فاصله، خط تیره و اسلش باشد.";
  }

  if (!values.title.trim()) {
    errors.title = "عنوان پرونده الزامی است.";
  }

  if (!values.categoryId) {
    errors.categoryId = "انتخاب دسته‌بندی الزامی است.";
  }

  if (!values.formedAt) {
    errors.formedAt = "تاریخ تشکیل پرونده الزامی است.";
  }

  return errors;
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

// تبدیل DateObject شمسی انتخاب‌شده در DatePicker به رشته‌ی میلادی ISO برای ذخیره
function toGregorianISO(date: DateObject | null): string {
  if (!date) return "";
  return date.convert(gregorian, gregorian_en).format("YYYY-MM-DD");
}

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";
const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

interface EditCaseModalProps {
  // پرونده‌ای که داریم ویرایشش می‌کنیم — از بیرون (صفحه لیست) بهمون داده می‌شه
  caseItem: CaseListItem;
  onClose: () => void;
  // وقتی ذخیره موفق شد، نسخه آپدیت‌شده پرونده رو به والد پس می‌دیم
  onSaved: (updated: CaseListItem) => void;
}

export default function EditCaseModal({
  caseItem,
  onClose,
  onSaved,
}: EditCaseModalProps) {
  const [values, setValues] = useState<FormValues>(() => ({
    internalNumber: caseItem.internalNumber,
    title: caseItem.title,
    categoryId: caseItem.category.id,
    priority: caseItem.priority,
    courtCaseNumber: caseItem.courtCaseNumber ?? "",
    courtName: caseItem.courtName ?? "",
    branch: caseItem.branch ?? "",
    opponentName: caseItem.opponentName ?? "",
    formedAt: caseItem.formedAt,
    description: caseItem.description ?? "",
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  function handleChange<K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitStatus("submitting");
    // روز سوم این خط با فراخوانی واقعی updateCase() جایگزین می‌شه
    await new Promise((resolve) => setTimeout(resolve, 600));

    const updatedCase: CaseListItem = {
      ...caseItem,
      internalNumber: values.internalNumber,
      title: values.title,
      category:
        mockCategories.find((category) => category.id === values.categoryId) ??
        caseItem.category,
      priority: values.priority,
      courtCaseNumber: values.courtCaseNumber || null,
      courtName: values.courtName || null,
      branch: values.branch || null,
      opponentName: values.opponentName || null,
      formedAt: values.formedAt,
      description: values.description || null,
      // nextSessionAt از فرم حذف شده، پس مقدار قبلی پرونده دست‌نخورده باقی می‌ماند
      nextSessionAt: caseItem.nextSessionAt,
      updatedAt: new Date().toISOString(),
    };

    onSaved(updatedCase);
    setSubmitStatus("success");
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2] sticky top-0 bg-white">
        <h2 className="text-lg font-bold text-[#262420]">ویرایش پرونده</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C8A80] hover:text-[#262420]"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {submitStatus === "success" ? (
          <div>
            <div className="p-4 bg-[#E7F1EB] text-[#2F6B4F] rounded-lg mb-4 text-sm">
              تغییرات پرونده «{values.internalNumber}» با موفقیت ذخیره شد.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
            >
              بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className={rowClass}>
              <div>
                <label className={labelClass}>شماره داخلی پرونده</label>
                <input
                  type="text"
                  value={values.internalNumber}
                  onChange={(event) =>
                    handleChange("internalNumber", event.target.value)
                  }
                  className={`${fieldClass} font-mono`}
                />
                {errors.internalNumber && (
                  <p className={errorClass}>{errors.internalNumber}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>عنوان پرونده</label>
                <input
                  type="text"
                  value={values.title}
                  onChange={(event) =>
                    handleChange("title", event.target.value)
                  }
                  className={fieldClass}
                />
                {errors.title && (
                  <p className={errorClass}>{errors.title}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>موکل</label>
              <div className="w-full p-2 border border-[#EDEBE2] rounded-lg bg-[#F7F5F0] text-[#6B6A63] text-sm">
                {caseItem.client.fullName}
              </div>
              <p className="text-sm text-[#8C8A80] mt-1">
                موکل پرونده پس از ثبت قابل تغییر نیست.
              </p>
            </div>

            <div className={rowClass}>
              <div>
                <label className={labelClass}>دسته‌بندی</label>
                <select
                  value={values.categoryId}
                  onChange={(event) =>
                    handleChange("categoryId", event.target.value)
                  }
                  className={fieldClass}
                >
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className={errorClass}>{errors.categoryId}</p>
                )}
              </div>
            </div>

            <div className={rowClass}>
              <div>
                <label className={labelClass}>شماره پرونده دادگاه</label>
                <input
                  type="text"
                  value={values.courtCaseNumber}
                  onChange={(event) =>
                    handleChange("courtCaseNumber", event.target.value)
                  }
                  className={`${fieldClass} font-mono`}
                />
              </div>

              <div>
                <label className={labelClass}>نام دادگاه</label>
                <input
                  type="text"
                  value={values.courtName}
                  onChange={(event) =>
                    handleChange("courtName", event.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </div>

            <div className={rowClass}>
              <div>
                <label className={labelClass}>شعبه</label>
                <input
                  type="text"
                  value={values.branch}
                  onChange={(event) =>
                    handleChange("branch", event.target.value)
                  }
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>طرف مقابل</label>
                <input
                  type="text"
                  value={values.opponentName}
                  onChange={(event) =>
                    handleChange("opponentName", event.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>تاریخ تشکیل پرونده</label>
              <div className="relative w-full">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9762F] pointer-events-none z-10"
                />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  value={toPersianDateObject(values.formedAt)}
                  onChange={(date) =>
                    handleChange("formedAt", toGregorianISO(date as DateObject | null))
                  }
                  calendarPosition="bottom-right"
                  containerClassName="w-full"
                  inputClass={`${fieldClass} pl-10 w-full`}
                  style={{ width: "100%" }}
                />
              </div>
              {errors.formedAt && (
                <p className={errorClass}>{errors.formedAt}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>توضیحات</label>
              <textarea
                value={values.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={3}
                className={fieldClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="px-6 py-2.5 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] disabled:opacity-50 transition-colors"
              >
                {submitStatus === "submitting"
                  ? "در حال ذخیره..."
                  : "ذخیره تغییرات"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}