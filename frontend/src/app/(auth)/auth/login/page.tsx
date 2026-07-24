import { LoginForm } from "@/features/auth/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirect = params.redirect || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-primary-dark via-primary to-primary-light p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <LoginForm redirect={redirect} />
        </div>
        <p className="text-center text-xs text-white/50 mt-6">
          سامانه مدیریت پرونده دفتر وکالت
        </p>
      </div>
    </div>
  );
}
