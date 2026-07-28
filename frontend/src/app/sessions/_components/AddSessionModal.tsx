"use client";

import { useState } from "react";
import JalaliDayStrip from "./JalaliDayStrip";
import TimeSlotPicker from "./TimeSlotPicker";
import type { CreateSessionInput } from "@/types/session.types";

interface AddSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateSessionInput) => void;
}

interface FormErrors {
  clientName?: string;
  clientPhone?: string;
  sessionDate?: string;
  sessionTime?: string;
  description?: string;
}

const MAX_DESCRIPTION_LENGTH = 1000;

export default function AddSessionModal({ open, onClose, onSubmit }: AddSessionModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;

  function resetForm() {
    setClientName("");
    setClientPhone("");
    setSessionDate("");
    setSessionTime("");
    setDescription("");
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!clientName.trim() || clientName.trim().length < 3) {
      next.clientName = "نام موکل الزامی است (حداقل ۳ کاراکتر)";
    }
    if (!/^09\d{9}$/.test(clientPhone.trim())) {
      next.clientPhone = "شماره تماس معتبر نیست، مثال: 09121234567";
    }
    if (!sessionDate) next.sessionDate = "تاریخ جلسه الزامی است";
    if (!sessionTime) next.sessionTime = "ساعت جلسه الزامی است";
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      next.description = `توضیحات نباید بیشتر از ${MAX_DESCRIPTION_LENGTH} کاراکتر باشد`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      sessionDate,
      sessionTime,
      description: description.trim(),
    });
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-[var(--surface)] p-6 shadow-xl"
        dir="rtl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">افزودن جلسه مشاوره</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              نام موکل
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="مثال: مریم احمدی"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
            />
            {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              شماره تماس موکل
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="09121234567"
              dir="ltr"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
            />
            {errors.clientPhone && <p className="mt-1 text-xs text-red-500">{errors.clientPhone}</p>}
          </div>

          <JalaliDayStrip selectedDate={sessionDate} onSelect={setSessionDate} />
          {errors.sessionDate && <p className="-mt-3 text-xs text-red-500">{errors.sessionDate}</p>}

          <TimeSlotPicker time={sessionTime} onTimeChange={setSessionTime} />
          {errors.sessionTime && <p className="-mt-3 text-xs text-red-500">{errors.sessionTime}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="یادداشت یا موضوع جلسه..."
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-foreground)] transition hover:bg-[var(--brand-hover)]"
          >
            ثبت جلسه
          </button>
        </div>
      </div>
    </div>
  );
}