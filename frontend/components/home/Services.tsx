import Container from "@/components/ui/Container";

const services = [
  {
    title: "مشاوره حقوقی",
    description:
      "دریافت مشاوره تخصصی از وکلای با تجربه در کمترین زمان.",
    icon: "⚖️",
  },
  {
    title: "تنظیم قرارداد",
    description:
      "تنظیم انواع قراردادهای حقوقی و تجاری با استانداردهای روز.",
    icon: "📄",
  },
  {
    title: "پیگیری پرونده",
    description:
      "مدیریت و مشاهده وضعیت پرونده‌ها به صورت آنلاین.",
    icon: "📁",
  },
  {
    title: "وکیل متخصص",
    description:
      "انتخاب بهترین وکیل بر اساس حوزه تخصصی مورد نیاز شما.",
    icon: "👨‍⚖️",
  },
  {
    title: "داوری و میانجی‌گری",
    description:
      "حل اختلافات با روش‌های سریع و کم‌هزینه.",
    icon: "🤝",
  },
  {
    title: "ثبت درخواست",
    description:
      "ثبت درخواست حقوقی و شروع فرآیند تنها در چند دقیقه.",
    icon: "📝",
  },
];

export default function Services() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            خدمات ما
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900">
            همه خدمات حقوقی در یک سامانه
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            از مشاوره اولیه تا مدیریت کامل پرونده، تمامی خدمات مورد نیاز
            شما به صورت آنلاین و یکپارچه در دسترس است.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl transition group-hover:bg-blue-600">
                <span className="group-hover:scale-110 transition">
                  {service.icon}
                </span>
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}