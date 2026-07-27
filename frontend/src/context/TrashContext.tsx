"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { TrashFile } from "@/types/trash";
import { mockTrash } from "@/data/mockTrash";

type TrashContextType = {
  trashFiles: TrashFile[];
  restoreFile: (id: string) => void;
  permanentlyDeleteFile: (id: string) => void;
};

const TrashContext = createContext<TrashContextType | null>(null);

export function TrashProvider({ children }: { children: ReactNode }) {
  const [trashFiles, setTrashFiles] = useState<TrashFile[]>(mockTrash);

  function restoreFile(id: string) {
    setTrashFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function permanentlyDeleteFile(id: string) {
    setTrashFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <TrashContext.Provider
      value={{ trashFiles, restoreFile, permanentlyDeleteFile }}
    >
      {children}
    </TrashContext.Provider>
  );
}

export function useTrash() {
  const context = useContext(TrashContext);

  if (!context) {
    throw new Error("useTrash must be used inside TrashProvider");
  }

  return context;
}