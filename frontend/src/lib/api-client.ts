type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

// AuthProvider هنگام mount شدن این تابع رو صدا می‌زنه تا هندلر خودش رو ثبت کنه
export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface RequestOptions extends RequestInit {
  // برای login: 401 یعنی رمز اشتباهه، نه پایان نشست. پس این پرچم رو true می‌ذاریم
  skipAuthHandling?: boolean;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthHandling, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: { "Content-Type": "application/json", ...headers },
      credentials: "include", // Cookie امن HttpOnly خودکار ارسال می‌شود
    });
  } catch {
    throw new TypeError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
  }

  if (response.status === 401 && !skipAuthHandling) {
    onUnauthorized?.(); // اینجا AuthProvider نشست رو پاک و کاربر رو ریدایرکت می‌کنه
    throw new ApiError(401, "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return typeof data?.message === "string" ? data.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  } catch {
    return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  }
}