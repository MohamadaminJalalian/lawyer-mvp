"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import {
  addEntry,
  deleteEntry,
  getEntriesForDate,
  priorityLabels,
  priorityColors,
  type CalendarEntry,
  type Priority,
} from "@/data/calendar-entries";
import { jalaliMonthNames, toPersianDigits } from "@/lib/jalali";

interface Props {
  jy: number;
  jm: number;
  jd: number;
  onClose: () => void;
  onChanged?: () => void; // بعد از افزودن/حذف صدا زده می‌شه تا تقویم رفرش بشه
}

const priorityOrder: Priority[] = ["NORMAL", "URGENT", "CRITICAL"];

export default function DayEntriesModal({ jy, jm, jd, onClose, onChanged }: Props) {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getEntriesForDate(jy, jm, jd);
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jy, jm, jd]);

  async function handleAdd() {
    if (!title.trim()) return;
    setSaving(true);
    await addEntry({ jy, jm, jd, title: title.trim(), description: description.trim() || undefined, priority });
    setTitle("");
    setDescription("");
    setPriority("NORMAL");
    setSaving(false);
    await load();
    onChanged?.();
  }

  async function handleDelete(id: string) {
    await deleteEntry(id);
    await load();
    onChanged?.();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-foreground">
            {toPersianDigits(jd)} {jalaliMonthNames[jm - 1]} {toPersianDigits(jy)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          {loading ? (
            <p className="text-xs text-muted-foreground">در حال بارگذاری...</p>
          ) : entries.length === 0 ? (
            <p className="text-xs text-muted-foreground">کاری برای این تاریخ ثبت نشده.</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-2.5 rounded-xl border border-border p-3"
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: priorityColors[entry.priority] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{entry.title}</p>
                  {entry.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.description}</p>
                  )}
                  <span
                    className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] text-white"
                    style={{ backgroundColor: priorityColors[entry.priority] }}
                  >
                    {priorityLabels[entry.priority]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان کار (مثلاً: جلسه دادگاه پرونده ۲۵۴۸)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-right text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات (اختیاری)"
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-right text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />

          <div className="flex gap-2">
            {priorityOrder.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className="flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors"
                style={
                  priority === p
                    ? { backgroundColor: priorityColors[p], borderColor: priorityColors[p], color: "#fff" }
                    : { borderColor: "var(--border-color)", color: "var(--muted-foreground)" }
                }
              >
                {priorityLabels[p]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!title.trim() || saving}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Plus size={16} />
            افزودن به سررسید
          </button>
        </div>
      </div>
    </div>
  );
}
