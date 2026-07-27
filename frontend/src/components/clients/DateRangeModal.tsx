"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { parseJalaliDate } from "@/lib/utils";

type Props = {
  initialFrom: string;
  initialTo: string;
  onClose: () => void;
  onApply: (from: string, to: string) => void;
};

export default function DateRangeModal({
  initialFrom,
  initialTo,
  onClose,
  onApply,
}: Props) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [error, setError] = useState("");

  function handleApply() {
    const fromValid = !from || parseJalaliDate(from);
    const toValid = !to || parseJalaliDate(to);

    if (!fromValid || !toValid) {
      setError("فرمت تاریخ را به‌صورت ۱۴۰۵/۰۱/۰۱ وارد کنید.");
      return;
    }

    onApply(from, to);
    onClose();
  }

  function handleClear() {
    setFrom("");
    setTo("");
    setError("");
    onApply("", "");
    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-xs">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#262420] text-sm">
            جست‌وجو بر اساس تاریخ ثبت
          </h2>

          <button
            type="button"
            onClick={onClose}
            title="بستن"
            className="text-[#8C8A80] hover:text-[#262420] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-[#262420]">
              تاریخ شروع
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="۱۴۰۵/۰۱/۰۱"
              className="w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm placeholder:text-[#8C8A80] focus:outline-none focus:border-[#A9762F]"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-[#262420]">
              تاریخ پایان
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="۱۴۰۵/۱۲/۲۹"
              className="w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm placeholder:text-[#8C8A80] focus:outline-none focus:border-[#A9762F]"
            />
          </div>

          {error && <p className="text-xs text-[#A32D2D]">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-5">
          {(initialFrom || initialTo) && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto px-3 py-2 text-sm text-[#A32D2D] hover:underline"
            >
              پاک کردن
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
          >
            اعمال
          </button>
        </div>
      </div>
    </Modal>
  );
}