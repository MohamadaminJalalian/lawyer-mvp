import { ApiError } from "./api-client";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: return error.message || "اطلاعات ارسالی معتبر نیست.";
      case 401: return "نام کاربری یا رمز عبور صحیح نیست.";
      case 403: return "شما اجازه دسترسی به این بخش را ندارید.";
      case 404: return "موردی یافت نشد.";
      case 500: return "ورود به سامانه با خطا مواجه شد. لطفاً دوباره تلاش کنید.";
      default: return error.message || "خطایی رخ داد.";
    }
  }
  if (error instanceof TypeError) {
    return "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.";
  }
  return "خطای ناشناخته‌ای رخ داد.";
}