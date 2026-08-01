import StatsSection from "./StatsSection";
import ImportantCases from "./ImportantCases";
import ImportantNotices from "./ImportantNotices";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* محتوای اصلی */}
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div dir="rtl" className="mx-auto max-w-7xl">
          {/* Header */}
          <h1 className="text-xl font-bold text-[#262420]">
            داشبورد
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            نمای کلی پرونده‌ها و فعالیت‌های دفتر
          </p>

          {/* کارت‌های آماری */}
          <StatsSection />

          {/* پرونده‌های مهم + اطلاعیه‌های مهم */}
          {/* توجه: عمداً تا breakpoint خود xl تک‌ستونه نگه داشته شده تا جدول‌ها
              نصف عرض نشن و مجبور به اسکرول افقی نشن. */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="h-full xl:col-span-2">
              <ImportantCases />
            </div>
            <div className="h-full xl:col-span-1">
              <ImportantNotices />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
