"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-black/50 rounded-xl border border-slate-200 p-0 w-full max-w-md shadow-xl"
    >
      <div className="p-6">
        {title && (
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            {title}
          </h2>
        )}
        <div className="text-slate-700 text-sm leading-relaxed mb-6">
          {children}
        </div>
        {actions && (
          <div className="flex gap-3 justify-start">{actions}</div>
        )}
      </div>
    </dialog>
  );
}