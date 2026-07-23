"use client";

// مسیر این فایل: app/cases/_components/NewCaseModal.tsx
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";
import Modal from "./Modal";
import { mockClients, mockCategories } from "../../../mocks/cases.mock";
import type { CasePriority } from "../../../types/cases.types";

interface FormValues {
  internalNumber: string;
  title: string;
  clientId: string;
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

const today = new DateObject({
  calendar: persian,
  locale: persian_fa,
}).format("YYYY/MM/DD");

const initialValues: FormValues = {
  internalNumber: "",
  title: "",
  clientId: "",
  categoryId: "",
  priority: "NORMAL",
  courtCaseNumber: "",
  courtName: "",
  branch: "",
  opponentName: "",
  formedAt: today,
  nextSessionAt: "",
  description: "",
};

const internalNumberPattern = /^[\u0600-\u06FFa-zA-Z0-9\s\-\/]+$/;
// فرمت‌های مجاز برای ضمائم پرونده
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
];

function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex === -1 ? "" : fileName.slice(dotIndex).toLowerCase();
}

function isAllowedFile(file: File): boolean {
  return ALLOWED_EXTENSIONS.includes(getExtension(file.name));
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
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

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";
const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

// این کامپوننت یه Prop به اسم onClose می‌گیره — یعنی تابعی که والدش (صفحه لیست) بهش می‌ده
// تا وقتی لازم شد (دکمه انصراف، یا بعد از ثبت موفق)، مودال رو ببنده
interface NewCaseModalProps {
  onClose: () => void;
}

export default function NewCaseModal({ onClose }: NewCaseModalProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState("");

  function handleChange<K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }
  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    const validFiles: File[] = [];
    const rejectedNames: string[] = [];

    selectedFiles.forEach((file) => {
      if (isAllowedFile(file)) {
        validFiles.push(file);
      } else {
        rejectedNames.push(file.name);
      }
    });

    setAttachmentError(
      rejectedNames.length > 0
        ? `این فایل‌ها مجاز نیستند و اضافه نشدند: ${rejectedNames.join("، ")}`
        : ""
    );

    setAttachments((prev) => [...prev, ...validFiles]);

    // ورودی رو خالی می‌کنیم تا اگه دوباره همون فایل رو انتخاب کرد، onChange باز اجرا بشه
    event.target.value = "";
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitStatus("submitting");
    // روز سوم این خط با فراخوانی واقعی createCase() جایگزین می‌شه
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    console.log("داده آماده ارسال به createCase():", values);
    setSubmitStatus("success");
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-2xl">
      <div>
        <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2] sticky top-0 bg-white">
          <h2 className="font-bold text-[#262420]">ثبت پرونده جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C8A80] hover:text-[#262420]"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {submitStatus === "success" ? (
            <div>
              <div className="p-4 bg-[#E7F1EB] text-[#2F6B4F] rounded-lg mb-4 text-sm">
                پرونده با شماره داخلی «{values.internalNumber}» با موفقیت ثبت
                شد.
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
                    placeholder="مثلاً 1405-001"
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

              <div className={rowClass}>
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

              <div className={rowClass}>
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
                  <label className={labelClass}>تاریخ تشکیل پرونده</label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={values.formedAt}
                    onChange={(date) =>
                      handleChange(
                        "formedAt",
                        date?.format("YYYY/MM/DD") ?? ""
                      )
                    }
                    calendarPosition="bottom-right"
                    inputClass={fieldClass}
                  />
                  {errors.formedAt && (
                    <p className={errorClass}>{errors.formedAt}</p>
                  )}
                </div>
              </div>

              <div className={rowClass}>
                <div>
                  <label className={labelClass}>تاریخ جلسه بعدی</label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={values.nextSessionAt}
                    onChange={(date) =>
                      handleChange(
                        "nextSessionAt",
                        date?.format("YYYY/MM/DD") ?? ""
                      )
                    }
                    calendarPosition="bottom-right"
                    inputClass={fieldClass}
                  />
                  {errors.nextSessionAt && (
                    <p className={errorClass}>{errors.nextSessionAt}</p>
                  )}
                </div>
                <div />
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
              <div>
                <label className={labelClass}>ضمائم پرونده</label>

                <label
                  htmlFor="case-attachments"
                  className="flex items-center justify-center gap-2 border border-dashed border-[#E4E1D8] rounded-lg p-4 text-sm text-[#8C8A80] cursor-pointer hover:border-[#A9762F] hover:text-[#A9762F] transition-colors"
                >
                  <Upload size={18} />
                  برای انتخاب فایل کلیک کنید
                </label>
                <input
                  id="case-attachments"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFilesSelected}
                  className="hidden"
                />

                <p className="text-sm text-[#8C8A80] mt-1">
                  فرمت‌های مجاز: PDF، Word، Excel، JPG، PNG
                </p>

                {attachmentError && (
                  <p className={errorClass}>{attachmentError}</p>
                )}

                {attachments.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 bg-[#F7F5F0] rounded-lg px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText
                            size={16}
                            className="text-[#8A5D1F] shrink-0"
                          />
                          <span className="truncate text-[#262420]">
                            {file.name}
                          </span>
                          <span className="text-[#8C8A80] shrink-0">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-[#8C8A80] hover:text-[#A32D2D] shrink-0"
                          aria-label="حذف فایل"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
                  className="px-6 py-2.5 bg-[#095ef1] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] disabled:opacity-50 transition-colors"
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
