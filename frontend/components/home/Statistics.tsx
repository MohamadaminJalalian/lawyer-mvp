import Container from "@/components/ui/Container";

const stats = [
  {
    number: "+2500",
    label: "پرونده موفق",
  },
  {
    number: "+500",
    label: "وکیل متخصص",
  },
  {
    number: "98%",
    label: "رضایت کاربران",
  },
  {
    number: "24/7",
    label: "پشتیبانی",
  },
];

export default function Statistics() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-4xl font-black text-blue-600">
                {item.number}
              </h3>

              <p className="mt-3 text-slate-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}