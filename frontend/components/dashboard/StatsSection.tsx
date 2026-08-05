"use client";

import {
  FolderOpen,
  Users,
  CalendarDays,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsSection() {
  return (
    <section className="mt-8">

      <div
    dir="rtl"
  className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
>

        <StatCard
          title="کل پرونده‌ها"
          value="248"
          icon={FolderOpen}
          color="bg-blue-600"
        />

        <StatCard
          title="کل موکل‌ها"
          value="132"
          icon={Users}
          color="bg-emerald-500"
        />

        <StatCard
          title="جلسات نزدیک"
          value="18"
          icon={CalendarDays}
          color="bg-orange-500"
        />

      </div>

    </section>
  );
}