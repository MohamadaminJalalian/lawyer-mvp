"use client";

import { useEffect, useRef, useState } from "react";
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
  const target = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = value.replace(/^\d+/, ""); // اگه بعد از عدد چیزی مثل "+" بود، حفظ می‌شه
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">
            {count}
            {suffix}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1efe6]">
          <Icon className="text-[#a9762f]" size={24} />
        </div>
      </div>
    </div>
  );
}
