import StatsSection from "./StatsSection";
import ImportantCases from "./ImportantCases";
import ImportantNotices from "./ImportantNotices";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">


      {/* محتوای اصلی */}

      <main className="px-8 py-10">


        <div
          dir="rtl"
          className="mx-auto max-w-7xl"
        >


          {/* Header */}

          <h1 className="text-4xl font-bold text-neutral-900">
            داشبورد
          </h1>


          <p className="mt-2 text-sm text-neutral-500">
            نمای کلی پرونده‌ها و فعالیت‌های دفتر
          </p>




          {/* کارت‌های آماری */}

          <StatsSection />





          {/* پرونده‌های مهم + اطلاعیه‌های مهم */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


            <div className="xl:col-span-2">

              <ImportantCases />

            </div>



            <div className="xl:col-span-1">

              <ImportantNotices />

            </div>


          </div>




        </div>


      </main>



      

      


    </div>
  );
}