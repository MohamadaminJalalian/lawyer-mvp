import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh grid-cols-1 overflow-hidden bg-background md:grid-cols-[1.05fr_1fr]">
      {/* لکه‌های رنگی محو؛ همین‌ها هستند که پشت کارت شیشه‌ای واقعاً «دیده» و بلور می‌شوند */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-[100px]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[24rem] w-[24rem] rounded-full bg-primary-dark/30 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 -z-10 h-[22rem] w-[22rem] rounded-full bg-success/20 blur-[100px]" />

      {/* ستون فرم — در RTL سمت راست صفحه */}
      <div className="relative z-10 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              سامانه مدیریت پرونده
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">دفتر وکالت</p>
          </div>

          {/* کارت شیشه‌ای: شفافیت بیشتر تا لکه‌های رنگی پشتش واقعاً دیده شوند */}
          <div className="rounded-2xl border border-white/50 bg-white/15 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground">
              ورود به حساب کاربری
            </h2>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ستون تصویر — فقط ترازو و چکش، بدون قاب یا پس‌زمینه، فقط در دسکتاپ */}
      <div className="relative z-10 hidden items-center justify-center p-8 md:flex">
        <div className="relative aspect-square w-full max-w-sm">
          <Image
            src="/images/scale-gavel-cutout-rm-background.png"
            alt="ترازو و چکش، نماد عدالت"
            fill
            sizes="(min-width: 768px) 35vw, 100vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </main>
  );
}
