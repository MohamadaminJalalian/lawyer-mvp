"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BasicInfo from "./sections/BasicInfo";
import AdditionalInfo from "./sections/AdditionalInfo";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useClients } from "@/context/ClientContext";
import {
  validateClientForm,
  hasErrors,
  ClientFormErrors,
} from "@/lib/validation";
import { Client } from "@/types/client";

export interface ClientFormValues {
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobile: string;
  phone: string;
  address: string;
  description: string;
}

const emptyForm: ClientFormValues = {
  firstName: "",
  lastName: "",
  nationalCode: "",
  mobile: "",
  phone: "",
  address: "",
  description: "",
};

type Props = {
  clientId?: string;
  initialValues?: Client;
};

export default function ClientForm({ clientId, initialValues }: Props) {
  const router = useRouter();
  const { addClient, updateClient, isNationalCodeTaken } = useClients();

  const isEdit = Boolean(clientId);

  const startingValues: ClientFormValues = initialValues
    ? {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
      nationalCode: initialValues.nationalCode,
      mobile: initialValues.mobile,
      phone: initialValues.phone ?? "",
      address: initialValues.address ?? "",
      description: initialValues.description ?? "",
    }
    : emptyForm;

  const [form, setForm] = useState<ClientFormValues>(startingValues);
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const initialSnapshotRef = useRef(startingValues);
  const isDirty =
    JSON.stringify(form) !== JSON.stringify(initialSnapshotRef.current);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "nationalCode" || name === "mobile" || name === "phone") {
      nextValue = value.replace(/[^0-9]/g, "");
    }

    setForm((prev) => ({ ...prev, [name]: nextValue }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateClientForm(form);

    if (isNationalCodeTaken(form.nationalCode.trim(), clientId)) {
      validationErrors.nationalCode = "موکلی با این کد ملی قبلاً ثبت شده است.";
    }

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const payload = {
      type: "PERSON" as const,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nationalCode: form.nationalCode.trim(),
      mobile: form.mobile.trim(),
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    if (isEdit && clientId) {
      updateClient(clientId, payload);
    } else {
      addClient(payload);
    }

    setSubmitting(false);
    router.push("/clients");
  }

  function handleCancelClick() {
    if (isDirty) setShowLeaveConfirm(true);
    else router.push("/clients");
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E4E1D8] rounded-xl p-6 space-y-6"
      >
        <BasicInfo form={form} errors={errors} onChange={handleChange} />
        <AdditionalInfo form={form} errors={errors} onChange={handleChange} />

        <div className="flex gap-3 pt-2 justify-end">
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors disabled:opacity-50"
          >
            {submitting ? "در حال ثبت..." : isEdit ? "ذخیره تغییرات" : "ثبت موکل"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showLeaveConfirm}
        title="تغییرات ذخیره‌نشده"
        message="تغییرات ذخیره نشده‌اند. آیا مایل به خروج هستید؟"
        confirmLabel="خروج بدون ذخیره"
        variant="danger"
        onCancel={() => setShowLeaveConfirm(false)}
        onConfirm={() => router.push("/clients")}
      />
    </>
  );
}