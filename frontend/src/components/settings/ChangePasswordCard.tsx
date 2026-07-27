"use client";

import { useState } from "react";
import { Lock, ChevronLeft } from "lucide-react";

import ChangePasswordModal from "./ChangePasswordModal";

export default function ChangePasswordCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-5 max-w-sm">
      <h2 className="font-bold text-[#262420] text-sm mb-3">امنیت حساب</h2>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full flex items-center justify-between bg-[#F7F5F0] border border-[#E4E1D8] rounded-lg px-3.5 py-3 text-sm text-[#262420] hover:bg-[#F1EFE6] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Lock size={16} className="text-[#8C8A80]" />
          تغییر رمز عبور
        </span>
        <ChevronLeft size={16} className="text-[#8C8A80]" />
      </button>

      {modalOpen && (
        <ChangePasswordModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}