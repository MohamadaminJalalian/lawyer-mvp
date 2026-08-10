"use client";

// مسیر این فایل: app/cases/[id]/edit/page.tsx

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockCases, mockCategories } from "../../../../mocks/cases.mock";
import type { CasePriority } from "../../../../mocks/cases.types";

const CURRENT_USER_ROLE: "ADMIN" | "SECRETARY" = "ADMIN";

interface FormValues {
  internalNumber: string;
  title: string;
  categoryId: string;
  priority: CasePriority;
  opponentName: string;
  formedAt: string;
  nextSessionAt: string;
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

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";

export default function EditCasePage() {
  const params = useParams();
  const caseId = params.id as string;

  const existingCase = mockCases.find((item) => item.id === caseId);

  const [values, setValues] = useState<FormValues>(() => {
    if (!existingCase) {
      return {
        internalNumber: "",
        title: "",
        categoryId: "",
        priority: "NORMAL",
        opponentName: "",
        formedAt: "",
        nextSessionAt: "",
        description: "",
      };
    }
    return {
      internalNumber: existingCase.internalNumber,
      title: existingCase.title,
      categoryId: existingCase.category.id,
      priority: existingCase.priority,
      opponentName: existingCase.opponentName ?? "",
      formedAt: existingCase.formedAt,
      nextSessionAt: existingCase.nextSessionAt ?? "",
      description: existingCase.description ?? "",
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<
    "idle" | "archiving" | "done"
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
    console.log("داده آماده ارسال به updateCase():", caseId, values);
    setSubmitStatus("success");
  }

  async function handleArchiveConfirm() {
    setArchiveStatus("archiving");
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("درخواست آرشیو برای پرونده:", caseId);
    setArchiveStatus("done");
    setShowArchiveModal(false);
  }

  if (!existingCase) {
    return (
      <div>
        <p className="text-[#A32D2D] text-sm">پرونده‌ای با این شناسه پیدا نشد.</p>
        <Link
          href="/cases"
          className="text-[#A9762F] hover:underline mt-4 inline-block text-sm"
        >
          بازگشت به لیست پرونده‌ها
        </Link>
      </div>
    );
  }

 
  if (submitStatus === "success") {
    return (
      <div className="max-w-2xl">
        <div className="p-4 bg-[#E7F1EB] text-[#2F6B4F] rounded-lg mb-4 text-sm">
          تغییرات پرونده «{values.internalNumber}» با موفقیت ذخیره شد.
        </div>
        <Link href="/cases" className="text-[#A9762F] hover:underline text-sm">
          بازگشت به لیست پرونده‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-[#8C8A80] mb-0.5">
            داشبورد / پرونده‌ها / ویرایش
          </div>
          <h1 className="text-xl font-bold text-[#262420]">ویرایش پرونده</h1>
        </div>

        {CURRENT_USER_ROLE === "ADMIN" && (
          <button
            onClick={() => setShowArchiveModal(true)}
            className="px-4 py-2 bg-white border border-[#E4A3A3] text-[#A32D2D] rounded-lg text-sm hover:bg-[#FCEBEB] transition-colors"
          >
            بایگانی پرونده
          </button>
        )}
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
            onChange={(event) => handleChange("title", event.target.value)}
            className={fieldClass}
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div>
          <label className={labelClass}>موکل</label>
          <div className="w-full p-2 border border-[#EDEBE2] rounded-lg bg-[#F7F5F0] text-[#6B6A63] text-sm">
            {existingCase.client.fullName}
          </div>
          <p className="text-sm text-[#8C8A80] mt-1">
            موکل پرونده پس از ثبت قابل تغییر نیست.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className={labelClass}>اولویت</label>
            <select
              value={values.priority}
              onChange={(event) =>
                handleChange("priority", event.target.value as CasePriority)
              }
              className={fieldClass}
            >
              <option value="LOW">کم</option>
              <option value="NORMAL">عادی</option>
              <option value="HIGH">بالا</option>
              <option value="URGENT">فوری</option>
            </select>
          </div>
        </div>

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
          {submitStatus === "submitting" ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>

      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full">
            <p className="mb-4 font-medium text-[#262420] text-sm">
              آیا از بایگانی پرونده زیر مطمئن هستید؟
            </p>
            <div className="bg-[#F7F5F0] rounded-lg p-3 mb-4 space-y-1">
              <p className="text-sm text-[#6B6A63]">
                شماره داخلی:{" "}
                <span className="font-mono">
                  {existingCase.internalNumber}
                </span>
              </p>
              <p className="text-sm text-[#6B6A63]">
                عنوان: {existingCase.title}
              </p>
              <p className="text-sm text-[#6B6A63]">
                موکل: {existingCase.client.fullName}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
              >
                انصراف
              </button>
              <button
                onClick={handleArchiveConfirm}
                disabled={archiveStatus === "archiving"}
                className="px-4 py-2 bg-[#A32D2D] text-white rounded-lg text-sm disabled:opacity-50"
              >
                {archiveStatus === "archiving"
                  ? "در حال بایگانی..."
                  : "بایگانی پرونده"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
