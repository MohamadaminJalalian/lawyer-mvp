"use client";

import { FileX2, ShieldCheck, ShieldOff } from "lucide-react";

import { Secretary } from "@/types/secretary";

type Props = {
  secretary: Secretary;
};

export default function MyPermissionsCard({ secretary }: Props) {
  const canDeleteFiles = secretary.permissions.canDeleteFiles;

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-5">
      <h2 className="font-bold text-[#262420] text-sm mb-1">سطح دسترسی من</h2>
      <p className="text-xs text-[#8C8A80] mb-4">
        دسترسی‌های شما توسط وکیل تعیین می‌شود.
      </p>

      <div className="flex items-center justify-between bg-[#F7F5F0] border border-[#E4E1D8] rounded-lg p-3.5">
        <span className="flex items-center gap-2 text-sm text-[#262420]">
          <FileX2 size={16} className="text-[#8C8A80]" />
          دسترسی حذف فایل از پرونده‌ها
        </span>

        {canDeleteFiles ? (
          <span className="flex items-center gap-1.5 text-xs text-[#2F6B4F] font-medium">
            <ShieldCheck size={16} />
            فعال
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-[#8C8A80] font-medium">
            <ShieldOff size={16} />
            غیرفعال
          </span>
        )}
      </div>
    </div>
  );
}