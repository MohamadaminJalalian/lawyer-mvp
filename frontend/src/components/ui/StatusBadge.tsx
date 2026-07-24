import { CaseStatus } from "@/features/cases/types/case.types";

const STATUS_CONFIG: Record<CaseStatus, { label: string; className: string }> = {
  active: {
    label: "فعال",
    className: "bg-success/10 text-success",
  },
  closed: {
    label: "بسته‌شده",
    className: "bg-foreground/10 text-foreground/60",
  },
  archived: {
    label: "بایگانی",
    className: "bg-info/10 text-info",
  },
};

interface StatusBadgeProps {
  status: CaseStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
