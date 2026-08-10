"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CalendarClock, FileText } from "lucide-react";
import { mockCases } from "@/mocks/cases.mock";
import { getCaseDocuments } from "@/mocks/documents.mock";

function formatPersianDateTime(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export default function DocumentHistoryPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const caseItem = mockCases.find((c) => c.id === caseId);
  const files = getCaseDocuments(caseId).files;

  if (!caseItem) return <div className="p-8 text-sm text-[#8C8A80]">پرونده پیدا نشد.</div>;

  const history = [...files].sort((a,b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div dir="rtl" className="min-h-full bg-[#FAF9F6] p-5 sm:p-7">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <Link href={`/cases/${caseId}/documents`} className="inline-flex items-center gap-1.5 text-sm text-[#8C8A80] hover:text-[#262420]">
            <ArrowRight size={16} /> بازگشت به اسناد پرونده
          </Link>
        </div>
        <div className="rounded-2xl border border-[#E8E3D9] bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-[#EDEBE2]">
            <h1 className="text-xl font-bold text-[#262420]">روند اسناد</h1>
            <p className="text-sm text-[#8C8A80] mt-1">تاریخچه ثبت اسناد «{caseItem.title}»</p>
          </div>
          <div className="p-5 sm:p-7">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD6CA] py-12 text-center">
                <FileText size={30} className="mx-auto text-[#C1BAAE]" />
                <p className="text-sm text-[#8C8A80] mt-3">هنوز سندی برای این پرونده ثبت نشده است.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((file) => (
                  <div key={file.id} className="rounded-xl border border-[#E5E0D6] bg-[#FCFBF8] px-4 py-4 flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#F5EBD9] text-[#9A6A24] flex items-center justify-center shrink-0"><CalendarClock size={18} /></div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#262420] leading-6">سند «<span className="font-semibold">{file.title}</span>» در تاریخ <span className="font-semibold">{formatPersianDateTime(file.uploadedAt)}</span> به ثبت رسید.</p>
                      <p className="min-w-0 text-xs text-[#9A958C] mt-1 break-words [overflow-wrap:anywhere]">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
