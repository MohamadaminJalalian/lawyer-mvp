"use client";

// مسیر این فایل: app/cases/new/page.tsx

import { useState } from "react";
import { mockClients, mockCategories } from "../../../../mocks/cases.mock";
import type { CasePriority } from "../../../../mocks/cases.types";

interface FormValues {
  internalNumber: string;
  title: string;
  clientId: string;
  categoryId: string;
  priority: CasePriority;
  opponentName: string;
  formedAt: string;
  nextSessionAt: string;
  description: string;
}

const today = new Date().toISOString().split("T")[0];

const initialValues: FormValues = {
  internalNumber: "",
  title: "",
  clientId: "",
  categoryId: "",
  priority: "NORMAL",
  opponentName: "",
  formedAt: today,
  nextSessionAt: "",
  description: "",
};

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

  if (!values.clientId) {
    errors.clientId = "انتخاب موکل الزامی است.";
  }

  if (!values.categoryId) {
    errors.categoryId = "انتخاب دسته‌بندی الزامی است.";
  }

  if (!values.formedAt) {
    errors.formedAt = "تاریخ تشکیل پرونده الزامی است.";
  }

  if (
    values.nextSessionAt &&
    values.formedAt &&
    values.nextSessionAt < values.formedAt
  ) {
    errors.nextSessionAt =
      "تاریخ جلسه بعدی نمی‌تواند قبل از تاریخ تشکیل پرونده باشد.";
  }

  return errors;
}

// استایل مشترک همه Input ها، تا هماهنگ با پالت جدید باشن
const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";

export default function NewCasePage() {
  const [values, setValues] = useState<FormValues>(initialValues);
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
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("داده آماده ارسال به createCase():", values);
    setSubmitStatus("success");
  }

  if (submitStatus === "success") {
    return (
      <div className="max-w-2xl">
        <div className="p-4 bg-[#E7F1EB] text-[#2F6B4F] rounded-lg mb-4 text-sm">
          پرونده با شماره داخلی «{values.internalNumber}» با موفقیت ثبت شد.
        </div>
        <button
          onClick={() => {
            setValues(initialValues);
            setErrors({});
            setSubmitStatus("idle");
          }}
          className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
        >
          ثبت پرونده جدید دیگر
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="text-xs text-[#8C8A80] mb-0.5">
          داشبورد / پرونده‌ها / پرونده جدید
        </div>
        <h1 className="text-xl font-bold text-[#262420]">ثبت پرونده جدید</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E4E1D8] rounded-xl p-6 space-y-5"
      >
        <div>
          <label className={labelClass}>شماره داخلی پرونده</label>
          <input
            type="text"
            value={values.internalNumber}
            onChange={(event) =>
              handleChange("internalNumber", event.target.value)
            }
            placeholder="مثلاً 1405-001"
            className={`${fieldClass} font-mono`}
          />
          <p className="text-sm text-[#8C8A80] mt-1">
            شماره داخلی مورد استفاده در دفتر را وارد کنید.
          </p>
          {errors.internalNumber && (
            <p className={errorClass}>{errors.internalNumber}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>عنوان پرونده</label>
          <input
            type="text"
            value={values.title}
            onChange={(event) => handleChange("title", event.target.value)}
            className={fieldClass}
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>موکل</label>
            <select
              value={values.clientId}
              onChange={(event) =>
                handleChange("clientId", event.target.value)
              }
              className={fieldClass}
            >
              <option value="">انتخاب کنید</option>
              {mockClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.fullName}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className={errorClass}>{errors.clientId}</p>
            )}
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

      

        {/* اطلاعات قضایی، تو یه بخش جدا با خط جداکننده */}
        <div className="border-t border-[#EDEBE2] pt-5 space-y-5">
          <p className="text-xs font-medium text-[#8C8A80]">اطلاعات قضایی</p>

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

        {/* تاریخ‌ها */}
        <div className="border-t border-[#EDEBE2] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>تاریخ تشکیل پرونده</label>
            <input
              type="date"
              value={values.formedAt}
              onChange={(event) =>
                handleChange("formedAt", event.target.value)
              }
              className={fieldClass}
            />
            {errors.formedAt && (
              <p className={errorClass}>{errors.formedAt}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>تاریخ جلسه بعدی</label>
            <input
              type="date"
              value={values.nextSessionAt}
              onChange={(event) =>
                handleChange("nextSessionAt", event.target.value)
              }
              className={fieldClass}
            />
            {errors.nextSessionAt && (
              <p className={errorClass}>{errors.nextSessionAt}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>توضیحات</label>
          <textarea
            value={values.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            rows={4}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitStatus === "submitting"}
          className="px-6 py-2.5 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] disabled:opacity-50 transition-colors"
        >
          {submitStatus === "submitting" ? "در حال ثبت..." : "ثبت پرونده"}
        </button>
      </form>
    </div>
  );
}
