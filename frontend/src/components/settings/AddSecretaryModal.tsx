"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useSecretaries } from "@/context/SecretaryContext";
import {
  SecretaryFormErrors,
  SecretaryFormValues,
  hasErrors,
  validateSecretaryForm,
} from "@/lib/validation";

type Props = {
  onClose: () => void;
};

const initialValues: SecretaryFormValues = {
  name: "",
  mobile: "",
  password: "",
};

export default function AddSecretaryModal({ onClose }: Props) {
  const { addSecretary } = useSecretaries();

  const [values, setValues] = useState<SecretaryFormValues>(initialValues);
  const [errors, setErrors] = useState<SecretaryFormErrors>({});
  const [canDeleteFiles, setCanDeleteFiles] = useState(false);

  function handleChange(field: keyof SecretaryFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validateSecretaryForm(values);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    addSecretary({
      name: values.name.trim(),
      mobile: values.mobile.trim(),
      permissions: { canDeleteFiles },
    });

    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#262420] text-base">
            افزودن منشی جدید
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <label className="block text-xs text-[#262420] mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.name ? "border-[#A32D2D]" : "border-[#E4E1D8]"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#A32D2D]">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-[#262420] mb-1">
                شماره موبایل
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={values.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                placeholder="09xxxxxxxxx"
                className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                  errors.mobile ? "border-[#A32D2D]" : "border-[#E4E1D8]"
                }`}
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-[#A32D2D]">{errors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-[#262420] mb-1">
                رمز عبور ورود منشی
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.password ? "border-[#A32D2D]" : "border-[#E4E1D8]"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-[#A32D2D]">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-[#262420] mt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={canDeleteFiles}
                onChange={(e) => setCanDeleteFiles(e.target.checked)}
                className="w-4 h-4 accent-[#A9762F]"
              />
              دسترسی حذف فایل از پرونده‌ها
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E4E1D8] rounded-lg text-sm"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
            >
              افزودن منشی
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}