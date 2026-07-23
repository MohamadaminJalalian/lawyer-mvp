"use client";

// مسیر این فایل: app/cases/_components/EditCaseModal.tsx

import { useState } from "react";
import { X } from "lucide-react";
import Modal from "./Modal";
import { mockCategories } from "../../../mocks/cases.mock";
import type { CaseListItem, CasePriority } from "../../../types/cases.types";

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
const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

interface EditCaseModalProps {
  // پرونده‌ای که داریم ویرایشش می‌کنیم — از بیرون (صفحه لیست) بهمون داده می‌شه
  caseItem: CaseListItem;
  onClose: () => void;
  // وقتی ذخیره موفق شد، نسخه آپدیت‌شده پرونده رو به والد پس می‌دیم
  onSaved: (updated: CaseListItem) => void;
  // وقتی بایگانی موفق شد، فقط شناسه پرونده رو پس می‌دیم
  onArchived: (caseId: string) => void;
}

export default function EditCaseModal({
  caseItem,
  onClose,
  onSaved,
  onArchived,
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
    nextSessionAt: caseItem.nextSessionAt ?? "",
    description: caseItem.description ?? "",
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  // مودال تأیید بایگانی، این‌بار به‌جای صفحه جدا، همین‌جا تودرتو باز می‌شه
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<"idle" | "archiving">(
    "idle"
  );

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
      nextSessionAt: values.nextSessionAt || null,
      description: values.description || null,
      updatedAt: new Date().toISOString(),
    };

    onSaved(updatedCase);
    setSubmitStatus("success");
  }

  async function handleArchiveConfirm() {
    setArchiveStatus("archiving");
    // روز سوم این خط با فراخوانی واقعی archiveCase() جایگزین می‌شه
    await new Promise((resolve) => setTimeout(resolve, 500));
    onArchived(caseItem.id);
    setArchiveStatus("idle");
    setShowArchiveConfirm(false);
    onClose();
  }

  // اگه پرونده از قبل بایگانی‌شده، اصلاً فرم رو نشون نده
  if (caseItem.status === "ARCHIVED") {
    return (
      <Modal onClose={onClose} maxWidthClass="max-w-md">
        <div className="p-6">
          <div className="p-4 bg-[#F3EAE3] text-[#954C33] rounded-lg mb-4 text-sm">
            این پرونده بایگانی شده و دیگر قابل ویرایش نیست.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            بستن
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2] sticky top-0 bg-white">
        <h2 className="font-bold text-[#262420]">ویرایش پرونده</h2>
        <div className="flex items-center gap-3">
          {CURRENT_USER_ROLE === "ADMIN" && submitStatus !== "success" && (
            <button
              type="button"
              onClick={() => setShowArchiveConfirm(true)}
              className="px-3 py-1.5 bg-white border border-[#E4A3A3] text-[#A32D2D] rounded-lg text-xs hover:bg-[#FCEBEB] transition-colors"
            >
              بایگانی
            </button>
          )}
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

              <div>
                <label className={labelClass}>اولویت</label>
                <select
                  value={values.priority}
                  onChange={(event) =>
                    handleChange(
                      "priority",
                      event.target.value as CasePriority
                    )
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

            <div className={rowClass}>
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

      {/* مودال تأیید بایگانی — تودرتو، روی همین مودال باز می‌شه */}
      {showArchiveConfirm && (
        <Modal
          onClose={() => setShowArchiveConfirm(false)}
          maxWidthClass="max-w-sm"
        >
          <div className="p-6">
            <p className="mb-4 font-medium text-[#262420] text-sm">
              آیا از بایگانی پرونده زیر مطمئن هستید؟
            </p>
            <div className="bg-[#F7F5F0] rounded-lg p-3 mb-4 space-y-1">
              <p className="text-sm text-[#6B6A63]">
                شماره داخلی:{" "}
                <span className="font-mono">{caseItem.internalNumber}</span>
              </p>
              <p className="text-sm text-[#6B6A63]">عنوان: {caseItem.title}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
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
        </Modal>
      )}
    </Modal>
  );
}
