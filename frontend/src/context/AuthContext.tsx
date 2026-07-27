"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { CurrentUser, UserRole } from "@/types/auth";

const lawyerUser: CurrentUser = {
  name: "محمد احمدی",
  role: "LAWYER",
  title: "وکیل پایه یک دادگستری",
};

const secretaryUser: CurrentUser = {
  name: "سارا محمدی",
  role: "SECRETARY",
  title: "منشی",
  secretaryId: "sec-1",
};

type AuthContextType = {
  currentUser: CurrentUser;
  isLawyer: boolean;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(lawyerUser);

  function setRole(role: UserRole) {
    setCurrentUser(role === "LAWYER" ? lawyerUser : secretaryUser);
  }

  function toggleRole() {
    setCurrentUser((prev) =>
      prev.role === "LAWYER" ? secretaryUser : lawyerUser
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLawyer: currentUser.role === "LAWYER",
        setRole,
        toggleRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}