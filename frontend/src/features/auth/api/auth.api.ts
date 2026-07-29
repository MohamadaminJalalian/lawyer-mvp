import { apiClient } from "@/lib/api-client";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

export function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthHandling: true,
  });
}

export function logoutRequest(): Promise<void> {
  return apiClient<void>("/auth/logout", { method: "POST", skipAuthHandling: true });
}

export function fetchCurrentUser(): Promise<AuthUser> {
  return apiClient<AuthUser>("/auth/me", { method: "GET", skipAuthHandling: true });
}

// TODO: اتصال به API واقعی
export function forgotPasswordRequest(
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "کد تایید با موفقیت ارسال شد." });
    }, 1500);
  });
}

// TODO: اتصال به API واقعی
export function verifyOtpRequest(
  payload: VerifyOtpPayload,
): Promise<{ message: string; token: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.code === "000000") {
        reject(new Error("کد منقضی شده است."));
        return;
      }
      if (payload.code.length === 6 && /^\d{6}$/.test(payload.code)) {
        resolve({ message: "کد تایید شد.", token: "mock-reset-token" });
      } else {
        reject(new Error("کد وارد شده معتبر نیست."));
      }
    }, 1000);
  });
}

// TODO: اتصال به API واقعی
export function resetPasswordRequest(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "رمز عبور با موفقیت تغییر کرد." });
    }, 1500);
  });
}