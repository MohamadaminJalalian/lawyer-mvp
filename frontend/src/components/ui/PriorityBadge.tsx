import { CasePriority } from "@/features/cases/types/case.types";

const PRIORITY_CONFIG: Record<
  CasePriority,
  { label: string; className: string }
> = {
  high: {
    label: "بالا",
    className: "bg-danger/10 text-danger",
  },
  medium: {
    label: "متوسط",
    className: "bg-warning/10 text-warning",
  },
  low: {
    label: "پایین",
    className: "bg-success/10 text-success",
  },
};

interface PriorityBadgeProps {
  priority: CasePriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
