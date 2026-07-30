import Image from "next/image";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Background Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>

        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"></div>
      </div>

      <Container>
        <div className="grid min-h-[90vh] items-center gap-16 lg:grid-cols-2">
          {/* متن */}
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              سامانه هوشمند وکالت
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
              خدمات حقوقی
              <br />
              سریع، مطمئن و آنلاین
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-9 text-slate-600">
              ارتباط مستقیم با وکلای متخصص، ثبت درخواست مشاوره، مدیریت پرونده و
              پیگیری کامل فرآیندهای حقوقی در یک بستر مدرن و امن.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button>شروع کنید</Button>

              <Button variant="secondary">
                مشاهده خدمات
              </Button>
            </div>
          </div>

          {/* تصویر */}
          <div className="relative">
            <div className="relative h-[550px] overflow-hidden rounded-[40px] shadow-2xl">
              <Image
                src="/images/hero-image.png.jpg"
                alt="Hero Image"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* کارت شناور */}
            <div className="absolute -bottom-8 -left-6 rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-slate-500">
                پرونده‌های موفق
              </p>

              <h2 className="mt-2 text-4xl font-black text-blue-600">
                +2500
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                در سراسر کشور
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}