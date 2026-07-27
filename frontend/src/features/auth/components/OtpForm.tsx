"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyOtpRequest } from "../api/auth.api";

type FormStatus = "idle" | "submitting" | "error";

export function OtpForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const router = useRouter();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Countdown timer
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  function handleDigitChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setFieldError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] ?? "";
    }
    setDigits(newDigits);
    setFieldError(null);

    const nextEmpty = newDigits.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleResend() {
    setCountdown(60);
    setCanResend(false);
    setFormMessage(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormMessage(null);

    const code = digits.join("");
    if (code.length < 6) {
      setFieldError("کد را کامل وارد کنید.");
      return;
    }

    setFormStatus("submitting");
    try {
      await verifyOtpRequest({ phone, code });
      router.push(`/auth/reset-password?token=${encodeURIComponent("mock-reset-token")}`);
    } catch (err) {
      setFormStatus("error");
      const message =
        err instanceof Error ? err.message : "تایید کد با خطا مواجه شد.";
      setFormMessage(message);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setFormStatus((current) => (current === "submitting" ? "idle" : current));
    }
  }

  const isSubmitting = formStatus === "submitting";
  const formattedPhone = phone.replace(/(\d{4})$/, "xxxx$1");

  return (
    <form onSubmit={handleSubmit} noValidate dir="rtl" className="space-y-5">
      <p className="text-sm text-muted-foreground text-center">
        کد ارسال شده به شماره <span className="font-medium text-foreground">{formattedPhone}</span> را
        وارد کنید
      </p>

      <div className="flex justify-center gap-2" dir="ltr">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={isSubmitting}
            className="h-12 w-12 rounded-lg border border-border bg-background text-center text-lg font-medium text-foreground transition-colors hover:border-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={` رقم ${i + 1} کد تایید`}
          />
        ))}
      </div>

      {fieldError && (
        <p role="alert" className="text-center text-xs text-destructive">
          {fieldError}
        </p>
      )}

      {formMessage && (
        <div
          role="alert"
          className="rounded-lg px-3.5 py-2.5 text-sm bg-destructive/10 text-destructive text-center"
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
            در حال تایید...
          </>
        ) : (
          "تایید کد"
        )}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            ارسال مجدد کد
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">
            ارسال مجدد کد تا {countdown} ثانیه دیگر
          </span>
        )}
      </div>

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
