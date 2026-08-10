"use client";

// مسیر این فایل:
// app/cases/_components/EditCaseModal.tsx

import { useState } from "react";
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDays, Plus, Star } from "lucide-react";

import Modal from "./Modal";
import { mockClients, mockCategories } from "../../../mocks/cases.mock";
import type { CaseListItem } from "../../../mocks/cases.types";

interface SubCaseRow {
  referenceNumber: string;
  archiveNumber: string;
}

interface FormValues {
  internalNumber: string;
  title: string;
  subject: string;
  clientIds: string[];
  categoryId: string;
  isUrgent: boolean;
  opponentIds: string[];
  formedAt: string;
  description: string;
  subRows: SubCaseRow[];
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

type FormField = keyof FormValues;

/**
 * اطلاعاتی که ممکن است در mock / داده‌ی فعلی پرونده وجود داشته باشند
 * ولی در CaseListItem اصلی تعریف نشده‌اند.
 *
 * نکته:
 * isUrgent را اینجا دوباره تعریف نمی‌کنیم چون در CaseListItem
 * به صورت boolean تعریف شده و تعریف دوباره‌ی آن با boolean | undefined
 * باعث خطای TypeScript می‌شود.
 */

interface ExtendedCaseItem extends CaseListItem {
  clientIds?: string[];
  opponentIds?: string[];
  subRows?: SubCaseRow[];
}

const internalNumberPattern = /^[\u0600-\u06FFa-zA-Z0-9\s-/]+$/;

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

  if (!values.clientIds.some(Boolean)) {
    errors.clientIds = "انتخاب حداقل یک موکل الزامی است.";
  }

  if (!values.categoryId) {
    errors.categoryId = "انتخاب دسته‌بندی الزامی است.";
  }

  if (!values.formedAt) {
    errors.formedAt = "تاریخ تشکیل پرونده الزامی است.";
  }

  return errors;
}

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";

const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";

const errorClass = "text-sm text-[#A32D2D] mt-1";

const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

function getInitialDate(value: string): string {
  if (!value) return "";

  // اگر از قبل شمسی باشد
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    return value;
  }

  // اگر تاریخ میلادی ISO باشد
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    try {
      return new DateObject({
        date: value,
        format: "YYYY-MM-DD",
      })
        .convert(persian, persian_fa)
        .format("YYYY/MM/DD");
    } catch {
      return value;
    }
  }

  return value;
}

function normalizeIds(
  ids: string[] | undefined,
  fallbackId?: string,
): string[] {
  if (ids && ids.length > 0) {
    return ids;
  }

  return fallbackId ? [fallbackId] : [""];
}

interface EditCaseModalProps {
  caseItem: CaseListItem;
  onClose: () => void;
  onSaved: (updatedCase: CaseListItem) => void;
}

export default function EditCaseModal({
  caseItem,
  onClose,
  onSaved,
}: EditCaseModalProps) {
  const extendedCase = caseItem as ExtendedCaseItem;

  const [values, setValues] = useState<FormValues>(() => ({
    internalNumber: caseItem.internalNumber ?? "",
    title: caseItem.title ?? "",
    subject: extendedCase.subject ?? "",
    clientIds: normalizeIds(extendedCase.clientIds, caseItem.client?.id),
    categoryId: caseItem.category?.id ?? "",
    isUrgent: caseItem.isUrgent ?? false,
    opponentIds: normalizeIds(extendedCase.opponentIds),
    formedAt: getInitialDate(caseItem.formedAt ?? ""),
    description: caseItem.description ?? "",
    subRows:
      extendedCase.subRows && extendedCase.subRows.length > 0
        ? extendedCase.subRows
        : [
            {
              referenceNumber: "",
              archiveNumber: "",
            },
          ],
  }));

  const [errors, setErrors] = useState<FormErrors>({});

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  function handleChange<K extends FormField>(field: K, value: FormValues[K]) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // -----------------------------
  // Clients
  // -----------------------------

  function addClient() {
    setValues((prev) => ({
      ...prev,
      clientIds: [...prev.clientIds, ""],
    }));
  }

  function removeClient(index: number) {
    setValues((prev) => ({
      ...prev,
      clientIds: prev.clientIds.filter((_, i) => i !== index),
    }));
  }

  function updateClient(index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      clientIds: prev.clientIds.map((id, i) => (i === index ? value : id)),
    }));
  }

  // -----------------------------
  // Opponents
  // -----------------------------

  function addOpponent() {
    setValues((prev) => ({
      ...prev,
      opponentIds: [...prev.opponentIds, ""],
    }));
  }

  function removeOpponent(index: number) {
    setValues((prev) => ({
      ...prev,
      opponentIds: prev.opponentIds.filter((_, i) => i !== index),
    }));
  }

  function updateOpponent(index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      opponentIds: prev.opponentIds.map((id, i) => (i === index ? value : id)),
    }));
  }

  // -----------------------------
  // Sub rows
  // -----------------------------

  function addSubRow() {
    setValues((prev) => ({
      ...prev,
      subRows: [
        ...prev.subRows,
        {
          referenceNumber: "",
          archiveNumber: "",
        },
      ],
    }));
  }

  function removeSubRow(index: number) {
    setValues((prev) => ({
      ...prev,
      subRows: prev.subRows.filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  function updateSubRow(index: number, field: keyof SubCaseRow, value: string) {
    setValues((prev) => ({
      ...prev,
      subRows: prev.subRows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    }));
  }

  // -----------------------------
  // Submit
  // -----------------------------

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validate(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 600));

    const selectedCategory =
      mockCategories.find((category) => category.id === values.categoryId) ??
      caseItem.category;

    const updatedCase: CaseListItem = {
      ...caseItem,

      internalNumber: values.internalNumber.trim(),

      title: values.title.trim(),

      category: selectedCategory,

      client: {
        ...caseItem.client,
        id: values.clientIds[0] || caseItem.client.id,
        fullName:
          mockClients.find((client) => client.id === values.clientIds[0])
            ?.fullName ?? caseItem.client.fullName,
      },

      isUrgent: values.isUrgent,

      formedAt: values.formedAt,

      subject: values.subject.trim() || undefined,

      updatedAt: new Date().toISOString(),
    };

    /**
     * فیلدهای اضافه‌ای که در mock استفاده می‌کنیم
     * ولی ممکن است در CaseListItem اصلی تعریف نشده باشند.
     *
     * اینجا از یک cast کنترل‌شده استفاده می‌کنیم تا
     * ساختار اصلی CaseListItem دستکاری نشود.
     */
    const caseWithExtendedData = {
      ...updatedCase,
      subject: values.subject.trim() || null,
      clientIds: values.clientIds.filter(Boolean),
      opponentIds: values.opponentIds.filter(Boolean),
      subRows: values.subRows,
    } as CaseListItem;

    console.log("داده آماده ارسال به updateCase():", caseWithExtendedData);

    onSaved(caseWithExtendedData);

    setSubmitStatus("success");
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-4xl">
      <div className="p-6">
        {/* Header */}

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#262420]">ویرایش پرونده</h2>

            <p className="text-xs text-[#8C8A80] mt-1">
              اطلاعات پرونده را ویرایش و ذخیره کنید.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {values.isUrgent && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs">
                <Star size={13} fill="currentColor" />
                ضروری
              </span>
            )}
          </div>
        </div>

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
            {/* اطلاعات اصلی */}

            <div className={rowClass}>
              <div>
                <label className={labelClass}>شماره داخلی پرونده</label>

                <input
                  type="text"
                  value={values.internalNumber}
                  onChange={(event) =>
                    handleChange("internalNumber", event.target.value)
                  }
                  className={fieldClass}
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

                {errors.title && <p className={errorClass}>{errors.title}</p>}
              </div>
            </div>

            <div className={rowClass}>
              <div>
                <label className={labelClass}>موضوع</label>

                <input
                  type="text"
                  value={values.subject}
                  onChange={(event) =>
                    handleChange("subject", event.target.value)
                  }
                  className={fieldClass}
                  placeholder="مثلاً مطالبه مهریه"
                />
              </div>

              <div>
                <label className={labelClass}>دسته‌بندی</label>

                <select
                  value={values.categoryId}
                  onChange={(event) =>
                    handleChange("categoryId", event.target.value)
                  }
                  className={fieldClass}
                >
                  <option value="">انتخاب کنید</option>

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

            {/* موکل و طرف مقابل */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* موکل */}

              <div className="rounded-xl border border-[#E4E1D8] bg-[#FBFAF7] p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>موکل</label>

                  <span className="text-xs text-[#8C8A80]">
                    {values.clientIds.filter(Boolean).length} نفر
                  </span>
                </div>

                <div className="space-y-2">
                  {values.clientIds.map((clientId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={clientId}
                        onChange={(event) =>
                          updateClient(index, event.target.value)
                        }
                        className={`${fieldClass} flex-1`}
                      >
                        <option value="">انتخاب موکل</option>

                        {mockClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.fullName}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeClient(index)}
                        disabled={values.clientIds.length === 1}
                        className="h-10 px-3 rounded-lg border border-[#E4E1D8] text-[#A32D2D] text-xs hover:bg-[#FFF5F5] disabled:opacity-40"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addClient}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#A9762F] hover:text-[#946A2A]"
                >
                  <Plus size={16} />
                  افزودن موکل
                </button>

                {errors.clientIds && (
                  <p className={errorClass}>{errors.clientIds}</p>
                )}
              </div>

              {/* طرف مقابل */}

              <div className="rounded-xl border border-[#E4E1D8] bg-[#FBFAF7] p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>طرف مقابل</label>

                  <span className="text-xs text-[#8C8A80]">
                    {values.opponentIds.filter(Boolean).length} نفر
                  </span>
                </div>

                <div className="space-y-2">
                  {values.opponentIds.map((opponentId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={opponentId}
                        onChange={(event) =>
                          updateOpponent(index, event.target.value)
                        }
                        className={`${fieldClass} flex-1`}
                      >
                        <option value="">انتخاب طرف مقابل</option>

                        {mockClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.fullName}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeOpponent(index)}
                        disabled={values.opponentIds.length === 1}
                        className="h-10 px-3 rounded-lg border border-[#E4E1D8] text-[#A32D2D] text-xs hover:bg-[#FFF5F5] disabled:opacity-40"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addOpponent}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#A9762F] hover:text-[#946A2A]"
                >
                  <Plus size={16} />
                  افزودن طرف مقابل
                </button>
              </div>
            </div>

            {/* ردیف‌های فرعی */}

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass}>ردیف‌های فرعی پرونده</label>

                <span className="text-xs text-[#8C8A80]">
                  {values.subRows.length} ردیف
                </span>
              </div>

              <div className="space-y-2">
                {values.subRows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[0.7fr_1fr_1fr_auto] gap-3 items-end rounded-lg border border-[#E4E1D8] bg-white p-3"
                  >
                    <div>
                      <div className="h-10 flex items-center px-3 rounded-lg bg-[#F7F4EC] text-sm font-semibold text-[#262420]">
                        ردیف فرعی {index + 1}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={row.referenceNumber}
                      onChange={(event) =>
                        updateSubRow(
                          index,
                          "referenceNumber",
                          event.target.value,
                        )
                      }
                      placeholder="شماره مرجع"
                      className={fieldClass}
                    />

                    <input
                      type="text"
                      value={row.archiveNumber}
                      onChange={(event) =>
                        updateSubRow(index, "archiveNumber", event.target.value)
                      }
                      placeholder="شماره بایگانی"
                      className={fieldClass}
                    />

                    <button
                      type="button"
                      onClick={() => removeSubRow(index)}
                      disabled={values.subRows.length === 1}
                      className="h-10 px-3 rounded-lg border border-[#E4E1D8] text-[#A32D2D] text-xs hover:bg-[#FFF5F5] disabled:opacity-40"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-start mt-3">
                <button
                  type="button"
                  onClick={addSubRow}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E4E1D8] bg-white text-[#A9762F] text-sm font-medium hover:bg-[#F7F4EC]"
                >
                  <Plus size={16} />
                  افزودن ردیف فرعی
                </button>
              </div>
            </div>

            {/* تاریخ تشکیل + فوریت */}

            <div className={rowClass}>
              <div>
                <label className={labelClass}>تاریخ تشکیل پرونده</label>

                <div className="relative">
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={values.formedAt}
                    onChange={(date) =>
                      handleChange("formedAt", date?.format("YYYY/MM/DD") ?? "")
                    }
                    calendarPosition="bottom-right"
                    inputClass={`${fieldClass} pl-10 hover:border-[#C89A5A] focus:ring-4 focus:ring-[#A9762F]/10`}
                  />

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8A80] pointer-events-none"
                  />
                </div>

                {errors.formedAt && (
                  <p className={errorClass}>{errors.formedAt}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-isUrgent"
                  className="h-full min-h-19 flex items-center justify-between gap-4 rounded-lg border border-[#E4E1D8] bg-[#FBFAF7] px-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        values.isUrgent
                          ? "bg-[#FFF1F1] text-[#C0392B]"
                          : "bg-[#F7F4EC] text-[#8C8A80]"
                      }`}
                    >
                      <Star
                        size={20}
                        fill={values.isUrgent ? "currentColor" : "none"}
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-[#262420]">
                        پرونده ضروری
                      </p>

                      <p className="text-xs text-[#8C8A80] mt-1">
                        این پرونده در لیست پرونده‌های ضروری نمایش داده می‌شود.
                      </p>
                    </div>
                  </div>

                  <input
                    id="edit-isUrgent"
                    type="checkbox"
                    checked={values.isUrgent}
                    onChange={(event) =>
                      handleChange("isUrgent", event.target.checked)
                    }
                    className="h-5 w-5 accent-red-600"
                  />
                </label>
              </div>
            </div>

            {/* توضیحات */}

            <div>
              <label className={labelClass}>توضیحات</label>

              <textarea
                value={values.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={4}
                className={`${fieldClass} resize-none`}
              />
            </div>

            {/* دکمه‌ها */}

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
                className="px-6 py-2.5 bg-[#095ef1] text-white rounded-lg text-sm font-medium hover:bg-[#074fc9] disabled:opacity-50 transition-colors"
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
