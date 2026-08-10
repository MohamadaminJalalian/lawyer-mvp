import type { ReactNode } from "react";
import { FileText, Users, Calendar, ClipboardList, X } from "lucide-react";

export interface CaseDetailsData {
  id: string;
  client: string;
  category: string;
  subject: string;
  date: string;
  status: string;
}

interface CaseDetailsModalProps {
  caseItem: CaseDetailsData | null;
  onClose: () => void;
}

const statusStyles: Record<string, string> = {
  فعال: "bg-[#EAF6EE] border-[#BFE3CB] text-[#2F6B4F]",
  مختومه: "bg-[#efefef] border-[#dedede] text-[#6d6d6d]",
  بایگانی: "bg-[#FFF4D8] border-[#E9D9A8] text-[#8A5D1F]",
};

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#EDEBE2] bg-white">
      <div className="flex items-center gap-2 border-b border-[#EDEBE2] bg-[#FAF8F3] px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCF6EA] text-[#8A5D1F]">
          <Icon size={15} />
        </span>
        <h4 className="text-sm font-bold text-[#262420]">{title}</h4>
      </div>

      <div className="space-y-2.5 bg-white px-4 py-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EDEBE2] py-1.5 text-sm last:border-0">
      <span className="text-[#8C8A80]">{label}</span>
      <span className="font-medium text-[#262420]">{value}</span>
    </div>
  );
}

export default function CaseDetailsModal({
  caseItem,
  onClose,
}: CaseDetailsModalProps) {
  if (!caseItem) return null;

  const statusClass =
    statusStyles[caseItem.status] ?? statusStyles["فعال"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-2xl">
        {/* هدر */}
        <div className="border-b border-[#EDEBE2]">
          <div className="flex items-center justify-between p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#262420]">
              <FileText size={20} className="text-[#8A5D1F]" />
              جزئیات پرونده
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="text-[#8C8A80] transition-colors hover:text-[#262420]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#262420]">
                  {caseItem.subject}
                </h3>
                <span className="rounded-md border border-[#E4D3B0] bg-[#FCF6EA] px-2 py-0.5 font-mono text-xs text-[#8A5D1F]">
                  {caseItem.id}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#8C8A80]">
                اطلاعات کامل پرونده
              </p>
            </div>

            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${statusClass}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {caseItem.status}
            </span>
          </div>
        </div>

        {/* محتوا */}
        <div className="space-y-4 p-5 text-sm">
          <InfoCard icon={FileText} title="اطلاعات پرونده">
            <Field label="موضوع" value={caseItem.subject} />
            <Field label="دسته‌بندی" value={caseItem.category} />
            <Field label="وضعیت" value={caseItem.status} />
          </InfoCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard icon={Users} title="اشخاص">
              <Field label="موکل" value={caseItem.client} />
            </InfoCard>

            <InfoCard icon={Calendar} title="زمان‌بندی">
              <Field label="تاریخ ثبت" value={caseItem.date} />
            </InfoCard>
          </div>

          <InfoCard icon={ClipboardList} title="توضیحات">
            <p className="rounded-lg border border-[#EDEBE2] bg-white p-3 leading-6 text-[#262420]">
              توضیحات جداگانه‌ای برای این پرونده ثبت نشده است.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
