"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";

import { checkForTodaysAlerts, type ActiveAlert } from "@/lib/reminders";
import { priorityLabels, priorityColors } from "@/data/calendar-entries";

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // هر ۵ دقیقه دوباره چک می‌کنه

export default function ReminderBanner() {
  const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission | "unsupported">("default");

  const runCheck = useCallback(async () => {
    const newAlerts = await checkForTodaysAlerts();
    if (newAlerts.length === 0) return;

    setAlerts((prev) => [...prev, ...newAlerts]);

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      newAlerts.forEach((a) => {
        new Notification(`یادآوری سررسید: ${a.entry.title}`, {
          body: `${priorityLabels[a.entry.priority]} — ${a.checkpointLabel}`,
          tag: a.entry.id,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    } else {
      setNotifPermission("unsupported");
    }

    runCheck();
    const interval = setInterval(runCheck, CHECK_INTERVAL_MS);

    function onVisible() {
      if (document.visibilityState === "visible") runCheck();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [runCheck]);

  async function handleEnableNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  }

  function dismiss(entryId: string) {
    setAlerts((prev) => prev.filter((a) => a.entry.id !== entryId));
  }

  return (
    <div className="space-y-2">
      {notifPermission === "default" && (
        <button
          type="button"
          onClick={handleEnableNotifications}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Bell size={14} />
          فعال‌سازی هشدار دسکتاپ برای سررسیدها
        </button>
      )}

      {alerts.map((alert) => (
        <div
          key={`${alert.entry.id}-${alert.checkpointLabel}`}
          className="flex items-start gap-3 rounded-xl border p-3.5 shadow-sm"
          style={{
            borderColor: priorityColors[alert.entry.priority],
            backgroundColor: `${priorityColors[alert.entry.priority]}12`,
          }}
        >
          <BellRing
            size={18}
            className="mt-0.5 shrink-0"
            style={{ color: priorityColors[alert.entry.priority] }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">
              {alert.entry.title}
              <span
                className="mr-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                style={{ backgroundColor: priorityColors[alert.entry.priority] }}
              >
                {priorityLabels[alert.entry.priority]}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {alert.checkpointLabel}
              {alert.entry.description ? ` — ${alert.entry.description}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dismiss(alert.entry.id)}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="بستن"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
