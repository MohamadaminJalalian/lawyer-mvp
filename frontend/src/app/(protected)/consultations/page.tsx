"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  FilterX,
} from "lucide-react";

import ConsultationTable from "./_components/ConsultationTable";
import NewConsultationModal from "./_components/NewConsultationModal";

import { mockConsultations } from "./mocks/consultations.mock";

export default function ConsultationsPage() {
  const [showNewConsultation, setShowNewConsultation] =
    useState(false);
const [consultations, setConsultations] =
  useState(mockConsultations);
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-[#8F8877]">
            داشبورد / جلسات مشاوره
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#262420]">
            جلسات مشاوره
          </h1>

          <p className="mt-2 text-[#7D7768]">
            ثبت و مدیریت جلسات مشاوره با موکلین
          </p>

        </div>

        <button
          onClick={() =>
            setShowNewConsultation(true)
          }
          className="
            rounded-xl
            bg-[#A9762F]
            px-5
            py-3
            font-medium
            text-white
            transition-colors
            hover:bg-[#946A2A]
          "
        >
          + افزودن جلسه جدید
        </button>

      </div>

      {/* Search Card */}

      <div
        className="
          rounded-2xl
          border
          border-[#ECE7DB]
          bg-white
          p-6
          shadow-sm
        "
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Client */}

          <div>

            <label className="mb-2 block font-medium text-[#444]">
              نام موکل
            </label>

            <div className="relative">

              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="جستجو بر اساس نام موکل..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E8E3D7]
                  pr-11
                  pl-4
                  outline-none
                  focus:border-[#A9762F]
                "
              />

            </div>

          </div>

          {/* Date */}

          <div>

            <label className="mb-2 block font-medium text-[#444]">
              تاریخ جلسه
            </label>

            <div className="relative">

              <Calendar
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="مثلاً 1405/05/18"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E8E3D7]
                  pr-11
                  pl-4
                  outline-none
                  focus:border-[#A9762F]
                "
              />

            </div>

          </div>

          {/* Reset */}

          <div className="flex items-end">

            <button
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#E8E3D7]
                hover:bg-[#FAF8F4]
              "
            >
              <FilterX size={18} />
              پاک کردن فیلترها
            </button>

          </div>

        </div>

      </div>
            {/* جدول جلسات */}

      <div>

        <h2 className="mb-4 text-lg font-bold text-[#262420]">
          جلسات ثبت‌شده
        </h2>

        <ConsultationTable
  consultations={consultations}
/>

      </div>

      {/* مودال ثبت جلسه */}

      {showNewConsultation && (
  <NewConsultationModal
    onClose={() => setShowNewConsultation(false)}
    onSave={(consultation) => {
      setConsultations((prev) => [
        {
          id: Date.now(),
          clientName: consultation.clientName,
          phone: consultation.phone,
          date: consultation.sessionDate,
          weekday: "ثبت شده",
          time: consultation.sessionTime,
          status: "scheduled",
        },
        ...prev,
      ]);
    }}
  />
)}

    </div>
  );
}