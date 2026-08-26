"use client";

import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useState } from "react";
import { X, Star, CalendarDays, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { mockClients, mockCategories } from "../../../../mocks/cases.mock";
import type { CaseListItem } from "../../../../mocks/cases.types";

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
  opponentNames: string[];
  formedAt: string;
  description: string;
  subRows: SubCaseRow[];
}

const today = new DateObject({
  calendar: persian,
  locale: persian_fa,
}).format("YYYY/MM/DD");

const initialValues: FormValues = {
  internalNumber: "",
  title: "",
  subject: "",
  clientIds: [""],
  categoryId: "",
  isUrgent: false,
  opponentNames: [""],
  formedAt: today,
  description: "",
  subRows: [{ referenceNumber: "", archiveNumber: "" }],
};

const internalNumberPattern = /^[\u0600-\u06FFa-zA-Z0-9\s-/]+$/;

type FormErrors = Partial<Record<string, string>>;

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

  if (!values.title.trim()) errors.title = "عنوان پرونده الزامی است.";
  if (!values.clientIds.some(Boolean))
    errors.clientIds = "انتخاب حداقل یک موکل الزامی است.";
  if (!values.categoryId) errors.categoryId = "انتخاب دسته‌بندی الزامی است.";
  if (!values.formedAt) errors.formedAt = "تاریخ تشکیل پرونده الزامی است.";

  return errors;
}

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";
const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

function RequiredLabel({ text }: { text: string }) {
  return (
    <label className={labelClass}>
      {text} <span className="text-[#A32D2D]">*</span>
    </label>
  );
}

interface NewCaseModalProps {
  onClose: () => void;
  onSaved: (newCase: CaseListItem) => void;
}

export default function NewCaseModal({ onClose, onSaved }: NewCaseModalProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  function handleChange<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[String(field)]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[String(field)];
        return next;
      });
    }
  }

  function addClient() {
    setValues((prev) => ({ ...prev, clientIds: [...prev.clientIds, ""] }));
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

  function addOpponent() {
    setValues((prev) => ({
      ...prev,
      opponentNames: [...prev.opponentNames, ""],
    }));
  }

  function removeOpponent(index: number) {
    setValues((prev) => ({
      ...prev,
      opponentNames: prev.opponentNames.filter((_, i) => i !== index),
    }));
  }

  function updateOpponent(index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      opponentNames: prev.opponentNames.map((name, i) =>
        i === index ? value : name,
      ),
    }));
  }

  function addSubRow() {
    setValues((prev) => ({
      ...prev,
      subRows: [...prev.subRows, { referenceNumber: "", archiveNumber: "" }],
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
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const selectedClient = mockClients.find(
      (client) => client.id === values.clientIds.find(Boolean),
    );
    const selectedCategory = mockCategories.find(
      (category) => category.id === values.categoryId,
    );

    if (!selectedClient || !selectedCategory) {
      setSubmitStatus("idle");
      return;
    }

    const newCase: CaseListItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `case-${Date.now()}`,
      internalNumber: values.internalNumber.trim(),
      title: values.title.trim(),
      isUrgent: values.isUrgent,
      client: selectedClient,
      category: selectedCategory,
      status: "ACTIVE",
      priority: values.isUrgent ? "URGENT" : "NORMAL",
      opponentName:
        values.opponentNames.find((name) => name.trim())?.trim() || null,
      subject: values.subject.trim() || undefined,
      formedAt: values.formedAt,
      nextSessionAt: null,
      description: values.description.trim() || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaved(newCase);
    setSubmitStatus("success");
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-3xl">
      <div>
        <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2] sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-[#262420]">ثبت پرونده جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#8C8A80] hover:bg-[#F7F4EC]"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {submitStatus === "success" ? (
            <div>
              <div className="p-4 bg-[#E7F1EB] text-[#2F6B4F] rounded-lg mb-4 text-sm">
                پرونده با شماره داخلی «{values.internalNumber}» با موفقیت ثبت شد.
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A]"
              >
                بستن
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={rowClass}>
                <div>
                  <RequiredLabel text="شماره داخلی پرونده" />
                  <input
                    type="text"
                    value={values.internalNumber}
                    onChange={(e) =>
                      handleChange("internalNumber", e.target.value)
                    }
                    placeholder="مثلاً 1405-001"
                    className={`${fieldClass} font-mono`}
                  />
                  {errors.internalNumber && (
                    <p className={errorClass}>{errors.internalNumber}</p>
                  )}
                </div>
                <div>
                  <RequiredLabel text="عنوان پرونده" />
                  <input
                    type="text"
                    value={values.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={fieldClass}
                  />
                  {errors.title && (
                    <p className={errorClass}>{errors.title}</p>
                  )}
                </div>
              </div>

              <div className={rowClass}>
                <div>
                  <label className={labelClass}>موضوع</label>
                  <input
                    type="text"
                    value={values.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={fieldClass}
                    placeholder="مثلاً مطالبه مهریه"
                  />
                </div>
                <div>
                  <RequiredLabel text="دسته‌بندی" />
                  <select
                    value={values.categoryId}
                    onChange={(e) =>
                      handleChange("categoryId", e.target.value)
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#E4E1D8] bg-[#FBFAF7] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <RequiredLabel text="موکل" />
                    <span className="text-xs text-[#8C8A80]">
                      {values.clientIds.filter(Boolean).length} نفر
                    </span>
                  </div>
                  <div className="space-y-2">
                    {values.clientIds.map((clientId, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={clientId}
                          onChange={(e) => updateClient(index, e.target.value)}
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
                    <Plus size={16} /> افزودن موکل
                  </button>
                  {errors.clientIds && (
                    <p className={errorClass}>{errors.clientIds}</p>
                  )}
                </div>

                <div className="rounded-xl border border-[#E4E1D8] bg-[#FBFAF7] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelClass}>طرف مقابل</label>
                    <span className="text-xs text-[#8C8A80]">
                      {values.opponentNames.filter((name) => name.trim()).length}{" "}
                      نفر
                    </span>
                  </div>
                  <div className="space-y-2">
                    {values.opponentNames.map((opponentName, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opponentName}
                          onChange={(e) =>
                            updateOpponent(index, e.target.value)
                          }
                          placeholder="نام طرف مقابل را وارد کنید"
                          className={`${fieldClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOpponent(index)}
                          disabled={values.opponentNames.length === 1}
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
                    <Plus size={16} /> افزودن طرف مقابل
                  </button>
                </div>
              </div>

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
                        onChange={(e) =>
                          updateSubRow(index, "referenceNumber", e.target.value)
                        }
                        placeholder="شماره مرجع"
                        className={fieldClass}
                      />
                      <input
                        type="text"
                        value={row.archiveNumber}
                        onChange={(e) =>
                          updateSubRow(index, "archiveNumber", e.target.value)
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
                    <Plus size={16} /> افزودن ردیف فرعی
                  </button>
                </div>
              </div>

              <div className={rowClass}>
                <div>
                  <RequiredLabel text="تاریخ تشکیل پرونده" />
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
                    htmlFor="isUrgent"
                    className="h-full min-h-[76px] flex items-center justify-between gap-4 rounded-lg border border-[#E4E1D8] bg-[#FBFAF7] px-4 cursor-pointer"
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
                      id="isUrgent"
                      type="checkbox"
                      checked={values.isUrgent}
                      onChange={(e) =>
                        handleChange("isUrgent", e.target.checked)
                      }
                      className="h-5 w-5 accent-red-600"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>توضیحات</label>
                <textarea
                  value={values.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className={`${fieldClass} resize-none`}
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
                  {submitStatus === "submitting" ? "در حال ثبت..." : "ثبت پرونده"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
