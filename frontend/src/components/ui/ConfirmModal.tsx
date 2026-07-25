"use client";

import Modal from "./Modal";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <Modal onClose={onCancel} maxWidthClass="max-w-sm">
      <div className="p-6">
        <h2 className="mb-2 font-bold text-[#262420] text-sm">{title}</h2>
        <p className="mb-5 text-sm text-[#6B6A63]">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg text-sm ${variant === "danger" ? "bg-[#A32D2D]" : "bg-[#A9762F]"
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}