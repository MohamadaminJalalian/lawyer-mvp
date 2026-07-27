import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            سامانه مدیریت پرونده
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            دفتر وکالت
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 shadow-lg ring-1 ring-border sm:p-8">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            بازیابی رمز عبور
          </h2>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
              </div>
            }
          >
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
