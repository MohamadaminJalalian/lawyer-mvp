"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Client } from "@/features/clients/types/client.types";
import { Case } from "@/features/cases/types/case.types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { apiClient } from "@/lib/api-client";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدیر دفتر",
  STAFF: "کارمند",
};

interface DashboardStats {
  totalClients: number;
  activeCases: number;
  closedCases: number;
  archivedCases: number;
  recentClients: Client[];
  recentCases: Case[];
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole("ADMIN");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiClient.get<DashboardStats>("/dashboard/stats");
        setStats(data);
      } catch {
        setError("امکان بارگذاری اطلاعات داشبورد وجود ندارد.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-danger text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-l from-primary to-primary-light text-white">
        <h1 className="text-2xl font-bold">
          {user ? `خوش آمدید، ${user.fullName}` : "داشبورد"}
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {user && `${ROLE_LABELS[user.role] || user.role} — `}
          {today}
        </p>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            value={stats.totalClients}
            label="موکل‌ها"
            color="primary"
            href="/clients"
          />
          <StatCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
            value={stats.activeCases}
            label="پرونده‌های فعال"
            color="success"
            href="/cases"
          />
          <StatCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
            value={stats.closedCases}
            label="پرونده‌های بسته‌شده"
            color="info"
            href="/cases"
          />
          {isAdmin && (
            <StatCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              }
              value={stats.archivedCases}
              label="بایگانی شده"
              color="warning"
              href="/cases"
            />
          )}
        </div>
      )}

      {/* Recent Tables */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Clients */}
          <DashboardTable
            title="آخرین موکل‌ها"
            viewAllHref="/clients"
            rows={stats.recentClients}
            columns={[
              {
                key: "fullName",
                label: "نام",
                render: (client) => (
                  <span className="font-medium text-foreground">
                    {client.fullName}
                  </span>
                ),
              },
              {
                key: "phone",
                label: "تلفن",
                render: (client) => (
                  <span className="text-foreground/60" dir="ltr">
                    {client.phone}
                  </span>
                ),
              },
              {
                key: "caseCount",
                label: "پرونده",
                render: (client) => (
                  <span className="text-foreground/60">{client.caseCount}</span>
                ),
                className: "text-center",
              },
              {
                key: "createdAt",
                label: "تاریخ",
                render: (client) => (
                  <span className="text-foreground/50 text-xs">
                    {new Date(client.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                ),
              },
            ]}
          />

          {/* Recent Cases */}
          <DashboardTable
            title="آخرین پرونده‌ها"
            viewAllHref="/cases"
            rows={stats.recentCases}
            columns={[
              {
                key: "title",
                label: "موضوع",
                render: (caseItem) => (
                  <span className="font-medium text-foreground">
                    {caseItem.title}
                  </span>
                ),
              },
              {
                key: "status",
                label: "وضعیت",
                render: (caseItem) => <StatusBadge status={caseItem.status} />,
              },
              {
                key: "priority",
                label: "اولویت",
                render: (caseItem) => (
                  <PriorityBadge priority={caseItem.priority} />
                ),
              },
              {
                key: "lastUpdate",
                label: "بروزرسانی",
                render: (caseItem) => (
                  <span className="text-foreground/50 text-xs">
                    {new Date(caseItem.lastUpdate).toLocaleDateString("fa-IR")}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
