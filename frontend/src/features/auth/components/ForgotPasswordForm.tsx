"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPasswordRequest } from "../api/auth.api";

type FormStatus = "idle" | "submitting" | "error";

interface FieldErrors {
  username?: string;
}

export function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const router = useRouter();

  function validate(): boolean {
    const errors: FieldErrors = {};
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      errors.username = "نام کاربری را وارد کنید.";
    } else if (trimmedUsername.length < 3) {
      errors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormMessage(null);
    if (!validate()) return;

    setFormStatus("submitting");
    try {
      await forgotPasswordRequest({ username: username.trim() });
      router.push(`/auth/verify-otp?username=${encodeURIComponent(username.trim())}`);
    } catch {
      setFormStatus("error");
      setFormMessage("ارسال کد با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setFormStatus((current) => (current === "submitting" ? "idle" : current));
    }
  }

  const isSubmitting = formStatus === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate dir="rtl" className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-card-foreground"
        >
          نام کاربری
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          autoComplete="username"
          aria-invalid={Boolean(fieldErrors.username)}
          placeholder="نام کاربری خود را وارد کنید"
          className="block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {fieldErrors.username && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">
            {fieldErrors.username}
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
            در حال ارسال...
          </>
        ) : (
          "ارسال کد تایید"
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          بازگشت به صفحه ورود
        </Link>
      </p>
    </form>
  );
}
