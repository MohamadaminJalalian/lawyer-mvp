"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ClientForm from "@/components/clients/ClientForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Skeleton from "@/components/ui/Skeleton";
import { useClients } from "@/context/ClientContext";
import { Client } from "@/types/client";

const crumbs = ["داشبورد", "موکل‌ها", "ویرایش موکل"];

export default function EditClientPage() {
    const params = useParams<{ id: string }>();
    const { getClientById } = useClients();

    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<Client | undefined>(undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            setClient(getClientById(params.id));
            setLoading(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, 400);
        return () => clearTimeout(timer);
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Breadcrumb trail={crumbs} title="ویرایش موکل" />

                <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="max-w-2xl mx-auto">
                <Breadcrumb trail={crumbs} title="ویرایش موکل" />

                <div className="bg-white border border-[#E4E1D8] rounded-xl p-10 text-center">
                    <p className="mb-6 text-sm text-[#8C8A80]">
                        موکل موردنظر پیدا نشد یا حذف شده است.
                    </p>

                    <Link
                        href="/clients"
                        className="inline-block px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors"
                    >
                        بازگشت به موکل‌ها
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Breadcrumb trail={crumbs} title="ویرایش موکل" />
            <ClientForm clientId={client.id} initialValues={client} />
        </div>
    );
}