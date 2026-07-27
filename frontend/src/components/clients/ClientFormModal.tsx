"use client";

import { X } from "lucide-react";

import Modal from "@/components/ui/Modal";
import ClientForm from "./ClientForm";
import { Client } from "@/types/client";

type Props = {
  clientId?: string;
  initialValues?: Client;
  onClose: () => void;
};

export default function ClientFormModal({
  clientId,
  initialValues,
  onClose,
}: Props) {
  const isEdit = Boolean(clientId);

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#262420] text-base">
            {isEdit ? "ویرایش موکل" : "ثبت موکل جدید"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            title="بستن"
            className="text-[#8C8A80] hover:text-[#262420] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <ClientForm
          clientId={clientId}
          initialValues={initialValues}
          onSuccess={onClose}
          onCancel={onClose}
          bare
        />
      </div>
    </Modal>
  );
}