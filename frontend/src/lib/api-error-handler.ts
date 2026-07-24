export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "اطلاعات ارسالی نادرست است.",
  401: "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  403: "شما اجازه دسترسی به این بخش را ندارید.",
  404: "منبع مورد نظر یافت نشد.",
  500: "خطای سرور. لطفاً دوباره تلاش کنید.",
};

export async function handleApiError(response: Response): Promise<never> {
  let errorMessage: string;

  try {
    const body = await response.json();
    errorMessage = body.error || body.message || ERROR_MESSAGES[response.status] || "خطای ناشناخته.";
  } catch {
    errorMessage = ERROR_MESSAGES[response.status] || "خطای ناشناخته.";
  }

  throw new ApiError(response.status, errorMessage);
}
