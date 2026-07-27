"use client";

import { X, ImageOff, FileText } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { TrashFile } from "@/types/trash";
import { formatJalali } from "@/lib/utils";

type Props = {
  file: TrashFile;
  onClose: () => void;
};

export default function FilePreviewModal({ file, onClose }: Props) {
  return (
    <Modal onClose={onClose} maxWidthClass="max-w-md">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#262420] text-base">
            {file.fileName}
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

        <div className="flex items-center justify-center bg-[#F7F5F0] border border-[#E4E1D8] rounded-lg h-52 mb-4">
          {file.fileKind === "IMAGE" ? (
            <div className="flex flex-col items-center gap-2 text-[#B4B2A9]">
              <ImageOff size={36} />
              <span className="text-xs">پیش‌نمایش تصویر در دسترس نیست</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#B4B2A9]">
              <FileText size={36} />
              <span className="text-xs">پیش‌نمایش سند در دسترس نیست</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#8C8A80]">موکل</span>
            <span className="text-[#262420]">{file.clientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8C8A80]">پرونده</span>
            <span className="text-[#262420]">{file.caseTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8C8A80]">شماره پرونده</span>
            <span className="text-[#262420] font-mono">
              {file.caseNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8C8A80]">تاریخ حذف</span>
            <span className="text-[#262420]">
              {formatJalali(file.deletedAt)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}