import { ClientFormValues } from "../ClientForm";
import { ClientFormErrors } from "@/lib/validation";

const fieldClass =
  "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";

type Props = {
  form: ClientFormValues;
  errors: ClientFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BasicInfo({ form, errors, onChange }: Props) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-[#262420]">اطلاعات اصلی</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نام" required name="firstName" value={form.firstName} error={errors.firstName} onChange={onChange} />
        <Field label="نام خانوادگی" required name="lastName" value={form.lastName} error={errors.lastName} onChange={onChange} />
        <Field label="کد ملی" required name="nationalCode" value={form.nationalCode} error={errors.nationalCode} onChange={onChange} mono inputMode="numeric" maxLength={10} />
        <Field label="شماره موبایل" required name="mobile" value={form.mobile} error={errors.mobile} onChange={onChange} mono inputMode="numeric" maxLength={11} placeholder="09xxxxxxxxx" />
        <Field label="تلفن ثابت" name="phone" value={form.phone} error={errors.phone} onChange={onChange} mono inputMode="numeric" maxLength={15} />
      </div>
    </div>
  );
}

function Field({
  label, name, value, error, onChange, inputMode, maxLength, placeholder, mono, required,
}: {
  label: string; name: string; value: string; error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "numeric" | "text"; maxLength?: number; placeholder?: string; mono?: boolean; required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-[#A32D2D]"> *</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`${fieldClass} ${mono ? "font-mono" : ""}`}
      />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}