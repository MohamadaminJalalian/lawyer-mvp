"use client";

import { Files } from "lucide-react";

interface DocumentsBadgeProps {
  count: number;
}

/**
 * آیکن اسناد + شمارنده‌ی تعداد سند.
 * قابل استفاده در جدول پرونده‌ها و جدول اطلاعیه‌ها (یا هرجای دیگه‌ای که لازم شد).
 */
export default function DocumentsBadge({ count }: DocumentsBadgeProps) {
  if (count === 0) {
    return <span className="text-sm text-[#b8b0a0]">—</span>;
  }

  return (
    <div className="relative inline-flex">
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-[#e5e0d6]
          bg-[#faf8f4]
          text-[#a9762f]
        "
      >
        <Files size={18} />
      </div>

      <span
        className="
          absolute
          -top-1.5
          -right-1.5
          flex
          h-4
          min-w-4
          items-center
          justify-center
          rounded-full
          bg-[#8a6a2f]
          px-1
          text-[10px]
          font-bold
          text-white
        "
      >
        {count}
      </span>
    </div>
  );
}
