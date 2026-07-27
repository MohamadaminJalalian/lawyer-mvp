"use client";

import { Pencil, X } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Client } from "@/types/client";
import { formatJalali } from "@/lib/utils";

type Props = {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
};

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[#EDEBE2] last:border-b-0">
      <span className="text-sm text-[#8C8A80] shrink-0">{label}</span>
      <span className="text-sm text-[#262420] text-left break-words">
        {value || "-"}
      </span>
    </div>
  );
}

export default function ClientViewModal({ client, onClose, onEdit }: Props) {
  return (
    <Modal onClose={onClose} maxWidthClass="max-w-lg">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#262420] text-base">جزئیات موکل</h2>

          <button
            type="button"
            onClick={onClose}
            title="بستن"
            className="text-[#8C8A80] hover:text-[#262420] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <Row
            label="نام و نام‌خانوادگی"
            value={`${client.firstName} ${client.lastName}`}
          />
          <Row label="کد ملی" value={client.nationalCode} />
          <Row label="شماره موبایل" value={client.mobile} />
          <Row label="تلفن ثابت" value={client.phone} />
          <Row label="آدرس" value={client.address} />
          <Row label="توضیحات" value={client.description} />
          <Row label="تعداد پرونده‌ها" value={client.caseCount ?? 0} />
          <Row label="تاریخ ثبت" value={formatJalali(client.createdAt)} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            بستن
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="ویرایش موکل"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
          >
            <Pencil size={15} />
            ویرایش
          </button>
        </div>
      </div>
    </Modal>
  );
}