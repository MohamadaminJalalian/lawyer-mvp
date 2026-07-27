"use client";

import { useState } from "react";
import { X, FileX2 } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useSecretaries } from "@/context/SecretaryContext";
import { Secretary } from "@/types/secretary";

type Props = {
  secretary: Secretary;
  onClose: () => void;
};

export default function SecretaryPermissionsModal({
  secretary,
  onClose,
}: Props) {
  const { updatePermissions } = useSecretaries();
  const [canDeleteFiles, setCanDeleteFiles] = useState(
    secretary.permissions.canDeleteFiles
  );

  function handleSave() {
    updatePermissions(secretary.id, { canDeleteFiles });
    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-[#262420] text-base">
            سطح دسترسی «{secretary.name}»
          </h2>

          <button
            type="button"
            onClick={onClose}
            title="بستن"
            className="text-[#8C8A80] hover:text-[#262420] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-[#8C8A80] mb-4">
          دسترسی‌های این منشی را مشخص کنید.
        </p>

        <label className="flex items-start gap-3 bg-[#F7F5F0] border border-[#E4E1D8] rounded-lg p-3.5 cursor-pointer select-none mb-5">
          <input
            type="checkbox"
            checked={canDeleteFiles}
            onChange={(e) => setCanDeleteFiles(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#A9762F]"
          />
          <span>
            <span className="flex items-center gap-2 text-sm text-[#262420] font-medium">
              <FileX2 size={16} className="text-[#8C8A80]" />
              دسترسی حذف فایل از پرونده‌ها
            </span>
            <span className="block text-xs text-[#8C8A80] mt-1">
              در صورت فعال بودن، این منشی می‌تواند فایل‌های پرونده‌ها را حذف
              کند و به سطل زباله دسترسی داشته باشد.
            </span>
          </span>
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
          >
            ذخیره
          </button>
        </div>
      </div>
    </Modal>
  );
}