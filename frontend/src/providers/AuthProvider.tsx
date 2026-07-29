"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, logoutRequest } from "@/features/auth/api/auth.api";
import { registerUnauthorizedHandler } from "@/lib/api-client";
import type {
  AuthStatus,
  AuthUser,
  UserRole,
} from "@/features/auth/types/auth.types";
import { buildLoginUrl } from "@/features/auth/utils/auth-redirect";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
  setUserAfterLogin: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    setStatus("loading");
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  // بازیابی نشست بعد از هر بار لود/Refresh صفحه
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ثبت هندلر متمرکز 401
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearSession();
      const currentPath = window.location.pathname + window.location.search;
      router.push(buildLoginUrl(currentPath));
    });
  }, [clearSession, router]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // طبق سند: حتی اگه API خروج خطا بده، کاربر نباید توی محیط محافظت‌شده بمونه
    } finally {
      clearSession();
      router.push("/auth/login");
    }
  }, [clearSession, router]);

  const setUserAfterLogin = useCallback((loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    setStatus("authenticated");
  }, []);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, status, hasRole, refreshUser, setUserAfterLogin, logout }),
    [user, status, hasRole, refreshUser, setUserAfterLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
