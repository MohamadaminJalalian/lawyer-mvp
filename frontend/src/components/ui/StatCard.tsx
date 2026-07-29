import Link from "next/link";

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: "primary" | "accent" | "success" | "warning" | "danger" | "info";
  href?: string;
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent-dark",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export function StatCard({ icon, value, label, color, href }: StatCardProps) {
  const content = (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-foreground leading-none">
            {value}
          </p>
          <p className="text-sm text-foreground/60 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
