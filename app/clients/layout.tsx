"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

export default function ClientsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F7F5F0]" dir="rtl">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="min-w-0 flex-1">
                <header className="flex items-center gap-3 border-b bg-white px-4 py-3 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <Menu size={20} />
                    </button>

                    <span className="font-bold">سامانه مدیریت موکلان</span>
                </header>

                {children}
            </div>
        </div>
    );
}