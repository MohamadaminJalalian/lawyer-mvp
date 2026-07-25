import ClientForm from "@/components/clients/ClientForm";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function NewClientPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb trail={["داشبورد", "موکل‌ها", "ثبت موکل جدید"]} title="ثبت موکل جدید" />
      <ClientForm />
    </div>
  );
}