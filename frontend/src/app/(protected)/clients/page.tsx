"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

import { useClients } from "@/context/ClientContext";
import SearchBox from "@/components/ui/SearchBox";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientsTableSkeleton from "@/components/clients/ClientsTableSkeleton";
import ClientFormModal from "@/components/clients/ClientFormModal";
import ClientViewModal from "@/components/clients/ClientViewModal";
import DateRangeModal from "@/components/clients/DateRangeModal";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Client } from "@/types/client";
import { parseJalaliDate } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const { clients } = useClients();

  const [initialLoading, setInitialLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fromDate = useMemo(() => parseJalaliDate(fromDateInput), [fromDateInput]);
  const toDate = useMemo(() => parseJalaliDate(toDateInput), [toDateInput]);

  const filteredClients = useMemo(() => {
    const text = search.toLowerCase();

    return clients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const matchesText =
        !text ||
        fullName.includes(text) ||
        client.nationalCode.includes(text) ||
        client.mobile.includes(text);

      if (!matchesText) return false;

      const createdAt = new Date(client.createdAt);

      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        if (createdAt < start) return false;
      }

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (createdAt > end) return false;
      }

      return true;
    });
  }, [clients, search, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  const hasActiveFilter = Boolean(search || fromDateInput || toDateInput);

  function handleClearFilter() {
    setSearchInput("");
    setSearch("");
    setFromDateInput("");
    setToDateInput("");
    setPage(1);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Breadcrumb trail={["داشبورد", "موکل‌ها"]} title="لیست موکل‌ها" />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 mb-4">
        <SearchBox
          value={searchInput}
          onChange={setSearchInput}
          placeholder="نام، کد ملی یا شماره موبایل موکل را وارد کنید"
        />

        <button
          type="button"
          onClick={() => setDateModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors ${
            fromDateInput || toDateInput
              ? "bg-[#A9762F]/10 border-[#A9762F] text-[#A9762F]"
              : "bg-white border-[#E4E1D8] text-[#4B4A44] hover:bg-[#FAF9F5]"
          }`}
        >
          <Calendar size={16} />
          جست‌وجو بر اساس تاریخ
        </button>

        {hasActiveFilter && (
          <button
            onClick={handleClearFilter}
            className="px-3 py-2 text-sm text-[#A32D2D] hover:underline whitespace-nowrap"
          >
            پاک کردن فیلترها
          </button>
        )}

        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          className="sm:mr-auto px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors whitespace-nowrap"
        >
          + ثبت موکل جدید
        </button>
      </div>

      {initialLoading ? (
        <ClientsTableSkeleton />
      ) : filteredClients.length === 0 ? (
        <p className="mt-6 text-[#8C8A80] text-sm">
          {hasActiveFilter ? "موکلی با اطلاعات واردشده پیدا نشد." : "هنوز موکلی ثبت نشده است."}
        </p>
      ) : (
        <>
          <ClientsTable
            clients={paginatedClients}
            onView={setViewingClient}
            onEdit={setEditingClient}
          />

          <div className="flex items-center justify-between mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              قبلی
            </button>

            <span className="text-sm text-[#6B6A63]">
              صفحه {currentPage} از {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              بعدی
            </button>
          </div>
        </>
      )}

      {dateModalOpen && (
        <DateRangeModal
          initialFrom={fromDateInput}
          initialTo={toDateInput}
          onClose={() => setDateModalOpen(false)}
          onApply={(from, to) => {
            setFromDateInput(from);
            setToDateInput(to);
          }}
        />
      )}

      {newModalOpen && (
        <ClientFormModal onClose={() => setNewModalOpen(false)} />
      )}

      {editingClient && (
        <ClientFormModal
          clientId={editingClient.id}
          initialValues={editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}

      {viewingClient && (
        <ClientViewModal
          client={viewingClient}
          onClose={() => setViewingClient(null)}
          onEdit={() => {
            setEditingClient(viewingClient);
            setViewingClient(null);
          }}
        />
      )}
    </div>
  );
}
