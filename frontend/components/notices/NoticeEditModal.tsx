"use client";

import { X } from "lucide-react";
import type { NoticeListItem } from "./NoticesTable";

interface NoticeEditModalProps {
  open: boolean;

  notice: NoticeListItem | null;

  onClose: () => void;

  onChange: (
    field: keyof NoticeListItem,
    value: string
  ) => void;

  onSave: () => void;
}

export default function NoticeEditModal({
  open,
  notice,
  onClose,
  onChange,
  onSave,
}: NoticeEditModalProps) {
  if (!open || !notice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#ece7dd] px-6 py-5">

          <h2 className="text-2xl font-bold text-neutral-900">
            ویرایش اطلاعیه
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

          <Input
            label="عنوان اطلاعیه"
            value={notice.title}
            onChange={(value) =>
              onChange("title", value)
            }
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              نام موکل
            </label>
            <div className="w-full rounded-xl border border-[#ece7dd] bg-[#F7F5F0] px-4 py-2.5 text-sm text-[#6B6A63]">
              {notice.clientName}
            </div>
            <p className="mt-1 text-sm text-[#8C8A80]">
              موکل اطلاعیه پس از ثبت قابل تغییر نیست.
            </p>
          </div>

          <Input
            label="تاریخ موعد"
            value={notice.date}
            onChange={(value) =>
              onChange("date", value)
            }
          />

          <Input
            label="دسته‌بندی"
            value={notice.category}
            onChange={(value) =>
              onChange("category", value)
            }
          />


          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              متن اطلاعیه
            </label>

            <textarea
              rows={6}
              value={notice.description}
              onChange={(e) =>
                onChange(
                  "description",
                  e.target.value
                )
              }
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#ddd5c8]
                p-3
                outline-none
                transition
                focus:border-[#a9762f]
              "
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-3 border-t border-[#ece7dd] px-6 py-5">

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              border-[#ddd5c8]
              px-6
              py-2.5
              transition
              hover:bg-gray-100
            "
          >
            انصراف
          </button>

          <button
            onClick={onSave}
            className="
              rounded-xl
              bg-[#a9762f]
              px-6
              py-2.5
              font-semibold
              text-white
              transition
              hover:bg-[#946727]
            "
          >
            ذخیره تغییرات
          </button>

        </div>

      </div>

    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function Input({
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-[#ddd5c8]
          px-4
          py-3
          outline-none
          transition
          focus:border-[#a9762f]
        "
      />

    </div>
  );
}