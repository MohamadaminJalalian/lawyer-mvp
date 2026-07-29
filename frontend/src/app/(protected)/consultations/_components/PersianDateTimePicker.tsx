"use client";

import React from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


interface Props {
  date: string;
  time: string;
  onChange: (date: string, time: string) => void;
}


const days = [
  {
    weekday: "دوشنبه",
    date: "۵",
    month: "مرداد",
  },
  {
    weekday: "سه‌شنبه",
    date: "۶",
    month: "مرداد",
  },
  {
    weekday: "چهارشنبه",
    date: "۷",
    month: "مرداد",
  },
  {
    weekday: "پنجشنبه",
    date: "۸",
    month: "مرداد",
  },
  {
    weekday: "جمعه",
    date: "۹",
    month: "مرداد",
  },
  {
    weekday: "شنبه",
    date: "۱۰",
    month: "مرداد",
  },
  {
    weekday: "یکشنبه",
    date: "۱۱",
    month: "مرداد",
  },
];


const times = [
  "۰۹:۰۰",
  "۱۱:۰۰",
  "۱۴:۰۰",
  "۱۶:۳۰",
];


export default function PersianDateTimePicker({
  date,
  time,
  onChange,
}: Props) {


  return (

    <div
      className="
      rounded-2xl
      border
      border-[#E8E1D5]
      bg-white
      p-5
      "
    >


      {/* Header */}

      <div
        className="
        mb-5
        flex
        items-center
        justify-between
        "
      >

        <h3
          className="
          font-bold
          text-[#77705F]
          "
        >
          تاریخ جلسه
        </h3>


        <div className="flex gap-2">

          <button
            type="button"
            className="
            rounded-lg
            border
            border-[#E8E1D5]
            p-2
            "
          >
            <ChevronRight size={18}/>
          </button>


          <button
            type="button"
            className="
            rounded-lg
            border
            border-[#E8E1D5]
            p-2
            "
          >
            <ChevronLeft size={18}/>
          </button>

        </div>

      </div>



      {/* Days */}

      <div
        className="
        flex
        gap-3
        overflow-x-auto
        "
      >

        {days.map((item)=>(

          <button

            type="button"

            key={item.date}

            onClick={() =>
              onChange(
                item.date,
                time
              )
            }

            className={`
              min-w-[65px]
              rounded-xl
              border
              p-3

              ${
                date === item.date
                  ?
                "border-[#A9762F] bg-[#F6EBD9]"
                  :
                "border-[#E8E1D5]"
              }
            `}

          >

            <p className="text-xs text-[#77705F]">
              {item.weekday}
            </p>


            <p
              className="
              my-2
              text-xl
              font-bold
              "
            >
              {item.date}
            </p>


            <p
              className="
              text-xs
              text-[#77705F]
              "
            >
              {item.month}
            </p>


          </button>

        ))}

      </div>




      {/* Times */}

      <div className="mt-6">


        <p
          className="
          mb-3
          font-bold
          text-[#77705F]
          "
        >
          ساعت جلسه
        </p>



        <div
          className="
          grid
          grid-cols-4
          gap-3
          "
        >

          {times.map((itemTime)=>(

            <button

              type="button"

              key={itemTime}


              onClick={() =>
                onChange(
                  date,
                  itemTime
                )
              }


              className={`
                rounded-xl
                border
                py-3

                ${
                  time === itemTime
                    ?
                  "bg-[#A9762F] text-white"
                    :
                  "border-[#E8E1D5]"
                }
              `}

            >

              {itemTime}

            </button>

          ))}


        </div>


      </div>





      {/* Status */}

      <div
        className="
        mt-5
        flex
        items-center
        gap-2
        rounded-xl
        bg-[#EEE9FF]
        p-3
        text-sm
        text-[#6554D9]
        "
      >

        <CalendarDays size={18}/>


        {
          date && time
            ?
          "جلسه آماده ثبت است."
            :
          "هنوز تاریخ و ساعتی انتخاب نشده است."
        }


      </div>


    </div>

  );

}