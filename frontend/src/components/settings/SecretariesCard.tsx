"use client";

import { useState } from "react";
import { ShieldCheck, UserX } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useSecretaries } from "@/context/SecretaryContext";
import { Secretary } from "@/types/secretary";
import AddSecretaryModal from "./AddSecretaryModal";
import SecretaryPermissionsModal from "./SecretaryPermissionsModal";

function StatusBadge({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${
        online ? "text-[#2F6B4F]" : "text-[#8C8A80]"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          online ? "bg-[#2F6B4F]" : "bg-[#B4B2A9]"
        }`}
      />
      {online ? "آنلاین" : "آفلاین"}
    </span>
  );
}

export default function SecretariesCard() {
  const { secretaries, removeSecretary } = useSecretaries();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [permissionsFor, setPermissionsFor] = useState<Secretary | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Secretary | null>(null);

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[#262420] text-sm">لیست منشی‌ها</h2>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-[#A9762F] text-white rounded-lg text-sm font-medium hover:bg-[#946A2A] transition-colors whitespace-nowrap"
        >
          + افزودن منشی
        </button>
      </div>

      {secretaries.length === 0 ? (
        <p className="text-sm text-[#8C8A80]">هنوز منشی‌ای ثبت نشده است.</p>
      ) : (
        <>
          <div className="hidden sm:block border border-[#E4E1D8] rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-right text-sm">
              <thead>
                <tr className="bg-[#F1EFE6]">
                  <th className="px-4 py-2.5 font-medium text-[#6B6A63]">
                    نام منشی
                  </th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6A63]">
                    وضعیت
                  </th>
                  <th className="px-4 py-2.5 w-[100px] font-medium text-[#6B6A63] text-center">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {secretaries.map((secretary) => (
                  <tr
                    key={secretary.id}
                    className="border-t border-[#EDEBE2] hover:bg-[#FAF9F5]"
                  >
                    <td className="px-4 py-3 text-[#262420]">
                      {secretary.name}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge online={secretary.online} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 text-[#8C8A80]">
                        <button
                          title="سطح دسترسی"
                          onClick={() => setPermissionsFor(secretary)}
                          className="hover:text-[#A9762F] transition-colors"
                        >
                          <ShieldCheck size={17} />
                        </button>
                        <button
                          title="عزل منشی"
                          onClick={() => setPendingRemove(secretary)}
                          className="hover:text-[#A32D2D] transition-colors"
                        >
                          <UserX size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {secretaries.map((secretary) => (
              <div
                key={secretary.id}
                className="border border-[#E4E1D8] rounded-lg p-3.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#262420] text-sm">
                    {secretary.name}
                  </span>
                  <StatusBadge online={secretary.online} />
                </div>

                <div className="flex items-center justify-center gap-6 pt-2.5 border-t border-[#EDEBE2] text-[#8C8A80]">
                  <button
                    title="سطح دسترسی"
                    onClick={() => setPermissionsFor(secretary)}
                    className="hover:text-[#A9762F] transition-colors"
                  >
                    <ShieldCheck size={18} />
                  </button>
                  <button
                    title="عزل منشی"
                    onClick={() => setPendingRemove(secretary)}
                    className="hover:text-[#A32D2D] transition-colors"
                  >
                    <UserX size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {addModalOpen && (
        <AddSecretaryModal onClose={() => setAddModalOpen(false)} />
      )}

      {permissionsFor && (
        <SecretaryPermissionsModal
          secretary={permissionsFor}
          onClose={() => setPermissionsFor(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(pendingRemove)}
        title="عزل منشی"
        message={`آیا از عزل «${pendingRemove?.name}» مطمئن هستید؟ این منشی دیگر امکان ورود به سامانه را نخواهد داشت.`}
        confirmLabel="عزل منشی"
        variant="danger"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (pendingRemove) removeSecretary(pendingRemove.id);
          setPendingRemove(null);
        }}
      />
    </div>
  );
}