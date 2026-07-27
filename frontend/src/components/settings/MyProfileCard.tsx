"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useSecretaries } from "@/context/SecretaryContext";
import { Secretary } from "@/types/secretary";
import {
  SecretaryProfileFormErrors,
  SecretaryProfileFormValues,
  hasErrors,
  validateSecretaryProfileForm,
} from "@/lib/validation";

type Props = {
  secretary: Secretary;
};

export default function MyProfileCard({ secretary }: Props) {
  const { updateProfile } = useSecretaries();

  const [values, setValues] = useState<SecretaryProfileFormValues>({
    name: secretary.name,
    mobile: secretary.mobile,
  });
  const [errors, setErrors] = useState<SecretaryProfileFormErrors>({});
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof SecretaryProfileFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validateSecretaryProfileForm(values);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    updateProfile(secretary.id, {
      name: values.name.trim(),
      mobile: values.mobile.trim(),
    });

    setSaved(true);
  }

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-5 max-w-sm">
      <h2 className="font-bold text-[#262420] text-sm mb-4">پروفایل من</h2>

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
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                errors.mobile ? "border-[#A32D2D]" : "border-[#E4E1D8]"
              }`}
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-[#A32D2D]">{errors.mobile}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
          >
            ذخیره تغییرات
          </button>

          {saved && (
            <span className="flex items-center gap-1 text-xs text-[#2F6B4F]">
              <CheckCircle2 size={14} />
              ذخیره شد
            </span>
          )}
        </div>
      </form>
    </div>
  );
}