import type { ReactNode } from "react";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F7F5F0]">{children}</main>
  );
}