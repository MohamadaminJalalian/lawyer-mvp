"use client";

import { Star, Eye, Pencil } from "lucide-react";

interface NoticeActionsProps {
  important: boolean;
  onToggleImportant: () => void;
  onView: () => void;
  onEdit: () => void;
}

export default function NoticeActions({
  important,
  onToggleImportant,
  onView,
  onEdit,
}: NoticeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* ستاره */}
      <div className="group relative">
        <button
          onClick={onToggleImportant}
          className="rounded-lg p-2 transition hover:bg-[#f6f2e8]"
        >
          <Star
  size={18}
  strokeWidth={2}
  className={`transition ${
    important
      ? "fill-[#c9971b] text-[#c9971b]"
      : "text-[#9ca3af] hover:text-[#c9971b]"
  }`}
/>
        </button>

        <span
          className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            mb-2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-[#2b2b2b]
            px-3
            py-1.5
            text-xs
            text-white
            opacity-0
            transition
            group-hover:opacity-100
          "
        >
          {important
            ? "حذف از اطلاعیه‌های مهم"
            : "افزودن به اطلاعیه‌های مهم"}
        </span>
      </div>

      {/* مشاهده */}
      <div className="group relative">
        <button
          onClick={onView}
          className="rounded-lg p-2 text-[#8a6a2f] transition hover:bg-[#f6f2e8]"
        >
         <Eye
  size={18}
  strokeWidth={2}
/>
        </button>

        <span
          className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            mb-2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-[#2b2b2b]
            px-3
            py-1.5
            text-xs
            text-white
            opacity-0
            transition
            group-hover:opacity-100
          "
        >
          مشاهده
        </span>
      </div>

      {/* ویرایش */}
      <div className="group relative">
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-[#8a6a2f] transition hover:bg-[#f6f2e8]"
        >
          <Pencil
  size={18}
  strokeWidth={2}
/>
        </button>

        <span
          className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            mb-2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-[#2b2b2b]
            px-3
            py-1.5
            text-xs
            text-white
            opacity-0
            transition
            group-hover:opacity-100
          "
        >
          ویرایش
        </span>
      </div>
    </div>
  );
}