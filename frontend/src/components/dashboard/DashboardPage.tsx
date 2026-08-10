import StatsSection from "./StatsSection";
import ImportantCases from "./ImportantCases";
import ImportantNotices from "./ImportantNotices";
import JusticeBanner from "./JusticeBanner";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">


      {/* محتوای اصلی */}

      <main className="">


        <div
          dir="rtl"
          className="mx-auto max-w-7xl"
        >


          {/* طرح تزئینی ترازوی عدالت */}

          <JusticeBanner />



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