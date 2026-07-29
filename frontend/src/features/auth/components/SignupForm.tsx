"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordRequest } from "../api/auth.api";

type FormStatus = "idle" | "submitting" | "error";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!password) errors.password = "رمز عبور را وارد کنید.";
    else if (password.length < 6)
      errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";

    if (!confirmPassword)
      errors.confirmPassword = "تکرار رمز عبور را وارد کنید.";
    else if (password !== confirmPassword)
      errors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormMessage(null);
    if (!validate()) return;

    setFormStatus("submitting");
    try {
      await resetPasswordRequest({ token, password });
      router.push("/auth/login?reset=success");
    } catch (err) {
      setFormStatus("error");
      const message =
        err instanceof Error
          ? err.message
          : "تغییر رمز عبور با خطا مواجه شد. لطفاً دوباره تلاش کنید.";
      setFormMessage(message);
    } finally {
      setFormStatus((current) => (current === "submitting" ? "idle" : current));
    }
  }

  const isSubmitting = formStatus === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate dir="rtl" className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-card-foreground"
        >
          رمز عبور جدید
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={Boolean(fieldErrors.password)}
            placeholder="رمز عبور جدید را وارد کنید"
            className="block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={isSubmitting}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-card-foreground"
        >
          تکرار رمز عبور
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          placeholder="رمز عبور را دوباره وارد کنید"
          className="block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {fieldErrors.confirmPassword && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      {formMessage && (
        <div
          role="alert"
          className="rounded-lg px-3.5 py-2.5 text-sm bg-destructive/10 text-destructive"
        >
          {formMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            در حال ذخیره...
          </>
        ) : (
          "ذخیره رمز عبور جدید"
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        <a
          href="/auth/login"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          بازگشت به صفحه ورود
        </a>
      </p>
    </form>
  );
}
