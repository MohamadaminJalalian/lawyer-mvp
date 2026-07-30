"use client";

import { X, Calendar, User, FolderOpen, FileText, Star } from "lucide-react";
import type { NoticeListItem } from "./NoticesTable";

interface NoticeDetailsModalProps {
  open: boolean;
  notice: NoticeListItem | null;
  onClose: () => void;
}

export default function NoticeDetailsModal({
  open,
  notice,
  onClose,
}: NoticeDetailsModalProps) {
  if (!open || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ece7dd] px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              جزئیات اطلاعیه
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              شناسه اطلاعیه #{notice.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <InfoCard
              icon={<FileText size={18} />}
              title="عنوان"
              value={notice.title}
            />

            <InfoCard
              icon={<User size={18} />}
              title="نام موکل"
              value={notice.clientName}
            />

            <InfoCard
              icon={<FolderOpen size={18} />}
              title="دسته‌بندی"
              value={notice.category}
            />

            <InfoCard
              icon={<Calendar size={18} />}
              title="تاریخ موعد"
              value={notice.date}
            />

            <InfoCard
              icon={<Star size={18} />}
              title="وضعیت"
              value={notice.isImportant ? "ضروری" : "عادی"}
            />
          </div>

          {/* متن اطلاعیه */}

          <div className="rounded-xl border border-[#ece7dd] bg-[#faf8f4] p-5">

            <h3 className="mb-3 text-lg font-bold">
              متن اطلاعیه
            </h3>

            <p className="leading-8 text-neutral-700">
              {notice.description}
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-[#ece7dd] px-6 py-5">

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-[#a9762f]
              px-6
              py-2.5
              text-white
              transition
              hover:bg-[#946727]
            "
          >
            بستن
          </button>

        </div>

      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({
  icon,
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-[#ece7dd] bg-[#fcfbf8] p-4">

      <div className="mb-2 flex items-center gap-2 text-[#a9762f]">

        {icon}

        <span className="text-sm font-semibold">
          {title}
        </span>

      </div>

      <p className="text-neutral-700">
        {value}
      </p>

    </div>
  );
}