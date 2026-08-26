// داشبورد روی ریشه‌ی گروه (protected) قرار داره، نه مسیر /dashboard
const DEFAULT_REDIRECT = "/";

export function buildLoginUrl(currentPath: string): string {
  if (!currentPath || currentPath === "/auth/login") return "/auth/login";
  return `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
}

export function resolveRedirectTarget(redirectParam: string | null): string {
  if (!redirectParam) return DEFAULT_REDIRECT;
  // فقط مسیرهای داخلی (که با یک "/" تنها شروع می‌شن) مجازن
  if (!redirectParam.startsWith("/") || redirectParam.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }
  return redirectParam;
}
