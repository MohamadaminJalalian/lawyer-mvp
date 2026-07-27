// ==========================================================
// هسته مشترک API Client
// ==========================================================

import type { ApiError } from "../../mocks/cases.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: "خطای ناشناخته‌ای رخ داد. لطفاً دوباره تلاش کنید.",
    }));
    throw errorBody;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}