"use client";

import { Eye } from "lucide-react";

export default function ImportantNotices() {


  const notices = [
    {
      id: 1,
      title: "جلسه دادگاه پرونده احمدی",
      date: "1405/03/20",
      priority: "مهم",
    },
    {
      id: 2,
      title: "ارسال لایحه دفاعیه",
      date: "1405/03/22",
      priority: "متوسط",
    },
    {
      id: 3,
      title: "تمدید قرارداد موکل",
      date: "1405/03/25",
      priority: "عادی",
    },
  ];



  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">


      {/* Title */}

      <h2 className="mb-5 text-xl font-semibold text-neutral-900">
        اطلاعیه‌های مهم
      </h2>




      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200">


        <table className="w-full text-right">


          <thead className="bg-slate-50">

            <tr>

              <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                عنوان
              </th>


              <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                تاریخ
              </th>


              <th className="px-5 py-3 text-sm font-semibold text-neutral-700">
                اولویت
              </th>


              <th className="px-5 py-3 text-center text-sm font-semibold text-neutral-700">
                مشاهده
              </th>


            </tr>

          </thead>




          <tbody>


            {
              notices.map((notice)=>(


                <tr
                  key={notice.id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
                >



                  <td className="max-w-[160px] px-5 py-4 text-sm text-neutral-700">
                    {notice.title}
                  </td>



                  <td className="px-5 py-4 text-sm text-neutral-700">
                    {notice.date}
                  </td>



                  <td className="px-5 py-4">


                    <span
                      className={`
                        rounded-full px-3 py-1 text-xs font-medium

                        ${
                          notice.priority === "مهم"
                          ?
                          "bg-red-100 text-red-700"
                          :
                          notice.priority === "متوسط"
                          ?
                          "bg-orange-100 text-orange-700"
                          :
                          "bg-blue-100 text-blue-700"
                        }

                      `}
                    >

                      {notice.priority}

                    </span>


                  </td>




                  <td className="px-5 py-4 text-center">


                    <button
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
                    >

                      <Eye size={20}/>

                    </button>


                  </td>



                </tr>


              ))
            }



          </tbody>



        </table>



      </div>



    </section>
  );
}