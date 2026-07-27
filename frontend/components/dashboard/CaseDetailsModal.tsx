interface CaseDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CaseDetailsModal({
  open,
  onClose,
}: CaseDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#e5e0d6] bg-[#fdfcf9] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#ece7dd] px-4 py-4 sm:px-8 sm:py-6">

          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl md:text-3xl">
            جزئیات پرونده
          </h2>

          <button
            onClick={onClose}
            aria-label="بستن"
            className="
              text-3xl
              text-slate-500
              transition
              hover:text-[#a9762f]
            "
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="space-y-8 p-4 sm:p-8">

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* شماره پرونده */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  شماره پرونده
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                  2548
                </span>

              </div>

            </div>

            {/* نام موکل */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  نام موکل
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                  محمد احمدی
                </span>

              </div>

            </div>

            {/* موضوع */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  موضوع
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                  ملکی
                </span>

              </div>

            </div>

            {/* وکیل مسئول */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  وکیل مسئول
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                  دکتر رضایی
                </span>

              </div>

            </div>

            {/* وضعیت */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  وضعیت
                </span>

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-[#e8f5ec]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-[#3d8b5a]
                  "
                >
                  فعال
                </span>

              </div>

            </div>

            {/* تاریخ ثبت */}

            <div className="rounded-xl border border-[#ece7dd] bg-white p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  تاریخ ثبت
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                  1405/03/12
                </span>

              </div>

            </div>

          </div>

          {/* توضیحات */}

          <div>

            <p className="mb-4 text-lg font-semibold text-neutral-900">
              توضیحات
            </p>

            <div
              className="
                rounded-xl
                border
                border-[#ddd5c8]
                bg-white
                p-5
                leading-8
                text-[#555]
              "
            >
              این پرونده مربوط به اختلاف ملکی است و در حال حاضر در
              مرحله بررسی اسناد قرار دارد.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}