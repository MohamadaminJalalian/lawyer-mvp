"use client";

import { useState } from "react";
import JalaliDayStrip from "./JalaliDayStrip";
import TimeSlotPicker from "./TimeSlotPicker";
import type { CreateSessionInput, SessionClientType } from "@/types/session.types";

interface AddSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateSessionInput) => void;
}

interface FormErrors {
  clientType?: string;
  clientName?: string;
  clientPhone?: string;
  clientNationalCode?: string;
  sessionDate?: string;
  sessionTime?: string;
  description?: string;
}

const MAX_DESCRIPTION_LENGTH = 1000;

export default function AddSessionModal({ open, onClose, onSubmit }: AddSessionModalProps) {
  const [clientType, setClientType] = useState<SessionClientType>("PERMANENT");
  const [permanentClientId, setPermanentClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNationalCode, setClientNationalCode] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const permanentClients = [
    { id: "client-001", name: "مریم احمدی", phone: "09121234567", nationalCode: "0012345678" },
    { id: "client-002", name: "علی رضایی", phone: "09359876543", nationalCode: "0023456789" },
    { id: "client-003", name: "سارا محمدی", phone: "09121122334", nationalCode: "0034567890" },
  ];

  if (!open) return null;

  function resetForm() {
    setClientType("PERMANENT");
    setPermanentClientId("");
    setClientName("");
    setClientPhone("");
    setClientNationalCode("");
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
    if (clientType === "PERMANENT") {
      if (!permanentClientId) next.clientName = "یک موکل دائمی را انتخاب کنید";
    } else {
      if (!clientName.trim() || clientName.trim().length < 3) next.clientName = "نام موکل الزامی است (حداقل ۳ کاراکتر)";
      if (!/^09\d{9}$/.test(clientPhone.trim())) next.clientPhone = "شماره تماس معتبر نیست، مثال: 09121234567";
      if (!/^\d{10}$/.test(clientNationalCode.trim())) next.clientNationalCode = "کد ملی باید ۱۰ رقم باشد";
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
    const selectedPermanent = permanentClients.find((client) => client.id === permanentClientId);
    onSubmit({
      clientType,
      clientName: clientType === "PERMANENT" ? selectedPermanent!.name : clientName.trim(),
      clientPhone: clientType === "PERMANENT" ? selectedPermanent!.phone : clientPhone.trim(),
      clientNationalCode: clientType === "PERMANENT" ? selectedPermanent!.nationalCode : clientNationalCode.trim(),
      sessionDate,
      sessionTime,
      description: description.trim(),
    });
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--surface)] p-8 shadow-xl">
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
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">نوع موکل</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setClientType("PERMANENT")} className={`rounded-xl border px-4 py-2.5 text-sm transition ${clientType === "PERMANENT" ? "border-[var(--brand)] bg-[var(--surface-muted)] text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>موکل دائمی</button>
                <button type="button" onClick={() => setClientType("TEMPORARY")} className={`rounded-xl border px-4 py-2.5 text-sm transition ${clientType === "TEMPORARY" ? "border-[var(--brand)] bg-[var(--surface-muted)] text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>موکل موقت</button>
              </div>
              {errors.clientType && <p className="mt-1 text-xs text-red-500">{errors.clientType}</p>}
            </div>

            {clientType === "PERMANENT" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">موکل</label>
                <select value={permanentClientId} onChange={(e) => setPermanentClientId(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)]">
                  <option value="">انتخاب موکل</option>
                  {permanentClients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
                {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">نام موکل</label><input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="مثال: مریم احمدی" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />{errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}</div>
                <div><label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">شماره تماس</label><input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="09121234567" dir="ltr" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />{errors.clientPhone && <p className="mt-1 text-xs text-red-500">{errors.clientPhone}</p>}</div>
                <div><label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">کد ملی</label><input value={clientNationalCode} onChange={(e) => setClientNationalCode(e.target.value)} placeholder="۱۰ رقم" inputMode="numeric" dir="ltr" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />{errors.clientNationalCode && <p className="mt-1 text-xs text-red-500">{errors.clientNationalCode}</p>}</div>
              </div>
            )}
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