"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
}

export default function Modal({
  onClose,
  children,
  maxWidthClass = "max-w-4xl",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  function handleClose() {
    if (closing) return;

    setClosing(true);
    setTimeout(onClose, 150);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const isVisible = mounted && !closing;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{ fontFamily: "inherit" }}
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-xl bg-white transition-all duration-150 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
