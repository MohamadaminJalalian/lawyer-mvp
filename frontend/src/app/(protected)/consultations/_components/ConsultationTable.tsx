"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import ConsultationStatusBadge from "./ConsultationStatusBadge";
import { Consultation } from "../types/consultation.types";

interface Props {
  consultations: Consultation[];
}

export default function ConsultationTable({
  consultations,
}: Props) {
  return (
    <div className="hidden sm:block bg-white border border-[#E4E1D8] rounded-xl overflow-hidden">

      <table className="w-full border-collapse text-right text-sm">

        <thead>

          <tr className="bg-[#F1EFE6]">

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              نام موکل
            </th>

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              شماره تماس
            </th>

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              تاریخ جلسه
            </th>

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              روز
            </th>

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              ساعت
            </th>

            <th className="px-4 py-3 font-medium text-[#6B6A63]">
              وضعیت
            </th>

            <th className="px-4 py-3 text-center font-medium text-[#6B6A63]">
              عملیات
            </th>

          </tr>

        </thead>

        <tbody>

          {consultations.map((item) => (

            <tr
              key={item.id}
              className="border-t border-[#EDEBE2] hover:bg-[#FAF9F5]"
            >

              <td className="px-4 py-4 font-medium text-[#262420]">
                {item.clientName}
              </td>

              <td className="px-4 py-4">
                {item.phone}
              </td>

              <td className="px-4 py-4">
                {item.date}
              </td>

              <td className="px-4 py-4">
                {item.weekday}
              </td>

              <td className="px-4 py-4">
                {item.time}
              </td>

              <td className="px-4 py-4">
                <ConsultationStatusBadge
                  status={item.status}
                />
              </td>

              <td className="px-4 py-4">

                <div className="flex justify-center gap-4 text-[#8C8A80]">

                  <button
                    className="hover:text-[#A9762F]"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    className="hover:text-[#A9762F]"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="hover:text-[#C94040]"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}