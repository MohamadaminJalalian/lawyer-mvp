interface Props {
  status: "scheduled" | "completed" | "cancelled";
}

export default function ConsultationStatusBadge({ status }: Props) {
  const styles = {
    scheduled:
      "bg-blue-50 text-blue-700",
    completed:
      "bg-green-50 text-green-700",
    cancelled:
      "bg-red-50 text-red-700",
  };

  const labels = {
    scheduled: "برنامه‌ریزی شده",
    completed: "برگزار شده",
    cancelled: "لغو شده",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}