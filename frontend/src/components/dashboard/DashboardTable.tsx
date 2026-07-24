import Link from "next/link";

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DashboardTableProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  viewAllHref: string;
  viewAllLabel?: string;
  emptyMessage?: string;
}

export function DashboardTable<T extends { id: string }>({
  title,
  columns,
  rows,
  viewAllHref,
  viewAllLabel = "مشاهده همه",
  emptyMessage = "داده‌ای موجود نیست",
}: DashboardTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          {viewAllLabel}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-foreground/50 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3 text-right font-medium text-foreground/60 ${col.className || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-light last:border-0 hover:bg-surface-alt/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3 ${col.className || ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
