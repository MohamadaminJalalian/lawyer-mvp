import type { SessionStatus } from "@/types/session.types";

const STATUS_CONFIG: Record<SessionStatus, { label: string; bg: string; text: string }> = {
  DONE: {
    label: "برگزار شده",
    bg: "bg-[var(--badge-success-bg)]",
    text: "text-[var(--badge-success-text)]",
  },
  SCHEDULED: {
    label: "در انتظار",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
};

export default function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}