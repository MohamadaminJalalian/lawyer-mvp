"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import * as authApi from "../api/auth.api";
import type { User, UserRole } from "../types/auth.types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  login: (username: string, password: string, redirect?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check existing session on mount
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const me = await authApi.getMe();
        if (!cancelled) {
          setUser(me);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for 401 events from API client
  useEffect(() => {
    function handle401() {
      setUser(null);
      setError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
      const currentPath = pathname || "/";
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }

    window.addEventListener("auth:401", handle401);
    return () => window.removeEventListener("auth:401", handle401);
  }, [router, pathname]);

  const login = useCallback(
    async (username: string, password: string, redirect?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authApi.login({ username, password });
        setUser(response.user);
        // Navigate to redirect param or dashboard
        const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
        router.push(target);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطای ناشناخته";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if logout API fails, clear local state and redirect.
      // The user must never remain in a protected area with a stale session.
    } finally {
      setUser(null);
      setError(null);
      router.push("/auth/login");
    }
  }, [router]);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authenticated: !!user,
      error,
      login,
      logout,
      hasRole,
      clearError,
    }),
    [user, loading, error, login, logout, hasRole, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
