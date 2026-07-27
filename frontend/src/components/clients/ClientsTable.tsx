"use client";

import { Eye, Pencil } from "lucide-react";

import { Client } from "@/types/client";
import { formatJalali } from "@/lib/utils";

type Props = {
    clients: Client[];
    onView: (client: Client) => void;
    onEdit: (client: Client) => void;
};

export default function ClientsTable({ clients, onView, onEdit }: Props) {
    return (
        <>
            <div className="hidden sm:block bg-white border border-[#E4E1D8] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-right text-sm">
                    <thead>
                        <tr className="bg-[#F1EFE6]">
                            <th className="px-4 py-3 font-medium text-[#6B6A63]">نام و نام خانوادگی</th>
                            <th className="px-4 py-3 font-medium text-[#6B6A63]">کد ملی</th>
                            <th className="px-4 py-3 font-medium text-[#6B6A63]">شماره موبایل</th>
                            <th className="px-4 py-3 font-medium text-[#6B6A63]">تعداد پرونده‌ها</th>
                            <th className="px-4 py-3 font-medium text-[#6B6A63]">تاریخ ثبت</th>
                            <th className="px-4 py-3 w-[100px] font-medium text-[#6B6A63] text-center">عملیات</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} className="border-t border-[#EDEBE2] hover:bg-[#FAF9F5]">
                                <td className="px-4 py-3 text-[#262420]">
                                    {client.firstName} {client.lastName}
                                </td>
                                <td className="px-4 py-3 font-mono text-[#4B4A44]">{client.nationalCode || "-"}</td>
                                <td className="px-4 py-3 font-mono text-[#4B4A44]">{client.mobile || "-"}</td>
                                <td className="px-4 py-3 text-[#4B4A44]">{client.caseCount ?? 0}</td>
                                <td className="px-4 py-3 text-[#4B4A44]">{formatJalali(client.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-3 text-[#8C8A80]">
                                        <button title="مشاهده جزئیات" onClick={() => onView(client)} className="hover:text-[#4B4A44] transition-colors">
                                            <Eye size={17} />
                                        </button>
                                        <button title="ویرایش" onClick={() => onEdit(client)} className="hover:text-[#A9762F] transition-colors">
                                            <Pencil size={17} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3">
                {clients.map((client) => (
                    <div key={client.id} className="bg-white border border-[#E4E1D8] rounded-xl p-4">
                        <div className="font-bold text-[#262420] mb-3 text-right">
                            {client.firstName} {client.lastName}
                        </div>

                        <div className="space-y-1.5 mb-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#8C8A80]">کد ملی</span>
                                <span className="text-[#262420] font-mono">{client.nationalCode || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#8C8A80]">موبایل</span>
                                <span className="text-[#262420] font-mono">{client.mobile || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#8C8A80]">تعداد پرونده‌ها</span>
                                <span className="text-[#262420]">{client.caseCount ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#8C8A80]">تاریخ ثبت</span>
                                <span className="text-[#262420]">{formatJalali(client.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#EDEBE2] text-[#8C8A80]">
                            <button title="مشاهده جزئیات" onClick={() => onView(client)} className="hover:text-[#4B4A44] transition-colors">
                                <Eye size={18} />
                            </button>
                            <button title="ویرایش" onClick={() => onEdit(client)} className="hover:text-[#A9762F] transition-colors">
                                <Pencil size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}