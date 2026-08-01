"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import type { DateObject } from "react-multi-date-picker";

import NoticesTable, { NoticeListItem } from "./NoticesTable";
import NoticeFormModal from "./NoticeFormModal";
import NoticeEditModal from "./NoticeEditModal";
import DateRangePicker from "../dashboard/DateRangePicker";

const initialNotices: NoticeListItem[] = [
  {
    id: 1,
    title: "جلسه دادگاه پرونده احمدی",
    clientName: "محمد احمدی",
    category: "اسناد",
    documentsCount: 3,
    date: "1405/03/20",
    isImportant: true,
    description:
      "حضور در جلسه دادگاه شعبه ۱۲ دادگاه حقوقی تهران ساعت ۹ صبح الزامی است.",
  },
  {
    id: 2,
    title: "ارسال لایحه دفاعیه",
    clientName: "علی رضایی",
    category: "جلسه",
    documentsCount: 0,
    date: "1405/03/22",
    isImportant: false,
    description: "لایحه دفاعیه باید قبل از پایان وقت اداری ارسال شود.",
  },
  {
    id: 3,
    title: "تمدید قرارداد موکل",
    clientName: "زهرا کریمی",
    category: "مالی",
    documentsCount: 2,
    date: "1405/03/25",
    isImportant: false,
    description: "قرارداد همکاری موکل تا پایان هفته تمدید گردد.",
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeListItem[]>(initialNotices);

  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateObject[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeListItem | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toEnglishDigits = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

  const filteredNotices = notices.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.title.includes(search) ||
      item.clientName.includes(search);

    const matchesDate =
      selectedRange.length < 2
        ? true
        : (() => {
            const itemDate = item.date.replace(/\//g, "");
            const from = toEnglishDigits(selectedRange[0].format("YYYYMMDD"));
            const to = toEnglishDigits(selectedRange[1].format("YYYYMMDD"));
            return itemDate >= from && itemDate <= to;
          })();

    return matchesSearch && matchesDate;
  });

  const activeFilterCount = selectedRange.length === 2 ? 1 : 0;

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedNotices = filteredNotices.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  function handleAddNotice(notice: Omit<NoticeListItem, "id">) {
    setNotices((prev) => [{ ...notice, id: Date.now() }, ...prev]);
  }

  function handleToggleImportant(id: number) {
    setNotices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isImportant: !item.isImportant } : item
      )
    );
  }

  function handleEdit(notice: NoticeListItem) {
    setEditingNotice(notice);
    setEditModalOpen(true);
  }

  function handleChange(field: keyof NoticeListItem, value: string) {
    setEditingNotice((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function handleSave() {
    if (!editingNotice) return;

    setNotices((prev) =>
      prev.map((item) => (item.id === editingNotice.id ? editingNotice : item))
    );

    setEditModalOpen(false);
    setEditingNotice(null);
  }

  function clearAllFilters() {
    setSearch("");
    setSelectedRange([]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8" dir="rtl">
      {/* هدر */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-0.5 text-xs text-[#8C8A80]">
            داشبورد / اطلاعیه‌ها
          </div>
          <h1 className="text-xl font-bold text-[#262420]">اطلاعیه‌ها</h1>
        </div>
      </div>

      {/* جستجو + فیلتر + دکمه‌ی ثبت */}
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="relative min-w-0 flex-1 sm:w-93 sm:flex-none">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس عنوان یا نام موکل"
              className="w-full rounded-lg border border-[#E4E1D8] bg-white p-2 pr-9 text-right text-sm placeholder:text-[#8C8A80] focus:border-[#A9762F] focus:outline-none"
            />
            <Search
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8A80]"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className="relative flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E4E1D8] bg-white px-3 py-2 text-sm text-[#4B4A44] transition-colors hover:border-[#A9762F]"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#A9762F] text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFormModalOpen(true)}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#A9762F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#946A2A] sm:mr-auto"
        >
          <Plus size={16} />
          ثبت اطلاعیه جدید
        </button>

        {(search || activeFilterCount > 0) && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm text-[#A32D2D] hover:underline"
          >
            حذف فیلترها
          </button>
        )}
      </div>


      {/* مودال فیلتر (فقط بازه‌ی تاریخ موعد) */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="text-xl font-bold text-[#262420]">فیلترها</h2>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-3xl text-[#8C8A80]"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-[#262420]">
                  بازه تاریخ موعد
                </p>
                <DateRangePicker
                  value={selectedRange}
                  onChange={setSelectedRange}
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#EDEBE2] pt-5">
                <button
                  onClick={clearAllFilters}
                  className="rounded-xl border border-[#E4E1D8] px-5 py-2 text-sm text-[#A9762F]"
                >
                  حذف فیلترها
                </button>

                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="rounded-xl bg-[#A9762F] px-6 py-2 text-sm text-white"
                >
                  اعمال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* جدول */}
      <NoticesTable
        notices={paginatedNotices}
        onToggleImportant={handleToggleImportant}
        onEdit={handleEdit}
      />

      {filteredNotices.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-[#E4E1D8] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
            className="rounded-lg border border-[#E4E1D8] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}

      {formModalOpen && (
        <NoticeFormModal
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleAddNotice}
        />
      )}

      <NoticeEditModal
        open={editModalOpen}
        notice={editingNotice}
        onClose={() => {
          setEditModalOpen(false);
          setEditingNotice(null);
        }}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}
