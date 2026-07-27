"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Eye, Search, Filter } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import type { DateObject } from "react-multi-date-picker";

export default function ImportantNotices() {
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateObject[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [rowTooltip, setRowTooltip] = useState<{ top: number; left: number } | null>(
    null
  );

  const toEnglishDigits = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

  const notices = [
    {
      id: 1,
      title: "جلسه دادگاه پرونده احمدی",
      date: "1405/03/20",
    },
    {
      id: 2,
      title: "ارسال لایحه دفاعیه",
      date: "1405/03/22",
    },
    {
      id: 3,
      title: "تمدید قرارداد موکل",
      date: "1405/03/25",
    },
  ];

  const filteredNotices = notices.filter((item) => {
    const matchesSearch = search === "" || item.title.includes(search);

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

  return (
    <>
    <section className="mt-8 flex h-full flex-col rounded-xl border border-[#e5e0d6] bg-white p-4 sm:p-5">
      {/* عنوان */}
      <h2 className="mb-4 text-lg font-bold text-neutral-900">
        اطلاعیه‌های مهم
      </h2>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            size={20}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a9762f]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس عنوان"
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
            <Filter size={20} className="text-[#a9762f]" />
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
              <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">فیلترها</h3>

              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-3xl text-slate-500 transition hover:text-[#a9762f]"
              >
                ×
              </button>
            </div>

            <div className="space-y-8 p-4 sm:p-8">
              <div>
                <p className="mb-4 text-lg font-semibold">بازه تاریخ موعد</p>

                <DateRangePicker
                  value={selectedRange}
                  onChange={setSelectedRange}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-[#ece7dd] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => {
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

      {/* جدول */}
      <div className="max-h-[272px] overflow-auto rounded-xl border border-[#e5e0d6]">
        <table className="w-full min-w-[420px] text-right sm:min-w-0">
          <thead className="sticky top-0 z-10 bg-[#f5f1e8]">
            <tr>
              <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                عنوان
              </th>

              <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                موعد تاریخ
              </th>

              <th className="px-5 py-3 text-center text-sm font-semibold text-neutral-700">
                عملیات
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredNotices.map((notice) => (
              <tr
                key={notice.id}
                className="border-t border-[#ece7dd] transition-colors hover:bg-[#faf8f4]"
              >
                {/* عنوان */}
                <td className="px-5 py-4 text-sm text-[#4b4b4b]">
                  {notice.title}
                </td>

                {/* موعد تاریخ */}
                <td className="px-5 py-4 whitespace-nowrap text-sm text-[#4b4b4b]">
                  {notice.date}
                </td>

                {/* عملیات */}
                <td className="px-5 py-4 text-center">
                  <div className="inline-flex">
                    <button
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

            {filteredNotices.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[#8b8b8b]">
                  هیچ اطلاعیه‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>

    {rowTooltip &&
      createPortal(
        <span
          className="pointer-events-none fixed z-50 -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#2b2b2b] px-3 py-2 text-xs text-white"
          style={{ top: rowTooltip.top, left: rowTooltip.left - 12 }}
        >
          مشاهده اطلاعیه
        </span>,
        document.body
      )}
    </>
  );
}
