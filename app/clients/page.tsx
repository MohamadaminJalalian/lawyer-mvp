import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { mockClients } from "@/data/mockClients";

export default function ClientsPage() {
    return (
        <div className="p-6 bg-[#f7f5f0] min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">موکلان</h1>
                <Link
                    href="/clients/new"
                    className="bg-amber-800 text-white text-sm px-4 py-2 rounded-full"
                >
                    + ثبت موکل جدید
                </Link>
            </div>

            <div className="flex gap-3 mb-4">
                <button className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full">
                    فیلتر
                </button>
                <input
                    type="text"
                    placeholder="جست‌وجو بر اساس نام، کد ملی یا موبایل"
                    className="bg-white border border-gray-200 text-sm rounded-full px-4 py-2 w-64 text-right"
                />
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f0ede6] text-gray-600">
                            <th className="p-3 text-right font-medium">نام و نام خانوادگی</th>
                            <th className="p-3 text-right font-medium">کد ملی</th>
                            <th className="p-3 text-right font-medium">شماره موبایل</th>
                            <th className="p-3 text-right font-medium">تعداد پرونده‌ها</th>
                            <th className="p-3 text-right font-medium">تاریخ ثبت</th>
                            <th className="p-3 text-center font-medium">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockClients.map((client) => (
                            <tr key={client.id} className="border-t border-gray-100">
                                <td className="p-3">{client.fullName}</td>
                                <td className="p-3">{client.nationalCode}</td>
                                <td className="p-3">{client.mobile}</td>
                                <td className="p-3">{client.caseCount}</td>
                                <td className="p-3">{client.createdAt}</td>
                                <td className="p-3 flex gap-3 justify-center text-gray-400">
                                    <Link href={`/clients/${client.id}`} title="مشاهده">
                                        <Eye size={16} />
                                    </Link>
                                    <Link href={`/clients/${client.id}/edit`} title="ویرایش">
                                        <Pencil size={16} />
                                    </Link>
                                    <button title="حذف">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-2 mt-4 justify-center text-sm">
                <button className="border border-gray-200 bg-white px-3 py-1 rounded-full">قبلی</button>
                <button className="border border-gray-200 bg-white px-3 py-1 rounded-full">1</button>
                <button className="border border-gray-200 bg-white px-3 py-1 rounded-full">2</button>
                <button className="border border-gray-200 bg-white px-3 py-1 rounded-full">بعدی</button>
            </div>
        </div>
    );
}