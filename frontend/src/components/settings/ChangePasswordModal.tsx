"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

import Modal from "@/components/ui/Modal";
import {
  ChangePasswordFormErrors,
  ChangePasswordFormValues,
  hasErrors,
  validateChangePasswordForm,
} from "@/lib/validation";

type Props = {
  onClose: () => void;
};

const initialValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordModal({ onClose }: Props) {
  const [values, setValues] = useState<ChangePasswordFormValues>(initialValues);
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof ChangePasswordFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validateChangePasswordForm(values);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    // در پروژه واقعی اینجا رمز عبور از طریق API تغییر داده می‌شود.
    setSuccess(true);
    setTimeout(onClose, 1200);
  }

  return (
    <Modal onClose={onClose} maxWidthClass="max-w-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-[#262420] text-base">
            تغییر رمز عبور
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

        <p className="text-xs text-[#8C8A80] mb-4">
          رمز عبور ورود به سامانه را تغییر دهید.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle2 size={32} className="text-[#2F6B4F]" />
            <p className="text-sm text-[#262420]">
              رمز عبور با موفقیت تغییر کرد.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="block text-xs text-[#262420] mb-1">
                  رمز عبور فعلی
                </label>
                <input
                  type="password"
                  value={values.currentPassword}
                  onChange={(e) =>
                    handleChange("currentPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                    errors.currentPassword
                      ? "border-[#A32D2D]"
                      : "border-[#E4E1D8]"
                  }`}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-[#A32D2D]">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#262420] mb-1">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={values.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                    errors.newPassword ? "border-[#A32D2D]" : "border-[#E4E1D8]"
                  }`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-[#A32D2D]">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#262420] mb-1">
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                    errors.confirmPassword
                      ? "border-[#A32D2D]"
                      : "border-[#E4E1D8]"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#A32D2D]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
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
                ذخیره
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}