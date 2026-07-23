"use client";

// مسیر این فایل: app/cases/page.tsx
import { formatPersianDate } from "../../lib/utils/date";
import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  CheckCircle2,
  Archive,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Star ,
} from "lucide-react";
import NewCaseModal from "./_components/NewCaseModal";
import EditCaseModal from "./_components/EditCaseModal";
import FilterModal, { type UrgencyOption } from "./_components/FilterModal";
import Modal from "./_components/Modal";
import { mockCasesResponse, mockCategories } from "../../mocks/cases.mock";
import type {
  CaseListItem,
  CaseStatus,

} from "../../types/cases.types";

const statusLabels: Record<CaseStatus, string> = {
  ACTIVE: "فعال",
  CLOSED: "مختومه",
  ARCHIVED: "بایگانی‌شده",
};

const statusStyles: Record<CaseStatus, string> = {
  ACTIVE: "bg-[#E7F1EB] text-[#2F6B4F]",
  CLOSED: "bg-[#F1EFE6] text-[#6B6A63]",
  ARCHIVED: "bg-[#F3EAE3] text-[#954C33]",
};


const PAGE_SIZE = 2;

// فیلدهایی که اجازه مرتب‌سازی روشون رو داریم
type SortField =
  | "internalNumber"
  | "title"
  | "client"
  | "category"
  | "status"
  ;

// چون اولویت یه Enum‌ه نه عدد، خودمون یه ترتیب منطقی براش تعریف می‌کنیم


function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 bg-[#EDEBE2] rounded animate-pulse ${className}`} />
  );
}

// یه ردیف ساده برای نمایش «برچسب: مقدار» تو مودال جزئیات
function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F1EFE6] pb-2">
      <span className="text-[#8C8A80]">{label}</span>
      <span className={`text-[#262420] ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// نوع عملیاتی که ممکنه از ستون عملیات صدا زده بشه و نیاز به تأیید داره
// نوع عملیاتی که ممکنه از ستون عملیات صدا زده بشه و نیاز به تأیید داره
interface ConfirmAction {
  type: "archive" | "close" | "toggle-urgent";
  caseItem: CaseListItem;
}

export default function CasesListPage() {
  const [allCases, setAllCases] = useState<CaseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedUrgencies, setSelectedUrgencies] = useState<UrgencyOption[]>([
    "URGENT",
    "NOT_URGENT",
  ]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    mockCategories.map((category) => category.id)
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // مودال جزئیات پرونده — اگه مقداری داشته باشه یعنی بازه
  const [detailsCase, setDetailsCase] = useState<CaseListItem | null>(null);

  // مودال تأیید برای بایگانی یا مختومه‌کردن
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null
  );
  const [confirmStatus, setConfirmStatus] = useState<"idle" | "processing">(
    "idle"
  );

  // مودال ثبت پرونده جدید
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // پرونده‌ای که الان تو مودال ویرایش بازه؛ null یعنی هیچ‌کدوم باز نیست
  const [editingCase, setEditingCase] = useState<CaseListItem | null>(null);

  // مرتب‌سازی جدول
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // پیام کوتاه و موقت (Toast) که بعد از یه عملیات موفق نشون داده می‌شه
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllCases(mockCasesResponse.items);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredCases = allCases.filter((caseItem) => {
    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      caseItem.internalNumber.toLowerCase().includes(term) ||
      caseItem.title.toLowerCase().includes(term) ||
      caseItem.client.fullName.toLowerCase().includes(term) ||
      (caseItem.courtName ?? "").toLowerCase().includes(term);

    // مقایسه رشته‌ای چون فرمت تاریخ‌ها "YYYY-MM-DD"ه، همون ترتیب زمانی رو هم می‌ده
    const matchesDate =
      (!dateFrom || caseItem.formedAt >= dateFrom) &&
      (!dateTo || caseItem.formedAt <= dateTo);

    const matchesUrgency = selectedUrgencies.includes(
      caseItem.isUrgent ? "URGENT" : "NOT_URGENT"
    );

    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      selectedCategoryIds.includes(caseItem.category.id);

    return matchesSearch && matchesDate && matchesUrgency && matchesCategory;
  });
  // تعداد هر وضعیت، فقط بین همون پرونده‌هایی که الان بعد از فیلتر/جست‌وجو نشون داده می‌شن
  const statusCounts = {
    ACTIVE: filteredCases.filter((item) => item.status === "ACTIVE").length,
    CLOSED: filteredCases.filter((item) => item.status === "CLOSED").length,
    ARCHIVED: filteredCases.filter((item) => item.status === "ARCHIVED")
      .length,
  };
  const activeFilterCount =
  (searchTerm ? 1 : 0) +
  (statusFilter !== "ALL" ? 1 : 0) +
  (categoryFilter !== "ALL" ? 1 : 0);

  // یه کپی از filteredCases می‌سازیم و مرتبش می‌کنیم، تا خود آرایه اصلی دست‌نخورده بمونه
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (!sortField) return 0;

    let compareA: string | number;
    let compareB: string | number;

    switch (sortField) {
      case "internalNumber":
        compareA = a.internalNumber;
        compareB = b.internalNumber;
        break;
      case "title":
        compareA = a.title;
        compareB = b.title;
        break;
      case "client":
        compareA = a.client.fullName;
        compareB = b.client.fullName;
        break;
      case "category":
        compareA = a.category.name;
        compareB = b.category.name;
        break;
      case "status":
        compareA = a.status;
        compareB = b.status;
        break;
      
    }

    if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
    if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / PAGE_SIZE));
  const safePage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const casesToShow = sortedCases.slice(startIndex, startIndex + PAGE_SIZE);

  // کلیک رو سربرگ یه ستون: اگه همون ستونیه که الان مرتبیم، جهتش رو برعکس کن؛ وگرنه ستون جدید رو با جهت صعودی شروع کن
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  // آیکون کوچیک کنار هر سربرگ قابل‌مرتب‌سازی
  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ChevronsUpDown size={14} className="opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value: CaseStatus | "ALL") {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    setCurrentPage(1);
  }
  function toggleCategoryFilter(categoryId: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  }

  function toggleUrgencyFilter(value: UrgencyOption) {
    setSelectedUrgencies((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setCurrentPage(1);
  }

  function clearAllFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setSelectedUrgencies(["URGENT", "NOT_URGENT"]);
    setSelectedCategoryIds(mockCategories.map((category) => category.id));
    setCurrentPage(1);
  }

  // تعداد گروه‌های فیلتر فعال — یعنی چیزی که از حالت پیش‌فرض «همه انتخاب‌شده» کم شده
  async function handleConfirmAction() {
    if (!confirmAction) return;

    setConfirmStatus("processing");
    // روز سوم این خط با فراخوانی واقعی archiveCase() یا updateCase() جایگزین می‌شه
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (confirmAction.type === "toggle-urgent") {
      // فوریت پرونده رو برعکس کن (اگه ضروری بود غیرضروری بشه و برعکس)
      setAllCases((prev) =>
        prev.map((item) =>
          item.id === confirmAction.caseItem.id
            ? { ...item, isUrgent: !item.isUrgent }
            : item
        )
      );

      setToast(
        confirmAction.caseItem.isUrgent
          ? `پرونده «${confirmAction.caseItem.internalNumber}» از حالت ضروری خارج شد.`
          : `پرونده «${confirmAction.caseItem.internalNumber}» ضروری شد.`
      );
    } else {
      const newStatus: CaseStatus =
        confirmAction.type === "archive" ? "ARCHIVED" : "CLOSED";

      // فقط همون یه پرونده رو تو آرایه پیدا کن و وضعیتش رو عوض کن، بقیه دست‌نخورده بمونن
      setAllCases((prev) =>
        prev.map((item) =>
          item.id === confirmAction.caseItem.id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setToast(
        confirmAction.type === "archive"
          ? `پرونده «${confirmAction.caseItem.internalNumber}» بایگانی شد.`
          : `پرونده «${confirmAction.caseItem.internalNumber}» مختومه شد.`
      );
    }

    setConfirmStatus("idle");
    setConfirmAction(null);
  }

  return (
    <>
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="text-xs text-[#8C8A80] mb-0.5">
            داشبورد / پرونده‌ها
          </div>
          <h1 className="text-xl font-bold text-[#262420]">
            لیست پرونده‌ها
          </h1>
        </div>
        
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="جست‌وجو بر اساس شماره داخلی، عنوان، موکل یا دادگاه"
          className="w-full sm:w-82 p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm placeholder:text-[#8C8A80] focus:outline-none focus:border-[#A9762F]"
        />
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className="relative flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm text-[#4B4A44] hover:border-[#A9762F] transition-colors"
        >
          <Filter size={16} />
          فیلتر
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-[#A9762F] text-white text-[10px] rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        
        <button
  type="button"
  onClick={() => setShowNewCaseModal(true)}
  className="sm:mr-auto px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors whitespace-nowrap"
>
  + پرونده جدید
</button>

        {/* این دکمه فقط وقتی حداقل یه فیلتر یا جست‌وجو فعال باشه ظاهر می‌شه */}
        {(searchTerm || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
              setCategoryFilter("ALL");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm text-[#A32D2D] hover:underline"
          >
            حذف فیلترها
          </button>
        )}
      </div>

      {/* شمارش نتایج فعلی — بسته به فیلتر/جست‌وجو تغییر می‌کنه */}
      {!isLoading && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8C8A80] mb-2">
          <span>{filteredCases.length} پرونده</span>
          <span className="text-[#2F6B4F]">
            • {statusCounts.ACTIVE} فعال
          </span>
          <span className="text-[#6B6A63]">
            • {statusCounts.CLOSED} مختومه
          </span>
          <span className="text-[#954C33]">
            • {statusCounts.ARCHIVED} بایگانی‌شده
          </span>
        </div>
      )}

      {/* جدول — فقط از سایز sm به بعد دیده می‌شه؛ رو موبایل به‌جاش کارت‌های زیر رو داریم */}
      <div className="hidden sm:block max-w-6xl mx-auto bg-white border border-[#E4E1D8] rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-right text-sm">
          <thead>
            <tr className="bg-[#F1EFE6]">
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("internalNumber")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  شماره داخلی
                  <SortIcon field="internalNumber" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  عنوان
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("client")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  موکل
                  <SortIcon field="client" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  دسته‌بندی
                  <SortIcon field="category" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  وضعیت
                  <SortIcon field="status" />
                </button>
              </th>
          
              <th className="px-2 py-3 w-[120px] font-medium text-[#6B6A63] text-center">
  عملیات
</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-t border-[#EDEBE2]">
                    <td className="px-2 py-3"><SkeletonBar className="w-20" /></td>
                    <td className="px-2 py-3"><SkeletonBar className="w-32" /></td>
                    <td className="px-2 py-3"><SkeletonBar className="w-24" /></td>
                    <td className="px-2 py-3"><SkeletonBar className="w-20" /></td>
                    <td className="px-2 py-3"><SkeletonBar className="w-14 rounded-full" /></td>
                
                    <td className="px-2 py-3"><SkeletonBar className="w-16" /></td>
                  </tr>
                ))
              : casesToShow.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="border-t border-[#EDEBE2] hover:bg-[#FAF9F5]"
                  >
                    <td className="px-2 py-3">
                      <span
                        className="font-mono text-xs border border-[#E4D3B0] rounded px-2 py-1 text-[#8A5D1F] bg-[#FCF6EA]"
                        style={{ borderInlineStart: "3px solid #A9762F" }}
                      >
                        {caseItem.internalNumber}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[#262420]">{caseItem.title}</td>
                    <td className="px-2 py-3 text-[#4B4A44]">
                      {caseItem.client.fullName}
                    </td>
                    <td className="px-2 py-3 text-[#4B4A44]">
                      {caseItem.category.name}
                    </td>
                    <td className="px-2 py-3">
  <span
    className={`px-2.5 py-1 rounded-full text-xs ${
      statusStyles[caseItem.status]
    }`}
  >
    {statusLabels[caseItem.status]}
  </span>
</td>

<td className="px-2 py-3 w-[120px]">
  <div className="flex items-center justify-center gap-2 text-[#8C8A80]"></div>
                      <div className="flex items-center gap-3 text-[#8C8A80]">
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmAction({
                              type: "toggle-urgent",
                              caseItem,
                            })
                          }
                          title={
                            caseItem.isUrgent
                              ? "خارج کردن از حالت ضروری"
                              : "تائید"
                          }
                          className={
                            caseItem.isUrgent
                              ? "text-[#A32D2D]"
                              : "hover:text-[#A9762F] transition-colors"
                          }
                        >
                          <Star
                            size={17}
                            fill={caseItem.isUrgent ? "#A32D2D" : "none"}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDetailsCase(caseItem)}
                          title="مشاهده جزئیات"
                          className="hover:text-[#A9762F] transition-colors"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCase(caseItem)}
                          title="ویرایش"
                          className="hover:text-[#A9762F] transition-colors"
                        >
                          <Pencil size={17} />
                        </button>

                        {caseItem.status === "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmAction({ type: "close", caseItem })
                            }
                            title="مختومه کردن"
                            className="hover:text-[#2F6B4F] transition-colors"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                        )}

                        {caseItem.status !== "ARCHIVED" && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmAction({ type: "archive", caseItem })
                            }
                            title="بایگانی"
                            className="hover:text-[#A32D2D] transition-colors"
                          >
                            <Archive size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* نسخه کارتی — فقط رو موبایل (زیر sm) دیده می‌شه */}
      <div className="sm:hidden space-y-3">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={`skeleton-card-${index}`}
                className="bg-white border border-[#E4E1D8] rounded-xl p-4 space-y-3"
              >
                <SkeletonBar className="w-20 mr-auto" />
                <SkeletonBar className="w-32 mr-auto" />
                <SkeletonBar className="w-24 mr-auto" />
              </div>
            ))
          : casesToShow.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white border border-[#E4E1D8] rounded-xl p-4"
              >
                {/* شماره داخلی — بالا، راست‌چین */}
                <div
                  className="text-sm font-mono text-[#8A5D1F] mb-1 text-right"
                >
                  {caseItem.internalNumber}
                </div>

                {/* عنوان پرونده */}
                <div className="font-bold text-[#262420] mb-3 text-right">
                  {caseItem.title}
                </div>

                {/* ردیف‌های برچسب:مقدار */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">موکل</span>
                    <span className="text-[#262420]">
                      {caseItem.client.fullName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">دسته</span>
                    <span className="text-[#262420]">
                      {caseItem.category.name}
                    </span>
                  </div>
              
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">وضعیت</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs ${
                        statusStyles[caseItem.status]
                      }`}
                    >
                      {statusLabels[caseItem.status]}
                    </span>
                  </div>
                </div>

                {/* خط جداکننده + ردیف آیکون‌ها، وسط‌چین */}
                <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#EDEBE2] text-[#8C8A80]">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction({ type: "toggle-urgent", caseItem })
                    }
                    title={
                      caseItem.isUrgent
                        ? "خارج کردن از حالت ضروری"
                        : "تائید ضروریت"
                    }
                    className={
                      caseItem.isUrgent
                        ? "text-[#A32D2D]"
                        : "hover:text-[#A9762F] transition-colors"
                    }
                  >
                    <Star size={18} fill={caseItem.isUrgent ? "#A32D2D" : "none"} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailsCase(caseItem)}
                    title="مشاهده جزئیات"
                    className="hover:text-[#A9762F] transition-colors"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingCase(caseItem)}
                    title="ویرایش"
                    className="hover:text-[#A9762F] transition-colors"
                  >
                    <Pencil size={18} />
                  </button>

                  {caseItem.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "close", caseItem })
                      }
                      title="مختومه کردن"
                      className="hover:text-[#2F6B4F] transition-colors"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}

                  {caseItem.status !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "archive", caseItem })
                      }
                      title="بایگانی"
                      className="hover:text-[#A32D2D] transition-colors"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>

      {!isLoading && filteredCases.length === 0 && (
        <p className="mt-6 text-[#8C8A80] text-sm">
          {allCases.length === 0
            ? "هنوز هیچ پرونده‌ای ثبت نشده است."
            : "نتیجه‌ای برای این جست‌وجو یا فیلتر پیدا نشد."}
        </p>
      )}

      {!isLoading && filteredCases.length > 0 && (
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            قبلی
          </button>

          <span className="text-sm text-[#6B6A63]">
            صفحه {safePage} از {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safePage === totalPages}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            بعدی
          </button>
        </div>
      )}

      {/* مودال جزئیات پرونده */}
      {detailsCase && (
        <Modal onClose={() => setDetailsCase(null)} maxWidthClass="max-w-lg">
          <div className="flex items-center justify-between p-5 border-b border-[#EDEBE2]">
            <h2 className="font-bold text-[#262420]">جزئیات پرونده</h2>
            <button
              type="button"
              onClick={() => setDetailsCase(null)}
              className="text-[#8C8A80] hover:text-[#262420]"
              aria-label="بستن"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <DetailRow
              label="شماره داخلی"
              value={detailsCase.internalNumber}
              mono
            />
            <DetailRow label="عنوان" value={detailsCase.title} />
            <DetailRow label="موکل" value={detailsCase.client.fullName} />
            <DetailRow label="دسته‌بندی" value={detailsCase.category.name} />
            <DetailRow
              label="وضعیت"
              value={statusLabels[detailsCase.status]}
            />
           
            <DetailRow
              label="شماره پرونده دادگاه"
              value={detailsCase.courtCaseNumber ?? "—"}
              mono
            />
            <DetailRow
              label="نام دادگاه"
              value={detailsCase.courtName ?? "—"}
            />
            <DetailRow label="شعبه" value={detailsCase.branch ?? "—"} />
            <DetailRow
              label="طرف مقابل"
              value={detailsCase.opponentName ?? "—"}
            />
            <DetailRow
              label="تاریخ تشکیل"
              value={formatPersianDate(detailsCase.formedAt)}
            />
            <DetailRow
              label="تاریخ جلسه بعدی"
              value={formatPersianDate(detailsCase.nextSessionAt)}
            />
            <DetailRow
              label="توضیحات"
              value={detailsCase.description ?? "—"}
            />
          </div>
        </Modal>
      )}

      {/* مودال تأیید برای بایگانی یا مختومه‌کردن */}
      {confirmAction && (
        <Modal
          onClose={() => setConfirmAction(null)}
          maxWidthClass="max-w-sm"
        >
          <div className="p-6">
            <p className="mb-4 font-medium text-[#262420] text-sm">
              {confirmAction.type === "archive"
                ? "آیا از بایگانی پرونده زیر مطمئن هستید؟"
                : confirmAction.type === "close"
                ? "آیا از مختومه کردن پرونده زیر مطمئن هستید؟"
                : confirmAction.caseItem.isUrgent
                ? "آیا می‌خواهید این پرونده از حالت ضروری خارج شود؟"
                : "آیا می‌خواهید این پرونده ضروری علامت‌گذاری شود؟"}
            </p>
            <div className="bg-[#F7F5F0] rounded-lg p-3 mb-4 space-y-1">
              <p className="text-sm text-[#6B6A63]">
                شماره داخلی:{" "}
                <span className="font-mono">
                  {confirmAction.caseItem.internalNumber}
                </span>
              </p>
              <p className="text-sm text-[#6B6A63]">
                عنوان: {confirmAction.caseItem.title}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirmStatus === "processing"}
                className={`px-4 py-2 text-white rounded-lg text-sm disabled:opacity-50 ${
                  confirmAction.type === "archive"
                    ? "bg-[#A32D2D]"
                    : confirmAction.type === "close"
                    ? "bg-[#2F6B4F]"
                    : "bg-[#A9762F]"
                }`}
              >
                {confirmStatus === "processing"
                  ? "در حال انجام..."
                  : confirmAction.type === "archive"
                  ? "بایگانی پرونده"
                  : confirmAction.type === "close"
                  ? "مختومه کردن"
                  : confirmAction.caseItem.isUrgent
                  ? "خارج کردن از حالت ضروری"
                  : "تایید ضروریت"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showNewCaseModal && (
        <NewCaseModal onClose={() => setShowNewCaseModal(false)} />
      )}
       
{showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={(value) => {
            setDateFrom(value);
            setCurrentPage(1);
          }}
          onDateToChange={(value) => {
            setDateTo(value);
            setCurrentPage(1);
          }}
          selectedUrgencies={selectedUrgencies}
          onToggleUrgency={toggleUrgencyFilter}
          
          selectedCategoryIds={selectedCategoryIds}
          onToggleCategory={toggleCategoryFilter}
          onClearAll={clearAllFilters}
        />
      )}

      {editingCase && (
        
        <EditCaseModal
          caseItem={editingCase}
          onClose={() => setEditingCase(null)}
          onSaved={(updated) => {
            // فقط همون یه پرونده رو تو لیست با نسخه جدیدش جایگزین کن
            setAllCases((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
          }}
          onArchived={(caseId) => {
            setAllCases((prev) =>
              prev.map((item) =>
                item.id === caseId ? { ...item, status: "ARCHIVED" } : item
              )
            );
            setToast("پرونده بایگانی شد.");
          }}
        />
      )}

      {/* پیام موقت پایین صفحه — خودش بعد از ۳ ثانیه محو می‌شه */}
      {toast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-[60] px-4">
          <div className="bg-[#1E2A44] text-white text-sm px-4 py-3 rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
