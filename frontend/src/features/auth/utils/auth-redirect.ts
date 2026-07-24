import { redirect } from "next/navigation";

export function getRedirectUrl(searchParams: URLSearchParams): string {
  const redirectParam = searchParams.get("redirect");
  if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
    return redirectParam;
  }
  return "/";
}

export function redirectToLogin(currentPath: string): void {
  const params = new URLSearchParams();
  if (currentPath && currentPath !== "/auth/login") {
    params.set("redirect", currentPath);
  }
  const url = `/auth/login${params.toString() ? `?${params.toString()}` : ""}`;
  redirect(url);
}

export function redirectToOriginalDestination(redirectPath: string | null): void {
  if (redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//")) {
    redirect(redirectPath);
  } else {
    redirect("/");
  }
}
