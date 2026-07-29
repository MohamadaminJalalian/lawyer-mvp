"use client";

// ┘à╪│█î╪▒ ╪º█î┘å ┘ü╪º█î┘ä: app/cases/page.tsx
import { getCaseDocuments } from "@/mocks/documents.mock";
import Link from "next/link";
import { Files } from "lucide-react"; // ┌⌐┘å╪º╪▒ Star, Eye, Pencil, CheckCircle2
import { formatPersianDate } from "../../lib/utils/date";
import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Landmark,
  Calendar,
  ClipboardList,
} from "lucide-react";
import {
  Eye,
  Pencil,
  CheckCircle2,
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

} from "../../mocks/cases.types";

const statusLabels: Record<CaseStatus, string> = {
  ACTIVE: "┘ü╪╣╪º┘ä",
  CLOSED: "┘à╪«╪¬┘ê┘à┘ç",
};

const statusStyles: Record<CaseStatus, string> = {
  ACTIVE: "bg-[#E7F1EB] text-[#2F6B4F]",
  CLOSED: "bg-[#F1EFE6] text-[#6B6A63]",
};


const PAGE_SIZE = 2;

// ┘ü█î┘ä╪»┘ç╪º█î█î ┌⌐┘ç ╪º╪¼╪º╪▓┘ç ┘à╪▒╪¬╪¿ΓÇî╪│╪º╪▓█î ╪▒┘ê╪┤┘ê┘å ╪▒┘ê ╪»╪º╪▒█î┘à
type SortField =
  | "internalNumber"
  | "title"
  | "client"
  | "category"
  | "status"
  ;

// ┌å┘ê┘å ╪º┘ê┘ä┘ê█î╪¬ █î┘ç EnumΓÇî┘ç ┘å┘ç ╪╣╪»╪»╪î ╪«┘ê╪»┘à┘ê┘å █î┘ç ╪¬╪▒╪¬█î╪¿ ┘à┘å╪╖┘é█î ╪¿╪▒╪º╪┤ ╪¬╪╣╪▒█î┘ü ┘à█îΓÇî┌⌐┘å█î┘à


function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 bg-[#EDEBE2] rounded animate-pulse ${className}`} />
  );
}

// █î┘ç ╪▒╪»█î┘ü ╪│╪º╪»┘ç ╪¿╪▒╪º█î ┘å┘à╪º█î╪┤ ┬½╪¿╪▒┌å╪│╪¿: ┘à┘é╪»╪º╪▒┬╗ ╪¬┘ê ┘à┘ê╪»╪º┘ä ╪¼╪▓╪ª█î╪º╪¬
function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  
  return (
    <div className="rounded-xl border border-[#EDEBE2] bg-white overflow-hidden">
      {/* ┘ç╪»╪▒ ╪¿╪º ┘╛╪│ΓÇî╪▓┘à█î┘å┘çΓÇî█î ┘à╪¬┘ü╪º┘ê╪¬ */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#FAF8F3] border-b border-[#EDEBE2]">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FCF6EA] text-[#8A5D1F]">
          <Icon size={15} />
        </span>
        <h4 className="font-bold text-[#262420] text-sm">{title}</h4>
      </div>

      {/* ╪¿╪»┘å┘ç ╪│┘ü█î╪» */}
      <div className="px-4 py-3 space-y-2.5 bg-white">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#EDEBE2] last:border-0 text-sm">
      <span className="text-[#8C8A80]">{label}</span>
      <span className="text-[#262420] font-medium">{value}</span>
    </div>
  );
}
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

// ┘å┘ê╪╣ ╪╣┘à┘ä█î╪º╪¬█î ┌⌐┘ç ┘à┘à┌⌐┘å┘ç ╪º╪▓ ╪│╪¬┘ê┘å ╪╣┘à┘ä█î╪º╪¬ ╪╡╪»╪º ╪▓╪»┘ç ╪¿╪┤┘ç ┘ê ┘å█î╪º╪▓ ╪¿┘ç ╪¬╪ú█î█î╪» ╪»╪º╪▒┘ç
interface ConfirmAction {
  type: "close" | "toggle-urgent";
  caseItem: CaseListItem;
}

export default function CasesListPage() {
  const [allCases, setAllCases] = useState<CaseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<CaseStatus[]>([
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedUrgencies, setSelectedUrgencies] = useState<UrgencyOption[]>([
    
  ]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ┘à┘ê╪»╪º┘ä ╪¼╪▓╪ª█î╪º╪¬ ┘╛╪▒┘ê┘å╪»┘ç ΓÇö ╪º┌»┘ç ┘à┘é╪»╪º╪▒█î ╪»╪º╪┤╪¬┘ç ╪¿╪º╪┤┘ç █î╪╣┘å█î ╪¿╪º╪▓┘ç
  const [detailsCase, setDetailsCase] = useState<CaseListItem | null>(null);

  // ┘à┘ê╪»╪º┘ä ╪¬╪ú█î█î╪» ╪¿╪▒╪º█î ┘à╪«╪¬┘ê┘à┘çΓÇî┌⌐╪▒╪»┘å █î╪º ╪¬╪║█î█î╪▒ ┘ü┘ê╪▒█î╪¬
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null
  );
  const [confirmStatus, setConfirmStatus] = useState<"idle" | "processing">(
    "idle"
  );

  // ┘à┘ê╪»╪º┘ä ╪½╪¿╪¬ ┘╛╪▒┘ê┘å╪»┘ç ╪¼╪»█î╪»
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // ┘╛╪▒┘ê┘å╪»┘çΓÇî╪º█î ┌⌐┘ç ╪º┘ä╪º┘å ╪¬┘ê ┘à┘ê╪»╪º┘ä ┘ê█î╪▒╪º█î╪┤ ╪¿╪º╪▓┘ç╪¢ null █î╪╣┘å█î ┘ç█î┌åΓÇî┌⌐╪»┘ê┘à ╪¿╪º╪▓ ┘å█î╪│╪¬
  const [editingCase, setEditingCase] = useState<CaseListItem | null>(null);

  // ┘à╪▒╪¬╪¿ΓÇî╪│╪º╪▓█î ╪¼╪»┘ê┘ä
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ┘╛█î╪º┘à ┌⌐┘ê╪¬╪º┘ç ┘ê ┘à┘ê┘é╪¬ (Toast) ┌⌐┘ç ╪¿╪╣╪» ╪º╪▓ █î┘ç ╪╣┘à┘ä█î╪º╪¬ ┘à┘ê┘ü┘é ┘å╪┤┘ê┘å ╪»╪º╪»┘ç ┘à█îΓÇî╪┤┘ç
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
  (caseItem.courtName ?? "").toLowerCase().includes(term) ||
  (caseItem.subject ?? "").toLowerCase().includes(term);

    // ┘à┘é╪º█î╪│┘ç ╪▒╪┤╪¬┘çΓÇî╪º█î ┌å┘ê┘å ┘ü╪▒┘à╪¬ ╪¬╪º╪▒█î╪«ΓÇî┘ç╪º "YYYY-MM-DD"┘ç╪î ┘ç┘à┘ê┘å ╪¬╪▒╪¬█î╪¿ ╪▓┘à╪º┘å█î ╪▒┘ê ┘ç┘à ┘à█îΓÇî╪»┘ç
    const matchesDate =
      (!dateFrom || caseItem.formedAt >= dateFrom) &&
      (!dateTo || caseItem.formedAt <= dateTo);

      const matchesStatus =
  selectedStatuses.length === 0 ||
  selectedStatuses.includes(caseItem.status);

const matchesUrgency =
  selectedUrgencies.length === 0 ||
  selectedUrgencies.includes(
    caseItem.isUrgent ? "URGENT" : "NOT_URGENT"
  );

    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      selectedCategoryIds.includes(caseItem.category.id);

    return (
      matchesSearch &&
      matchesDate &&
      matchesUrgency &&
      matchesCategory &&
      matchesStatus
    );
  });
  // ╪¬╪╣╪»╪º╪» ┘ç╪▒ ┘ê╪╢╪╣█î╪¬╪î ┘ü┘é╪╖ ╪¿█î┘å ┘ç┘à┘ê┘å ┘╛╪▒┘ê┘å╪»┘çΓÇî┘ç╪º█î█î ┌⌐┘ç ╪º┘ä╪º┘å ╪¿╪╣╪» ╪º╪▓ ┘ü█î┘ä╪¬╪▒/╪¼╪│╪¬ΓÇî┘ê╪¼┘ê ┘å╪┤┘ê┘å ╪»╪º╪»┘ç ┘à█îΓÇî╪┤┘å
  const statusCounts = {
    ACTIVE: filteredCases.filter((item) => item.status === "ACTIVE").length,
    CLOSED: filteredCases.filter((item) => item.status === "CLOSED").length,
  };
 const activeFilterCount =
  (dateFrom || dateTo ? 1 : 0) +
  (selectedUrgencies.length > 0 ? 1 : 0) +
  (selectedCategoryIds.length > 0 ? 1 : 0) +
  (selectedStatuses.length > 0 ? 1 : 0);

  // █î┘ç ┌⌐┘╛█î ╪º╪▓ filteredCases ┘à█îΓÇî╪│╪º╪▓█î┘à ┘ê ┘à╪▒╪¬╪¿╪┤ ┘à█îΓÇî┌⌐┘å█î┘à╪î ╪¬╪º ╪«┘ê╪» ╪ó╪▒╪º█î┘ç ╪º╪╡┘ä█î ╪»╪│╪¬ΓÇî┘å╪«┘ê╪▒╪»┘ç ╪¿┘à┘ê┘å┘ç
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

  // ┌⌐┘ä█î┌⌐ ╪▒┘ê ╪│╪▒╪¿╪▒┌» █î┘ç ╪│╪¬┘ê┘å: ╪º┌»┘ç ┘ç┘à┘ê┘å ╪│╪¬┘ê┘å█î┘ç ┌⌐┘ç ╪º┘ä╪º┘å ┘à╪▒╪¬╪¿█î┘à╪î ╪¼┘ç╪¬╪┤ ╪▒┘ê ╪¿╪▒╪╣┌⌐╪│ ┌⌐┘å╪¢ ┘ê┌»╪▒┘å┘ç ╪│╪¬┘ê┘å ╪¼╪»█î╪» ╪▒┘ê ╪¿╪º ╪¼┘ç╪¬ ╪╡╪╣┘ê╪»█î ╪┤╪▒┘ê╪╣ ┌⌐┘å
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  // ╪ó█î┌⌐┘ê┘å ┌⌐┘ê┌å█î┌⌐ ┌⌐┘å╪º╪▒ ┘ç╪▒ ╪│╪▒╪¿╪▒┌» ┘é╪º╪¿┘äΓÇî┘à╪▒╪¬╪¿ΓÇî╪│╪º╪▓█î
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

 

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    setCurrentPage(1);
  }
  function toggleStatusFilter(status: CaseStatus) {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
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
    setSelectedStatuses([]);
    setDateFrom("");
    setDateTo("");
    setSelectedUrgencies([]);
    setSelectedCategoryIds([]);
    setCurrentPage(1);
  }

  // ╪¬╪╣╪»╪º╪» ┌»╪▒┘ê┘çΓÇî┘ç╪º█î ┘ü█î┘ä╪¬╪▒ ┘ü╪╣╪º┘ä ΓÇö █î╪╣┘å█î ┌å█î╪▓█î ┌⌐┘ç ╪º╪▓ ╪¡╪º┘ä╪¬ ┘╛█î╪┤ΓÇî┘ü╪▒╪╢ ┬½┘ç┘à┘ç ╪º┘å╪¬╪«╪º╪¿ΓÇî╪┤╪»┘ç┬╗ ┌⌐┘à ╪┤╪»┘ç
  async function handleConfirmAction() {
    if (!confirmAction) return;

    setConfirmStatus("processing");
    // ╪▒┘ê╪▓ ╪│┘ê┘à ╪º█î┘å ╪«╪╖ ╪¿╪º ┘ü╪▒╪º╪«┘ê╪º┘å█î ┘ê╪º┘é╪╣█î updateCase() ╪¼╪º█î┌»╪▓█î┘å ┘à█îΓÇî╪┤┘ç
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (confirmAction.type === "toggle-urgent") {
      // ┘ü┘ê╪▒█î╪¬ ┘╛╪▒┘ê┘å╪»┘ç ╪▒┘ê ╪¿╪▒╪╣┌⌐╪│ ┌⌐┘å (╪º┌»┘ç ╪╢╪▒┘ê╪▒█î ╪¿┘ê╪» ╪║█î╪▒╪╢╪▒┘ê╪▒█î ╪¿╪┤┘ç ┘ê ╪¿╪▒╪╣┌⌐╪│)
      setAllCases((prev) =>
        prev.map((item) =>
          item.id === confirmAction.caseItem.id
            ? { ...item, isUrgent: !item.isUrgent }
            : item
        )
      );

      setToast(
        confirmAction.caseItem.isUrgent
          ? `┘╛╪▒┘ê┘å╪»┘ç ┬½${confirmAction.caseItem.internalNumber}┬╗ ╪º╪▓ ╪¡╪º┘ä╪¬ ╪╢╪▒┘ê╪▒█î ╪«╪º╪▒╪¼ ╪┤╪».`
          : `┘╛╪▒┘ê┘å╪»┘ç ┬½${confirmAction.caseItem.internalNumber}┬╗ ╪╢╪▒┘ê╪▒█î ╪┤╪».`
      );
    } else {
      // ┘ü┘é╪╖ ┘ç┘à┘ê┘å █î┘ç ┘╛╪▒┘ê┘å╪»┘ç ╪▒┘ê ╪¬┘ê ╪ó╪▒╪º█î┘ç ┘╛█î╪»╪º ┌⌐┘å ┘ê ┘ê╪╢╪╣█î╪¬╪┤ ╪▒┘ê ┘à╪«╪¬┘ê┘à┘ç ┌⌐┘å╪î ╪¿┘é█î┘ç ╪»╪│╪¬ΓÇî┘å╪«┘ê╪▒╪»┘ç ╪¿┘à┘ê┘å┘å
      setAllCases((prev) =>
        prev.map((item) =>
          item.id === confirmAction.caseItem.id
            ? { ...item, status: "CLOSED" }
            : item
        )
      );

      setToast(
        `┘╛╪▒┘ê┘å╪»┘ç ┬½${confirmAction.caseItem.internalNumber}┬╗ ┘à╪«╪¬┘ê┘à┘ç ╪┤╪».`
      );
    }

    setConfirmStatus("idle");
    setConfirmAction(null);
  }
 

// ...

const docCountByCase = Object.fromEntries(
  casesToShow.map((c) => [c.id, getCaseDocuments(c.id).files.length])
);

  return (
    <>
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="text-xs text-[#8C8A80] mb-0.5">
            ╪»╪º╪┤╪¿┘ê╪▒╪» / ┘╛╪▒┘ê┘å╪»┘çΓÇî┘ç╪º
          </div>
          <h1 className="text-xl font-bold text-[#262420]">
            ┘ä█î╪│╪¬ ┘╛╪▒┘ê┘å╪»┘çΓÇî┘ç╪º
          </h1>
        </div>
        
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="╪¼╪│╪¬ΓÇî┘ê╪¼┘ê ╪¿╪▒ ╪º╪│╪º╪│ ╪┤┘à╪º╪▒┘ç ╪»╪º╪«┘ä█î╪î ╪╣┘å┘ê╪º┘å╪î ┘à┘ê┌⌐┘ä █î╪º ╪»╪º╪»┌»╪º┘ç╪î ┘à┘ê╪╢┘ê╪╣"
          className="w-full sm:w-93 p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm placeholder:text-[#8C8A80] focus:outline-none focus:border-[#A9762F]"
        />
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className="relative flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm text-[#4B4A44] hover:border-[#A9762F] transition-colors"
        >
          <Filter size={16} />
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
  + ┘╛╪▒┘ê┘å╪»┘ç ╪¼╪»█î╪»
</button>

        {/* ╪º█î┘å ╪»┌⌐┘à┘ç ┘ü┘é╪╖ ┘ê┘é╪¬█î ╪¡╪»╪º┘é┘ä █î┘ç ┘ü█î┘ä╪¬╪▒ █î╪º ╪¼╪│╪¬ΓÇî┘ê╪¼┘ê ┘ü╪╣╪º┘ä ╪¿╪º╪┤┘ç ╪╕╪º┘ç╪▒ ┘à█îΓÇî╪┤┘ç */}
        {(searchTerm || activeFilterCount > 0) && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm text-[#A32D2D] hover:underline"
          >
            ╪¡╪░┘ü ┘ü█î┘ä╪¬╪▒┘ç╪º
          </button>
        )}
      </div>

      {/* ╪┤┘à╪º╪▒╪┤ ┘å╪¬╪º█î╪¼ ┘ü╪╣┘ä█î ΓÇö ╪¿╪│╪¬┘ç ╪¿┘ç ┘ü█î┘ä╪¬╪▒/╪¼╪│╪¬ΓÇî┘ê╪¼┘ê ╪¬╪║█î█î╪▒ ┘à█îΓÇî┌⌐┘å┘ç */}
      {!isLoading && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8C8A80] mb-2">
          <span>{filteredCases.length} ┘╛╪▒┘ê┘å╪»┘ç</span>
          <span className="text-[#2F6B4F]">
            ΓÇó {statusCounts.ACTIVE} ┘ü╪╣╪º┘ä
          </span>
          <span className="text-[#6B6A63]">
            ΓÇó {statusCounts.CLOSED} ┘à╪«╪¬┘ê┘à┘ç
          </span>
          
        </div>
      )}

      {/* ╪¼╪»┘ê┘ä ΓÇö ┘ü┘é╪╖ ╪º╪▓ ╪│╪º█î╪▓ sm ╪¿┘ç ╪¿╪╣╪» ╪»█î╪»┘ç ┘à█îΓÇî╪┤┘ç╪¢ ╪▒┘ê ┘à┘ê╪¿╪º█î┘ä ╪¿┘çΓÇî╪¼╪º╪┤ ┌⌐╪º╪▒╪¬ΓÇî┘ç╪º█î ╪▓█î╪▒ ╪▒┘ê ╪»╪º╪▒█î┘à */}
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
                  ╪┤┘à╪º╪▒┘ç ╪»╪º╪«┘ä█î
                  <SortIcon field="internalNumber" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  ╪╣┘å┘ê╪º┘å
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("client")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  ┘à┘ê┌⌐┘ä
                  <SortIcon field="client" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  ╪»╪│╪¬┘çΓÇî╪¿┘å╪»█î
                  <SortIcon field="category" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
  ┘à┘ê╪╢┘ê╪╣
</th>
              <th className="px-2 py-3 font-medium text-[#6B6A63]">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-[#A9762F] transition-colors"
                >
                  ┘ê╪╢╪╣█î╪¬
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-2 py-3 font-medium text-[#6B6A63] text-right">
  ╪º╪│┘å╪º╪»
</th>
          
              <th className="px-2 py-3 w-[120px] font-medium text-[#6B6A63] text-center">
  ╪╣┘à┘ä█î╪º╪¬
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

<td className="px-2 py-3 flex justify-center">
  <SkeletonBar className="w-8 h-8 rounded-lg" />
</td>

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
                   

<td className="px-2 py-3 text-[#4B4A44]">
  {caseItem.subject || "ΓÇö"}
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

{/* ╪│╪¬┘ê┘å ╪¼╪»█î╪»: ╪º╪│┘å╪º╪» */}
<td className="px-2 py-3 text-right">
  <Link
    href={`/cases/${caseItem.id}/documents`}
    className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#FAF8F3] text-[#8A5D1F] transition-colors"
    title="┘à╪┤╪º┘ç╪»┘ç ╪º╪│┘å╪º╪»"
  >
    <Files size={17} />
    {docCountByCase[caseItem.id] > 0 && (
      <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-[#8A5D1F] text-white text-[10px] leading-none">
        {docCountByCase[caseItem.id]}
      </span>
    )}
  </Link>
</td>




<td className="px-2 py-3 w-[120px]">

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
                              ? "╪«╪º╪▒╪¼ ┌⌐╪▒╪»┘å ╪º╪▓ ╪¡╪º┘ä╪¬ ╪╢╪▒┘ê╪▒█î"
                              : "╪¬╪º╪ª█î╪»"
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
                          title="┘à╪┤╪º┘ç╪»┘ç ╪¼╪▓╪ª█î╪º╪¬"
                          className="hover:text-[#A9762F] transition-colors"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCase(caseItem)}
                          title="┘ê█î╪▒╪º█î╪┤"
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
                            title="┘à╪«╪¬┘ê┘à┘ç ┌⌐╪▒╪»┘å"
                            className="hover:text-[#2F6B4F] transition-colors"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                        )}

                  
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ┘å╪│╪«┘ç ┌⌐╪º╪▒╪¬█î ΓÇö ┘ü┘é╪╖ ╪▒┘ê ┘à┘ê╪¿╪º█î┘ä (╪▓█î╪▒ sm) ╪»█î╪»┘ç ┘à█îΓÇî╪┤┘ç */}
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
                {/* ╪┤┘à╪º╪▒┘ç ╪»╪º╪«┘ä█î ΓÇö ╪¿╪º┘ä╪º╪î ╪▒╪º╪│╪¬ΓÇî┌å█î┘å */}
                <div
                  className="text-sm font-mono text-[#8A5D1F] mb-1 text-right"
                >
                  {caseItem.internalNumber}
                </div>

                {/* ╪╣┘å┘ê╪º┘å ┘╛╪▒┘ê┘å╪»┘ç */}
                <div className="font-bold text-[#262420] mb-3 text-right">
                  {caseItem.title}
                </div>

                {/* ╪▒╪»█î┘üΓÇî┘ç╪º█î ╪¿╪▒┌å╪│╪¿:┘à┘é╪»╪º╪▒ */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">┘à┘ê┌⌐┘ä</span>
                    <span className="text-[#262420]">
                      {caseItem.client.fullName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">╪»╪│╪¬┘ç</span>
                    <span className="text-[#262420]">
                      {caseItem.category.name}
                    </span>
                  </div>
              
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8C8A80]">┘ê╪╢╪╣█î╪¬</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs ${
                        statusStyles[caseItem.status]
                      }`}
                    >
                      {statusLabels[caseItem.status]}
                    </span>
                  </div>
                </div>

                {/* ╪«╪╖ ╪¼╪»╪º┌⌐┘å┘å╪»┘ç + ╪▒╪»█î┘ü ╪ó█î┌⌐┘ê┘åΓÇî┘ç╪º╪î ┘ê╪│╪╖ΓÇî┌å█î┘å */}
                <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#EDEBE2] text-[#8C8A80]">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction({ type: "toggle-urgent", caseItem })
                    }
                    title={
                      caseItem.isUrgent
                        ? "╪«╪º╪▒╪¼ ┌⌐╪▒╪»┘å ╪º╪▓ ╪¡╪º┘ä╪¬ ╪╢╪▒┘ê╪▒█î"
                        : "╪¬╪º╪ª█î╪» ╪╢╪▒┘ê╪▒█î╪¬"
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
                    title="┘à╪┤╪º┘ç╪»┘ç ╪¼╪▓╪ª█î╪º╪¬"
                    className="hover:text-[#A9762F] transition-colors"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingCase(caseItem)}
                    title="┘ê█î╪▒╪º█î╪┤"
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
                      title="┘à╪«╪¬┘ê┘à┘ç ┌⌐╪▒╪»┘å"
                      className="hover:text-[#2F6B4F] transition-colors"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}

                
                </div>
              </div>
            ))}
      </div>

      {!isLoading && filteredCases.length === 0 && (
        <p className="mt-6 text-[#8C8A80] text-sm">
          {allCases.length === 0
            ? "┘ç┘å┘ê╪▓ ┘ç█î┌å ┘╛╪▒┘ê┘å╪»┘çΓÇî╪º█î ╪½╪¿╪¬ ┘å╪┤╪»┘ç ╪º╪│╪¬."
            : "┘å╪¬█î╪¼┘çΓÇî╪º█î ╪¿╪▒╪º█î ╪º█î┘å ╪¼╪│╪¬ΓÇî┘ê╪¼┘ê █î╪º ┘ü█î┘ä╪¬╪▒ ┘╛█î╪»╪º ┘å╪┤╪»."}
        </p>
      )}

      {!isLoading && filteredCases.length > 0 && (
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ┘é╪¿┘ä█î
          </button>

          <span className="text-sm text-[#6B6A63]">
            ╪╡┘ü╪¡┘ç {safePage} ╪º╪▓ {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safePage === totalPages}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ╪¿╪╣╪»█î
          </button>
        </div>
      )}

      {/* ┘à┘ê╪»╪º┘ä ╪¼╪▓╪ª█î╪º╪¬ ┘╛╪▒┘ê┘å╪»┘ç */}
      {detailsCase && (
  <Modal
    onClose={() => setDetailsCase(null)}
    maxWidthClass="max-w-3xl"
  >
    {/* Header */}
   {/* Header */}
<div className="border-b border-[#EDEBE2]">
  <div className="flex items-center justify-between p-5">
    <h2 className="text-xl font-bold text-[#262420] flex items-center gap-2">
      <FileText size={20} className="text-[#8A5D1F]" />
      ╪¼╪▓╪ª█î╪º╪¬ ┘╛╪▒┘ê┘å╪»┘ç
    </h2>
    <button
      type="button"
      onClick={() => setDetailsCase(null)}
      className="text-[#8C8A80] hover:text-[#262420] transition-colors"
    >
      <X size={22} />
    </button>
  </div>

  <div className="px-5 pb-5 flex items-center justify-between flex-wrap gap-3">
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-[#262420]">
          {detailsCase.title}
        </h3>
        <span className="px-2 py-0.5 rounded-md bg-[#FCF6EA] border border-[#E4D3B0] text-[#8A5D1F] font-mono text-xs">
          {detailsCase.internalNumber}
        </span>
      </div>
      <p className="text-sm text-[#8C8A80] mt-1">╪º╪╖┘ä╪º╪╣╪º╪¬ ┌⌐╪º┘à┘ä ┘╛╪▒┘ê┘å╪»┘ç</p>
    </div>

    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EE] border border-[#BFE3CB] text-[#2F6B4F] text-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]" />
        {statusLabels[detailsCase.status]}
      </span>

      {detailsCase.isUrgent && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm">
          <Star size={14} fill="currentColor" />
          ┘╛╪▒┘ê┘å╪»┘ç ┘ü┘ê╪▒█î
        </span>
      )}
    </div>
  </div>
</div>

    {/* ┘à╪¡╪¬┘ê╪º */}
    {/* ┘à╪¡╪¬┘ê╪º */}
<div className="p-5 space-y-4 text-sm">

  {/* ╪º╪╖┘ä╪º╪╣╪º╪¬ ┘╛╪▒┘ê┘å╪»┘ç */}
  <InfoCard icon={FileText} title="╪º╪╖┘ä╪º╪╣╪º╪¬ ┘╛╪▒┘ê┘å╪»┘ç">
    <Field label="╪╣┘å┘ê╪º┘å" value={detailsCase.title} />
    <Field label="╪»╪│╪¬┘çΓÇî╪¿┘å╪»█î" value={detailsCase.category.name} />
    <Field label="┘ê╪╢╪╣█î╪¬" value={statusLabels[detailsCase.status]} />
  </InfoCard>

  {/* ╪º╪┤╪«╪º╪╡ + ╪º╪╖┘ä╪º╪╣╪º╪¬ ╪»╪º╪»┌»╪º┘ç╪î ┌⌐┘å╪º╪▒ ┘ç┘à */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <InfoCard icon={Users} title="╪º╪┤╪«╪º╪╡">
      <Field label="┘à┘ê┌⌐┘ä" value={detailsCase.client.fullName} />
      <Field
        label="╪╖╪▒┘ü ┘à┘é╪º╪¿┘ä"
        value={detailsCase.opponentName ?? "ΓÇö"}
      />
    </InfoCard>

    <InfoCard icon={Landmark} title="╪º╪╖┘ä╪º╪╣╪º╪¬ ╪»╪º╪»┌»╪º┘ç">
      <Field label="┘å╪º┘à ╪»╪º╪»┌»╪º┘ç" value={detailsCase.courtName ?? "ΓÇö"} />
      <Field label="╪┤╪╣╪¿┘ç" value={detailsCase.branch ?? "ΓÇö"} />
      <Field
        label="╪┤┘à╪º╪▒┘ç ┘╛╪▒┘ê┘å╪»┘ç ╪»╪º╪»┌»╪º┘ç"
        value={detailsCase.courtCaseNumber ?? "ΓÇö"}
      />
    </InfoCard>
  </div>

  {/* ╪▓┘à╪º┘åΓÇî╪¿┘å╪»█î */}
  <InfoCard icon={Calendar} title="╪▓┘à╪º┘åΓÇî╪¿┘å╪»█î">
    <div className="grid grid-cols-2 gap-4">
      <Field
        label="╪¬╪º╪▒█î╪« ╪¼┘ä╪│┘ç ╪¿╪╣╪»█î"
        value={formatPersianDate(detailsCase.nextSessionAt)}
      />
      <Field
        label="╪¬╪º╪▒█î╪« ╪¬╪┤┌⌐█î┘ä ┘╛╪▒┘ê┘å╪»┘ç"
        value={formatPersianDate(detailsCase.formedAt)}
      />
    </div>
  </InfoCard>

  {/* ╪¬┘ê╪╢█î╪¡╪º╪¬ */}
  <InfoCard icon={ClipboardList} title="╪¬┘ê╪╢█î╪¡╪º╪¬">
    <p className="text-[#262420] bg-white rounded-lg border border-[#EDEBE2] p-3 leading-6">
      {detailsCase.description ?? "ΓÇö"}
    </p>
  </InfoCard>

</div>

  </Modal>
)}

      {/* ┘à┘ê╪»╪º┘ä ╪¬╪ú█î█î╪» ╪¿╪▒╪º█î ┘à╪«╪¬┘ê┘à┘çΓÇî┌⌐╪▒╪»┘å █î╪º ╪¬╪║█î█î╪▒ ┘ü┘ê╪▒█î╪¬ */}
      {confirmAction && (
        <Modal
          onClose={() => setConfirmAction(null)}
          maxWidthClass="max-w-sm"
        >
          <div className="p-6">
            <p className="mb-4 font-medium text-[#262420] text-sm">
              {confirmAction.type === "close"
                ? "╪ó█î╪º ╪º╪▓ ┘à╪«╪¬┘ê┘à┘ç ┌⌐╪▒╪»┘å ┘╛╪▒┘ê┘å╪»┘ç ╪▓█î╪▒ ┘à╪╖┘à╪ª┘å ┘ç╪│╪¬█î╪»╪ƒ"
                : confirmAction.caseItem.isUrgent
                ? "╪ó█î╪º ┘à█îΓÇî╪«┘ê╪º┘ç█î╪» ╪º█î┘å ┘╛╪▒┘ê┘å╪»┘ç ╪º╪▓ ╪¡╪º┘ä╪¬ ╪╢╪▒┘ê╪▒█î ╪«╪º╪▒╪¼ ╪┤┘ê╪»╪ƒ"
                : "╪ó█î╪º ┘à█îΓÇî╪«┘ê╪º┘ç█î╪» ╪º█î┘å ┘╛╪▒┘ê┘å╪»┘ç ╪╢╪▒┘ê╪▒█î ╪╣┘ä╪º┘à╪¬ΓÇî┌»╪░╪º╪▒█î ╪┤┘ê╪»╪ƒ"}
            </p>
            <div className="bg-[#F7F5F0] rounded-lg p-3 mb-4 space-y-1">
              <p className="text-sm text-[#6B6A63]">
                ╪┤┘à╪º╪▒┘ç ╪»╪º╪«┘ä█î:{" "}
                <span className="font-mono">
                  {confirmAction.caseItem.internalNumber}
                </span>
              </p>
              <p className="text-sm text-[#6B6A63]">
                ╪╣┘å┘ê╪º┘å: {confirmAction.caseItem.title}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
              >
                ╪º┘å╪╡╪▒╪º┘ü
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirmStatus === "processing"}
                className={`px-4 py-2 text-white rounded-lg text-sm disabled:opacity-50 ${
                  confirmAction.type === "close"
                    ? "bg-[#2F6B4F]"
                    : "bg-[#A9762F]"
                }`}
              >
                {confirmStatus === "processing"
                  ? "╪»╪▒ ╪¡╪º┘ä ╪º┘å╪¼╪º┘à..."
                  : confirmAction.type === "close"
                  ? "┘à╪«╪¬┘ê┘à┘ç ┌⌐╪▒╪»┘å"
                  : confirmAction.caseItem.isUrgent
                  ? "╪«╪º╪▒╪¼ ┌⌐╪▒╪»┘å ╪º╪▓ ╪¡╪º┘ä╪¬ ╪╢╪▒┘ê╪▒█î"
                  : "╪¬╪º█î█î╪» ╪╢╪▒┘ê╪▒█î╪¬"}
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
          selectedStatuses={selectedStatuses}
          onToggleStatus={toggleStatusFilter}
          onClearAll={clearAllFilters}
        />
      )}

      {editingCase && (
        
        <EditCaseModal
          caseItem={editingCase}
          onClose={() => setEditingCase(null)}
          onSaved={(updated) => {
            // ┘ü┘é╪╖ ┘ç┘à┘ê┘å █î┘ç ┘╛╪▒┘ê┘å╪»┘ç ╪▒┘ê ╪¬┘ê ┘ä█î╪│╪¬ ╪¿╪º ┘å╪│╪«┘ç ╪¼╪»█î╪»╪┤ ╪¼╪º█î┌»╪▓█î┘å ┌⌐┘å
            setAllCases((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
          }}
        />
      )}

      {/* ┘╛█î╪º┘à ┘à┘ê┘é╪¬ ┘╛╪º█î█î┘å ╪╡┘ü╪¡┘ç ΓÇö ╪«┘ê╪»╪┤ ╪¿╪╣╪» ╪º╪▓ █│ ╪½╪º┘å█î┘ç ┘à╪¡┘ê ┘à█îΓÇî╪┤┘ç */}
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
