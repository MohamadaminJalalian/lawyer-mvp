"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Eye,
  Filter,
  CalendarDays,
} from "lucide-react";
import CaseDetailsModal from "./CaseDetailsModal";
import DateRangePicker from "./DateRangePicker";
import type { DateObject } from "react-multi-date-picker";
export default function ImportantCases() {
  const [selectedCase, setSelectedCase] = useState<(typeof cases)[number] | null>(
    null
  );
  const [rowTooltip, setRowTooltip] = useState<{ top: number; left: number } | null>(
    null
  );

  const [search, setSearch] = useState("");

  const [selectedRange, setSelectedRange] = useState<DateObject[]>([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toEnglishDigits = (value: string) =>
    value.replace(/[۰-۹]/g, (d) =>
      "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()
    );

  const cases = [
    {
      id: "2548",
      client: "محمد احمدی",
      category: "ملکی",
      subject: "خلع ید",
      date: "1405/03/12",
      status: "فعال",
    },
    {
      id: "2549",
      client: "علی رضایی",
      category: "کیفری",
      subject: "کلاهبرداری",
      date: "1405/03/15",
      status: "مختومه",
    },
    {
      id: "2550",
      client: "زهرا کریمی",
      category: "خانواده",
      subject: "طلاق",
      date: "1405/03/20",
      status: "بایگانی",
    },
  ];

  const categories = [
    "ملکی",
    "کیفری",
    "خانواده",
    "مهریه",
    "نفقه",
    "ارث",
    "چک",
    "کلاهبرداری",
  ];

  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.id.includes(search) ||
      item.client.includes(search) ||
      item.subject.includes(search);

    const matchesStatus =
      selectedStatus === "" ||
      item.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "" ||
      item.category === selectedCategory;

      const matchesDate =
  selectedRange.length < 2
    ? true
    : (() => {
        const itemDate = item.date.replace(/\//g, "");

       const from = toEnglishDigits(
  selectedRange[0].format("YYYYMMDD")
);

const to = toEnglishDigits(
  selectedRange[1].format("YYYYMMDD")
);

        console.log("itemDate:", itemDate);
        console.log("from:", from);
        console.log("to:", to);

        return itemDate >= from && itemDate <= to;
      })();

    return (
  matchesSearch &&
  matchesStatus &&
  matchesCategory &&
  matchesDate
);
  });

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCases = filteredCases.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <>
      <section className="mt-8 flex h-full flex-col rounded-xl border border-[#e5e0d6] bg-white p-4 sm:p-5">

        <h2 className="mb-4 text-lg font-bold text-neutral-900">
          پرونده‌های مهم
        </h2>

        <div className="mb-6 flex items-center gap-3">

          <div className="relative min-w-0 flex-1 sm:max-w-[372px]">

            <Search
              size={20}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a9762f]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس شماره پرونده، نام موکل یا موضوع"
              className="
                w-full
                rounded-xl
                border
                border-[#ddd5c8]
                bg-white
                py-2.5
                pr-12
                pl-4
                text-sm
                outline-none
                focus:border-[#a9762f]
              "
            />

          </div>

<div className="group relative inline-flex shrink-0">

  <button
    onClick={() => setFilterModalOpen(true)}
    className="
      flex
      items-center
      justify-center
      rounded-xl
      border
      border-[#ddd5c8]
      bg-white
      px-4
      py-2.5
      transition
      hover:bg-[#f8f5ef]
    "
  >
    <Filter
      size={20}
      className="text-[#a9762f]"
    />
  </button>

  <span
    className="
      pointer-events-none
      absolute
      right-full
      top-1/2
      mr-3
      -translate-y-1/2
      whitespace-nowrap
      rounded-lg
      bg-[#2b2b2b]
      px-3
      py-2
      text-xs
      text-white
      opacity-0
      transition-all
      duration-200
      group-hover:opacity-100
    "
  >
    فیلترها
  </span>

</div>

        </div>

        {filterModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-xl">

              <div className="flex items-center justify-between border-b border-[#ece7dd] px-4 py-4 sm:px-8 sm:py-6">

                <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                  فیلترها
                </h3>

                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="text-3xl text-slate-500 transition hover:text-[#a9762f]"
                >
                  ×
                </button>

              </div>

              <div className="space-y-8 p-4 sm:p-8">

<div>

  <p className="mb-4 text-lg font-semibold">
    بازه تاریخ تشکیل پرونده
  </p>

  <DateRangePicker
  value={selectedRange}
  onChange={setSelectedRange}
/>

</div>
                                {/* وضعیت */}

                <div>

                  <p className="mb-4 text-lg font-semibold">
                    وضعیت پرونده
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {["فعال", "مختومه", "بایگانی "].map((status) => (

                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`
                          rounded-lg
                          px-5
                          py-2.5
                          text-sm
                          transition

                          ${
                            selectedStatus === status
                              ? "bg-[#a9762f] text-white"
                              : "border border-[#ddd5c8] bg-[#f1efe6] text-[#7a6b52] hover:bg-[#e8e2d4]"
                          }
                        `}
                      >
                        {status}
                      </button>

                    ))}

                  </div>

                </div>

                {/* دسته بندی */}

                <div>

                  <p className="mb-4 text-lg font-semibold">
                    دسته‌بندی
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {categories.map((category) => (

                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                          rounded-lg
                          px-4
                          py-2.5
                          text-sm
                          transition

                          ${
                            selectedCategory === category
                              ? "bg-[#a9762f] text-white"
                              : "border border-[#ddd5c8] bg-[#f1efe6] text-[#7a6b52] hover:bg-[#e8e2d4]"
                          }
                        `}
                      >
                        {category}
                      </button>

                    ))}

                  </div>

                </div>

                {/* Buttons */}

                <div className="flex flex-col gap-3 border-t border-[#ece7dd] pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    onClick={() => {
                      setSelectedStatus("");
                      setSelectedCategory("");
                      
                      
                      setSearch("");
                      setSelectedRange([]);
                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#ddd5c8]
                      bg-white
                      px-6
                      py-3
                      text-[#a9762f]
                      transition
                      hover:bg-[#f8f3e8]
                      sm:w-auto
                    "
                  >
                    حذف فیلترها
                  </button>

                  <button
                    onClick={() => setFilterModalOpen(false)}
                    className="
                      w-full
                      rounded-xl
                      bg-[#a9762f]
                      px-7
                      py-3
                      text-white
                      transition
                      hover:bg-[#946727]
                      sm:w-auto
                    "
                  >
                    اعمال فیلتر
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* Table (دسکتاپ) */}

        <div className="hidden max-h-[272px] overflow-auto rounded-xl border border-[#e5e0d6] sm:block">

          <table className="w-full min-w-[760px] text-right">

            <thead className="sticky top-0 z-10 bg-[#f5f1e8]">

              <tr>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  شماره پرونده
                </th>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  نام موکل
                </th>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  دسته‌بندی
                </th>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  موضوع
                </th>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  تاریخ ثبت پرونده
                </th>

                <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                  وضعیت
                </th>

                <th className="px-5 py-3 text-center text-sm font-semibold text-neutral-700">
                  عملیات
                </th>

              </tr>

            </thead>

            <tbody>             
               {paginatedCases.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-[#ece7dd] transition-colors hover:bg-[#faf8f4]"
                >

                  {/* شماره پرونده */}

                  <td className="px-5 py-4">

                    <span
                      className="rounded border border-[#E4D3B0] bg-[#FCF6EA] px-2 py-1 font-mono text-xs text-[#8A5D1F]"
                      style={{ borderInlineStart: "3px solid #A9762F" }}
                    >
                      {item.id}
                    </span>

                  </td>

                  {/* نام موکل */}

                  <td className="px-5 py-4 text-sm text-[#4b4b4b]">
                    {item.client}
                  </td>

                  {/* دسته بندی */}

                  <td className="px-5 py-4 text-sm text-[#4b4b4b]">
                    {item.category}
                  </td>

                  {/* موضوع */}

                  <td className="px-5 py-4 text-sm text-[#4b4b4b]">
                    {item.subject}
                  </td>

                  {/* تاریخ */}

                  <td className="px-5 py-4 text-sm text-[#4b4b4b]">
                    {item.date}
                  </td>

                  {/* وضعیت */}

                  <td className="px-5 py-4">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium

                        ${
                          item.status === "فعال"
                            ? "bg-[#e8f5ec] text-[#3d8b5a]"
                            : item.status === "مختومه"
                            ? "bg-[#efefef] text-[#6d6d6d]"
                            : "bg-[#fff4d8] text-[#a9762f]"
                        }
                      `}
                    >
                      {item.status}
                    </span>

                  </td>

                  {/* عملیات */}

                  <td className="px-5 py-4 text-center">

                    <div className="inline-flex">
                      <button
                        onClick={() => setSelectedCase(item)}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setRowTooltip({
                            top: rect.top + rect.height / 2,
                            left: rect.left,
                          });
                        }}
                        onMouseLeave={() => setRowTooltip(null)}
                        className="
                          rounded-lg
                          p-2
                          text-[#8a6a2f]
                          transition
                          hover:bg-[#f1efe6]
                        "
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                  </td>

                </tr>

              ))}

              {filteredCases.length === 0 && (

                <tr>

                  <td
                    colSpan={7}
                    className="p-8 text-center text-[#8b8b8b]"
                  >
                    هیچ پرونده‌ای یافت نشد.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* کارت‌ها (موبایل) */}

        <div className="space-y-3 sm:hidden">

          {paginatedCases.map((item) => (

            <div
              key={item.id}
              className="rounded-xl border border-[#e5e0d6] bg-white p-4"
            >

              {/* شماره پرونده */}

              <div className="mb-1 text-right font-mono text-sm text-[#8A5D1F]">
                {item.id}
              </div>

              {/* نام موکل */}

              <div className="mb-3 text-right font-bold text-neutral-900">
                {item.client}
              </div>

              {/* ردیف‌های برچسب:مقدار */}

              <div className="mb-3 space-y-1.5">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a8175]">دسته‌بندی</span>
                  <span className="text-[#4b4b4b]">{item.category}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a8175]">موضوع</span>
                  <span className="text-[#4b4b4b]">{item.subject}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a8175]">تاریخ ثبت پرونده</span>
                  <span className="text-[#4b4b4b]">{item.date}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a8175]">وضعیت</span>
                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-0.5
                      text-xs
                      font-medium
                      ${
                        item.status === "فعال"
                          ? "bg-[#e8f5ec] text-[#3d8b5a]"
                          : item.status === "مختومه"
                          ? "bg-[#efefef] text-[#6d6d6d]"
                          : "bg-[#fff4d8] text-[#a9762f]"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

              </div>

              {/* خط جداکننده + دکمه‌ی مشاهده، وسط‌چین */}

              <div className="flex items-center justify-center gap-6 border-t border-[#ece7dd] pt-3 text-[#8a6a2f]">

                <button
                  onClick={() => setSelectedCase(item)}
                  className="transition hover:text-[#a9762f]"
                >
                  <Eye size={18} />
                </button>

              </div>

            </div>

          ))}

          {filteredCases.length === 0 && (
            <p className="p-4 text-center text-sm text-[#8b8b8b]">
              هیچ پرونده‌ای یافت نشد.
            </p>
          )}

        </div>

        {filteredCases.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-[#ddd5c8] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبلی
            </button>

            <span className="text-sm text-[#8a8175]">
              صفحه {safePage} از {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safePage === totalPages}
              className="rounded-lg border border-[#ddd5c8] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              بعدی
            </button>
          </div>
        )}

      </section>

      <CaseDetailsModal
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      {rowTooltip &&
        createPortal(
          <span
            className="pointer-events-none fixed z-50 -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#2b2b2b] px-3 py-2 text-xs text-white"
            style={{ top: rowTooltip.top, left: rowTooltip.left - 12 }}
          >
            مشاهده پرونده
          </span>,
          document.body
        )}

    </>

  );

}
            