import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
<div className="rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-neutral-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-neutral-900">
            {value}
          </h2>

        </div>

        <div
  className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1efe6]"
>
  <Icon className="text-[#a9762f]" size={24} />
</div>

      </div>

    </div>
  );
}
