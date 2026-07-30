"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
}

export function Modal({ onClose, children, maxWidthClass = "max-w-md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`fixed inset-0 m-auto max-h-[85vh] overflow-y-auto backdrop:bg-black/50 rounded-xl border border-slate-200 p-0 w-full ${maxWidthClass} shadow-xl`}
    >
      {children}
    </dialog>
  );
}

export default Modal;