// مسیر این فایل: app/cases/layout.tsx

import type { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#F7F5F0] p-4 md:p-8">{children}</main>
    </div>
  );
}
