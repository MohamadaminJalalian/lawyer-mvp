"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const phrases = [
  "مدیریت هوشمند پرونده‌ها",
  "مدیریت هوشمند موکلین و اسناد",
  "مدیریت هوشمند اطلاعیه‌ها و جلسات",
  "همه‌چیز در یک محیط حرفه‌ای",
];

export default function JusticeBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D6] bg-linear-to-l from-[#FCF6EA] via-[#FEFCF8] to-white">
      <div className="flex flex-col-reverse items-center gap-6 px-6 py-9 sm:flex-row sm:justify-between sm:px-10 sm:py-11">
        {/* متن */}
        <div className="text-center sm:text-right">
          <h2 className="text-xl font-bold text-[#262420] sm:text-2xl">
            سامانه مدیریت پرونده‌های موکلان
          </h2>

          <p
            key={index}
            className="jb-fade mt-2 min-h-[1.5rem] max-w-md text-sm leading-6 text-[#8C8A80]"
          >
            {phrases[index]}
          </p>
        </div>

        {/* تصویر ترازو + چکش */}
        <div className="jb-float relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl sm:h-60 sm:w-60">
          <Image
            src="/images/scale-gavel-cutout-rm-background.png"
            alt="ترازوی عدالت"
            fill
            className="rounded-2xl object-contain"
            priority
          />
        </div>
      </div>

      <style>{`
        .jb-float {
          animation: jb-float 4s ease-in-out infinite;
        }

        @keyframes jb-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .jb-fade {
          animation: jb-fade 0.6s ease;
        }

        @keyframes jb-fade {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .jb-float, .jb-fade {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
