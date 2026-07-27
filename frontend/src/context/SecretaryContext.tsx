"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Secretary, SecretaryPermissions } from "@/types/secretary";
import { mockSecretaries } from "@/data/mockSecretaries";

type SecretaryContextType = {
  secretaries: Secretary[];
  addSecretary: (data: {
    name: string;
    mobile: string;
    permissions: SecretaryPermissions;
  }) => Secretary;
  removeSecretary: (id: string) => void;
  updatePermissions: (id: string, permissions: SecretaryPermissions) => void;
  updateProfile: (id: string, data: { name: string; mobile: string }) => void;
  getSecretaryById: (id: string) => Secretary | undefined;
};

const SecretaryContext = createContext<SecretaryContextType | null>(null);

export function SecretaryProvider({ children }: { children: ReactNode }) {
  const [secretaries, setSecretaries] = useState<Secretary[]>(mockSecretaries);

  function addSecretary(data: {
    name: string;
    mobile: string;
    permissions: SecretaryPermissions;
  }): Secretary {
    const newSecretary: Secretary = {
      id: Date.now().toString(),
      name: data.name,
      mobile: data.mobile,
      online: false,
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
    };

    setSecretaries((prev) => [...prev, newSecretary]);

    return newSecretary;
  }

  function removeSecretary(id: string) {
    setSecretaries((prev) => prev.filter((s) => s.id !== id));
  }

  function updatePermissions(id: string, permissions: SecretaryPermissions) {
    setSecretaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, permissions } : s))
    );
  }

  function updateProfile(id: string, data: { name: string; mobile: string }) {
    setSecretaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }

  function getSecretaryById(id: string) {
    return secretaries.find((s) => s.id === id);
  }

  return (
    <SecretaryContext.Provider
      value={{
        secretaries,
        addSecretary,
        removeSecretary,
        updatePermissions,
        updateProfile,
        getSecretaryById,
      }}
    >
      {children}
    </SecretaryContext.Provider>
  );
}

export function useSecretaries() {
  const context = useContext(SecretaryContext);

  if (!context) {
    throw new Error("useSecretaries must be used inside SecretaryProvider");
  }

  return context;
}