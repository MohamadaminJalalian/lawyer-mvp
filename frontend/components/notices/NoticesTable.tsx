"use client";

import { useState } from "react";
import Link from "next/link";

import DocumentsBadge from "../shared/DocumentsBadge";
import { getNoticeDocuments } from "./notices.mock";

import NoticeActions from "./NoticeActions";
import NoticeDetailsModal from "./NoticeDetailsModal";

export interface NoticeListItem {
  id: number;
  title: string;
  clientName: string;
  category: string;
  documentsCount: number;
  date: string;

  isImportant: boolean;
  description: string;
}

interface NoticesTableProps {
  notices: NoticeListItem[];
  onToggleImportant: (id: number) => void;
  onEdit: (notice: NoticeListItem) => void;
}

export default function NoticesTable({
  notices,
  onToggleImportant,
  onEdit,
}: NoticesTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeListItem | null>(
    null
  );

  function handleView(notice: NoticeListItem) {
    setSelectedNotice(notice);
    setDetailsOpen(true);
  }

  return (
    <>
      {/* جدول — فقط از sm به بعد دیده می‌شه؛ برای موبایل بعداً می‌شه کارت اضافه کرد */}
      <div className="hidden max-w-6xl overflow-hidden rounded-xl border border-[#E4E1D8] bg-white sm:block">
        <table className="w-full min-w-[720px] border-collapse text-right text-sm">
          <thead>
            <tr className="bg-[#F1EFE6]">
              <th className="px-4 py-3.5 font-medium text-[#6B6A63]">عنوان</th>
              <th className="px-4 py-3.5 font-medium text-[#6B6A63]">موکل</th>
              <th className="px-4 py-3.5 font-medium text-[#6B6A63]">
                تاریخ موعد
              </th>
              <th className="px-4 py-3.5 font-medium text-[#6B6A63]">
                دسته‌بندی
              </th>
              <th className="px-4 py-3.5 font-medium text-[#6B6A63]">اسناد</th>
              <th className="px-4 py-3.5 text-center font-medium text-[#6B6A63]">
                عملیات
              </th>
            </tr>
          </thead>

          <tbody>
            {notices.map((notice) => (
              <tr
                key={notice.id}
                className="border-t border-[#EDEBE2] transition hover:bg-[#faf8f4]"
              >
                <td className="px-4 py-4 text-[#262420]">{notice.title}</td>

                <td className="px-4 py-4 text-[#262420]">
                  {notice.clientName}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-[#262420]">
                  {notice.date}
                </td>

                <td className="px-4 py-4 text-[#262420]">{notice.category}</td>

                <td className="px-4 py-4">
                  <Link
                    href={`/notices/${notice.id}/documents`}
                    className="inline-flex"
                  >
                    <DocumentsBadge
                      count={
                        (() => {
                          const { folders, files } = getNoticeDocuments(
                            String(notice.id)
                          );
                          return folders.length + files.length;
                        })()
                      }
                    />
                  </Link>
                </td>

                <td className="px-4 py-4 text-center">
                  <NoticeActions
                    important={notice.isImportant}
                    onToggleImportant={() => onToggleImportant(notice.id)}
                    onView={() => handleView(notice)}
                    onEdit={() => onEdit(notice)}
                  />
                </td>
              </tr>
            ))}

            {notices.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#8C8A80]">
                  هیچ اطلاعیه‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NoticeDetailsModal
        open={detailsOpen}
        notice={selectedNotice}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedNotice(null);
        }}
      />
    </>
  );
}
