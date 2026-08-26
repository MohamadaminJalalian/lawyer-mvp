export type UserRole = "ADMIN" | "STAFF";

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  expiresIn?: number;
  user: AuthUser;
}

export interface ForgotPasswordPayload {
  username: string;
}

export interface VerifyOtpPayload {
  username: string;
  code: string;
}

export interface SignupPayload {
  username: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

// loading: در حال بررسی نشست | authenticated: کاربر وارد شده
// unauthenticated: نشستی وجود ندارد | error: خطا در دریافت اطلاعات نشست
export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";
