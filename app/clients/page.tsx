"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useClients } from "@/context/ClientContext";
import SearchBox from "@/components/ui/SearchBox";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientsTableSkeleton from "@/components/clients/ClientsTableSkeleton";
import Breadcrumb from "@/components/layout/Breadcrumb";

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const { clients, deleteClient } = useClients();

  const [initialLoading, setInitialLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

  const filteredClients = useMemo(() => {
    const text = search.toLowerCase();
    if (!text) return clients;

    return clients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return (
        fullName.includes(text) ||
        client.nationalCode.includes(text) ||
        client.mobile.includes(text)
      );
    });
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleClearFilter() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Breadcrumb trail={["داشبورد", "موکل‌ها"]} title="لیست موکل‌ها" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-4">
        <SearchBox
          value={searchInput}
          onChange={setSearchInput}
          placeholder="نام، کد ملی یا شماره موبایل موکل را وارد کنید"
        />

        {search && (
          <button
            onClick={handleClearFilter}
            className="px-3 py-2 text-sm text-[#A32D2D] hover:underline whitespace-nowrap"
          >
            پاک کردن جست‌وجو
          </button>
        )}

        <Link
          href="/clients/new"
          className="sm:mr-auto px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors whitespace-nowrap"
        >
          + ثبت موکل جدید
        </Link>
      </div>

      {initialLoading ? (
        <ClientsTableSkeleton />
      ) : filteredClients.length === 0 ? (
        <p className="mt-6 text-[#8C8A80] text-sm">
          {search ? "موکلی با اطلاعات واردشده پیدا نشد." : "هنوز موکلی ثبت نشده است."}
        </p>
      ) : (
        <>
          <ClientsTable clients={paginatedClients} onDelete={deleteClient} />

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
    </div>
  );
}