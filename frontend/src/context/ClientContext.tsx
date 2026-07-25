"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Client } from "@/types/client";
import { mockClients } from "@/data/mockClients";

type ClientContextType = {
  clients: Client[];
  addClient: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => Client;
  updateClient: (id: string, data: Partial<Client>) => Client | null;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  isNationalCodeTaken: (nationalCode: string, excludeId?: string) => boolean;
};

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(mockClients);

  function addClient(
    data: Omit<Client, "id" | "createdAt" | "updatedAt">
  ): Client {
    const now = new Date().toISOString();

    const newClient: Client = {
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    setClients((prev) => [...prev, newClient]);

    return newClient;
  }

  function updateClient(id: string, data: Partial<Client>): Client | null {
    let updated: Client | null = null;

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updated = { ...c, ...data, updatedAt: new Date().toISOString() };
          return updated;
        }
        return c;
      })
    );

    return updated;
  }

  function deleteClient(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function getClientById(id: string) {
    return clients.find((c) => c.id === id);
  }

  function isNationalCodeTaken(nationalCode: string, excludeId?: string) {
    return clients.some(
      (c) => c.nationalCode === nationalCode && c.id !== excludeId
    );
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        isNationalCodeTaken,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClients must be used inside ClientProvider");
  }

  return context;
}