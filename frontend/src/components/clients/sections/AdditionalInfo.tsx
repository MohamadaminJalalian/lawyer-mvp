import { ClientFormValues } from "../ClientForm";
import { ClientFormErrors } from "@/lib/validation";

const fieldClass =
    "w-full p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm focus:outline-none focus:border-[#A9762F]";
const labelClass = "block mb-1.5 font-medium text-sm text-[#262420]";
const errorClass = "text-sm text-[#A32D2D] mt-1";

type Props = {
    form: ClientFormValues;
    errors: ClientFormErrors;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AdditionalInfo({ form, errors, onChange }: Props) {
    return (
        <div>
            <h2 className="mb-3 text-sm font-bold text-[#262420]">اطلاعات تکمیلی</h2>

            <div className="space-y-4">
                <div>
                    <label className={labelClass}>آدرس</label>
                    <textarea name="address" rows={3} value={form.address} onChange={onChange} maxLength={500} className={fieldClass} />
                    {errors.address && <p className={errorClass}>{errors.address}</p>}
                </div>

                <div>
                    <label className={labelClass}>توضیحات</label>
                    <textarea name="description" rows={4} value={form.description} onChange={onChange} maxLength={1000} className={fieldClass} />
                    {errors.description && <p className={errorClass}>{errors.description}</p>}
                </div>
            </div>
        </div>
    );
}