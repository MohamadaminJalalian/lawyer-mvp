import type { ReactNode } from "react";
import { Bell, Users, Calendar, ClipboardList, X } from "lucide-react";

export interface NoticeDetailsData {
  id: number;
  title: string;
  clientName: string;
  category: string;
  date: string;
  description: string;
}

interface NoticeDetailsModalProps {
  notice: NoticeDetailsData | null;
  onClose: () => void;
}

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

export default function NoticeDetailsModal({
  notice,
  onClose,
}: NoticeDetailsModalProps) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-2xl">
        {/* هدر */}
        <div className="border-b border-[#EDEBE2]">
          <div className="flex items-center justify-between p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#262420]">
              <Bell size={20} className="text-[#8A5D1F]" />
              جزئیات اطلاعیه
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

          <div className="px-5 pb-5">
            <h3 className="text-lg font-bold text-[#262420]">{notice.title}</h3>
            <p className="mt-1 text-sm text-[#8C8A80]">اطلاعات کامل اطلاعیه</p>
          </div>
        </div>

        {/* محتوا */}
        <div className="space-y-4 p-5 text-sm">
          <InfoCard icon={Bell} title="اطلاعات اطلاعیه">
            <Field label="عنوان" value={notice.title} />
            <Field label="دسته‌بندی" value={notice.category} />
          </InfoCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard icon={Users} title="اشخاص">
              <Field label="نام موکل" value={notice.clientName} />
            </InfoCard>

            <InfoCard icon={Calendar} title="زمان‌بندی">
              <Field label="تاریخ موعد" value={notice.date} />
            </InfoCard>
          </div>

          <InfoCard icon={ClipboardList} title="متن اطلاعیه">
            <p className="rounded-lg border border-[#EDEBE2] bg-white p-3 leading-6 text-[#262420]">
              {notice.description || "متنی برای این اطلاعیه ثبت نشده است."}
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
