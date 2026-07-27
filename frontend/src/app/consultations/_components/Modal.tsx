"use client";

// مسیر این فایل: app/cases/_components/Modal.tsx
// یه پوسته مشترک برای همه مودال‌های پروژه — پس‌زمینه تیره + کارت سفید + انیمیشن نرم

import { useEffect, useState, type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string; // مثلاً "max-w-sm" یا "max-w-lg"
}

export default function Modal({
  onClose,
  children,
  maxWidthClass = "max-w-sm",
}: ModalProps) {
  // اول false، یه فریم بعد true می‌شه — همین تغییر باعث اجرای Transition ورود می‌شه
  const [mounted, setMounted] = useState(false);
  // وقتی کاربر بخواد ببنده، اول این true می‌شه تا انیمیشن خروج اجرا بشه، بعد واقعاً حذف می‌شه
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 150); // این عدد باید با duration-150 پایین هماهنگ باشه
  }

  // کلید Esc از هرجای صفحه، مودال رو با همین انیمیشن ببنده
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isVisible = mounted && !closing;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`bg-white rounded-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto transition-all duration-150 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
