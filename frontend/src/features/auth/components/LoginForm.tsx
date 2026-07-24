"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginForm({ redirect }: { redirect?: string }) {
  const { login, error: authError, loading: authLoading, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = "نام کاربری را وارد کنید.";
    } else if (username.trim().length < 3) {
      newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد.";
    }

    if (!password) {
      newErrors.password = "رمز عبور را وارد کنید.";
    } else if (password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(username.trim(), password, redirect);
    } catch {
      // Error is handled by AuthProvider and displayed via authError
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = submitting || authLoading;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo / Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white text-2xl font-bold mb-4">
          و
        </div>
        <h1 className="text-2xl font-bold text-foreground">ورود به سامانه</h1>
        <p className="text-sm text-foreground/60 mt-2">
          مدیریت پرونده دفتر وکالت
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Auth error message */}
        {authError && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-fade-in">
            {authError}
          </div>
        )}

        {/* Username field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            نام کاربری
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            autoComplete="username"
            autoFocus
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-foreground placeholder-foreground/40 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
              errors.username
                ? "border-danger"
                : "border-border hover:border-primary/40"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="نام کاربری خود را وارد کنید"
          />
          {errors.username && (
            <p className="mt-1.5 text-xs text-danger animate-fade-in">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            رمز عبور
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete="current-password"
              disabled={isLoading}
              className={`w-full px-4 py-3 pl-12 rounded-lg border bg-white text-foreground placeholder-foreground/40 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                errors.password
                  ? "border-danger"
                  : "border-border hover:border-primary/40"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="رمز عبور خود را وارد کنید"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger animate-fade-in">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-light active:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              در حال ورود...
            </span>
          ) : (
            "ورود به سامانه"
          )}
        </button>
      </form>
    </div>
  );
}
