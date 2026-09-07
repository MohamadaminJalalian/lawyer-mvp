import StatsSection from "./StatsSection";
import ImportantCases from "./ImportantCases";
import ImportantNotices from "./ImportantNotices";
import JusticeBanner from "./JusticeBanner";
import JudicialCalendar from "./JudicialCalendar";
import ReminderBanner from "./ReminderBanner";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">


      {/* محتوای اصلی */}

      <main className="">


        <div
          dir="rtl"
          className="mx-auto max-w-7xl"
        >


          {/* هشدارهای سررسید */}

          <div className="mb-4">
            <ReminderBanner />
          </div>


          {/* طرح تزئینی ترازوی عدالت + تقویم قضایی */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <JusticeBanner />
            </div>
            <JudicialCalendar />
          </div>



          {/* کارت‌های آماری */}

          <StatsSection />





          {/* پرونده‌های مهم + اطلاعیه‌های مهم */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
