"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Filter,
  CalendarDays,
} from "lucide-react";
import CaseDetailsModal from "./CaseDetailsModal";
import DateRangePicker from "./DateRangePicker";

export default function ImportantCases() {
  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

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

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    );
  });

  return (
    <>
      <section className="mt-8 rounded-xl border border-[#e5e0d6] bg-white p-5">

        <h2 className="mb-4 text-lg font-bold text-neutral-900">
          پرونده‌های مهم
        </h2>

        <div className="mb-6 flex items-center gap-3">

          <div className="relative w-full max-w-md">

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

<div className="group relative inline-flex">

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

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-2xl rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-xl">

              <div className="flex items-center justify-between border-b border-[#ece7dd] px-8 py-6">

                <h3 className="text-2xl font-bold text-neutral-900">
                  فیلترها
                </h3>

                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="text-3xl text-slate-500 transition hover:text-[#a9762f]"
                >
                  ×
                </button>

              </div>

              <div className="space-y-8 p-8">

<div>

  <p className="mb-4 text-lg font-semibold">
    بازه تاریخ تشکیل پرونده
  </p>

  <DateRangePicker />

</div>
                                {/* وضعیت */}

                <div>

                  <p className="mb-4 text-lg font-semibold">
                    وضعیت پرونده
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {["فعال", "مختومه", "بایگانی شده"].map((status) => (

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

                <div className="flex items-center justify-between border-t border-[#ece7dd] pt-6">

                  <button
                    onClick={() => {
                      setSelectedStatus("");
                      setSelectedCategory("");
                      setFromDate("");
                      setToDate("");
                      setSearch("");
                    }}
                    className="
                      rounded-xl
                      border
                      border-[#ddd5c8]
                      bg-white
                      px-6
                      py-3
                      text-[#a9762f]
                      transition
                      hover:bg-[#f8f3e8]
                    "
                  >
                    حذف فیلترها
                  </button>

                  <button
                    onClick={() => setFilterModalOpen(false)}
                    className="
                      rounded-xl
                      bg-[#a9762f]
                      px-7
                      py-3
                      text-white
                      transition
                      hover:bg-[#946727]
                    "
                  >
                    اعمال فیلتر
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* Table */}

        <div className="overflow-visible rounded-xl border border-[#e5e0d6]">

          <table className="w-full text-right">

            <thead className="bg-[#f5f1e8]">

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
               {filteredCases.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-[#ece7dd] transition-colors hover:bg-[#faf8f4]"
                >

                  {/* شماره پرونده */}

                  <td className="px-5 py-4">

                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-md
                        border
                        border-[#d7b97a]
                        bg-[#fffaf0]
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-[#8a6a2f]
                      "
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

                    <div className="group relative inline-flex">

                      <button
                        onClick={() => setOpenModal(true)}
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
                        مشاهده پرونده
                      </span>

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

      </section>

      <CaseDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

    </>

  );

}
            