"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useTrash } from "@/context/TrashContext";
import { TrashFile } from "@/types/trash";
import { formatJalali } from "@/lib/utils";
import FilePreviewModal from "./FilePreviewModal";

function FileMeta({ file }: { file: TrashFile }) {
  return (
    <div>
      <div className="text-[#262420] font-medium">{file.fileName}</div>
      <div className="text-xs text-[#8C8A80] mt-0.5">
        {file.clientName} · {file.caseTitle} · پرونده {file.caseNumber}
      </div>
    </div>
  );
}

export default function TrashCard() {
  const { trashFiles, restoreFile, permanentlyDeleteFile } = useTrash();

  const [previewFile, setPreviewFile] = useState<TrashFile | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TrashFile | null>(null);

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-5">
      <h2 className="font-bold text-[#262420] text-sm mb-4">
        سطل زباله پرونده‌ها
      </h2>

      {trashFiles.length === 0 ? (
        <p className="text-sm text-[#8C8A80]">سطل زباله خالی است.</p>
      ) : (
        <>
          <div className="hidden sm:block border border-[#E4E1D8] rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-right text-sm">
              <thead>
                <tr className="bg-[#F1EFE6]">
                  <th className="px-4 py-2.5 font-medium text-[#6B6A63]">
                    فایل حذف‌شده
                  </th>
                  <th className="px-4 py-2.5 w-[110px] font-medium text-[#6B6A63]">
                    تاریخ حذف
                  </th>
                  <th className="px-4 py-2.5 w-[150px] font-medium text-[#6B6A63] text-center">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {trashFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="border-t border-[#EDEBE2] hover:bg-[#FAF9F5]"
                  >
                    <td className="px-4 py-3">
                      <FileMeta file={file} />
                    </td>
                    <td className="px-4 py-3 text-[#6B6A63] font-mono">
                      {formatJalali(file.deletedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="مشاهده فایل"
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 text-[#8C8A80] hover:text-[#4B4A44] transition-colors"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => restoreFile(file.id)}
                          className="px-2.5 py-1.5 bg-white border border-[#E4E1D8] rounded-md text-xs whitespace-nowrap"
                        >
                          بازگردانی
                        </button>
                        <button
                          onClick={() => setPendingDelete(file)}
                          className="px-2.5 py-1.5 bg-[#A32D2D] text-white rounded-md text-xs whitespace-nowrap"
                        >
                          حذف کامل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {trashFiles.map((file) => (
              <div
                key={file.id}
                className="border border-[#E4E1D8] rounded-lg p-3.5"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <FileMeta file={file} />
                  <button
                    title="مشاهده فایل"
                    onClick={() => setPreviewFile(file)}
                    className="p-1 text-[#8C8A80] shrink-0"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <div className="text-xs text-[#8C8A80] mb-3">
                  تاریخ حذف: {formatJalali(file.deletedAt)}
                </div>

                <div className="flex items-center gap-2 pt-2.5 border-t border-[#EDEBE2]">
                  <button
                    onClick={() => restoreFile(file.id)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#E4E1D8] rounded-md text-xs"
                  >
                    بازگردانی
                  </button>
                  <button
                    onClick={() => setPendingDelete(file)}
                    className="flex-1 px-2.5 py-1.5 bg-[#A32D2D] text-white rounded-md text-xs"
                  >
                    حذف کامل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="حذف کامل فایل"
        message={`آیا از حذف کامل «${pendingDelete?.fileName}» مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`}
        confirmLabel="حذف کامل"
        variant="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) permanentlyDeleteFile(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}