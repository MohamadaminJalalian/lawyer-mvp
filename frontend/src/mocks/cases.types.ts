// ==========================================================
// Type های ماژول «پرونده‌ها» — بر اساس سند قرارداد نهایی FE4
// ==========================================================
export interface DocumentFile {
  id: string;
  name: string;
  title: string;
  type: "pdf" | "image" | "word" | "excel" | "other";
  url: string;
  size: number; // بایت
  uploadedAt: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null; // null یعنی فولدر ریشه
  createdAt: string;
}

export interface CaseDocuments {
  caseId: string;
  files: DocumentFile[];
}

// ---------- مقادیر ثابت (Enum-like Types) ----------

// وضعیت پرونده — طبق تصمیم نهایی تیم فقط همین ۲ مقدار مجازه
export type CaseStatus = "ACTIVE" | "CLOSED";

// اولویت پرونده
export type CasePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

// ---------- اشیاء کوچیک‌تر که داخل پرونده استفاده می‌شن ----------

// خلاصه اطلاعات موکل (همونی که تو Select فرم یا ستون جدول نشون داده می‌شه)
export interface ClientSummary {
  id: string;
  fullName: string;
  nationalCode: string; // طبق تصمیم نهایی: کامل، نه ماسک‌شده
  isActive: boolean;
}

// خلاصه اطلاعات دسته‌بندی
export interface CategorySummary {
  id: string;
  name: string;
}

// ---------- شکل کامل یک پرونده (چیزی که از GET برمی‌گرده) ----------

export interface CaseListItem {
  id: string;
  internalNumber: string;
  title: string;
  isUrgent: boolean; // فیلد موقت — بعداً از جزئیات عملیات پرونده محاسبه می‌شه
  client: ClientSummary;
  category: CategorySummary;

  status: CaseStatus;
  priority: CasePriority;
  subject?: string;
  // اطلاعات قضایی — همه اختیاری
  opponentName?: string | null;

  // زمان‌بندی — تاریخ‌ها همیشه رشته ISO از سرور می‌آن (مثل "2026-04-04")
  formedAt: string;
  nextSessionAt?: string | null;

  description?: string | null;

  createdAt: string;
  updatedAt: string;
}

// ---------- شکل داده‌ای که موقع «ثبت پرونده جدید» می‌فرستیم ----------

export interface CreateCaseRequest {
  internalNumber: string; // دستی و اجباری
  title: string;
  clientId: string;
  categoryId: string;
  status?: CaseStatus; // پیش‌فرض: ACTIVE
  priority?: CasePriority; // پیش‌فرض: NORMAL

  opponentName?: string;

  formedAt: string; // اجباری، پیش‌فرض تاریخ امروز
  nextSessionAt?: string; // نباید قبل از formedAt باشه

  description?: string;
}

// ---------- شکل داده‌ای که موقع «ویرایش پرونده» می‌فرستیم ----------
// نکته: همه فیلدها اختیاری‌ان چون فقط چیزی که تغییر کرده رو می‌فرستیم (Partial Update)
// و توجه کن که clientId اینجا نیست، چون موکل بعد از ثبت قابل تغییر نیست

export interface UpdateCaseRequest {
  internalNumber?: string;
  title?: string;
  categoryId?: string;
  status?: CaseStatus;
  priority?: CasePriority;

  opponentName?: string;

  formedAt?: string;
  nextSessionAt?: string;

  description?: string;
}

// ---------- ساختار پاسخ صفحه‌بندی‌شده (برای لیست پرونده‌ها) ----------

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ---------- ساختار خطای برگشتی از API ----------

export interface ApiError {
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}
