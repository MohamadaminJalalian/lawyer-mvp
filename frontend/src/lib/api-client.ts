import { handleApiError } from "./api-error-handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface RequestOptions extends RequestInit {
  skipAuthRedirect?: boolean;
}

function getFullUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRedirect = false, ...fetchOptions } = options;

  let response: Response;

  try {
    response = await fetch(getFullUrl(url), {
      ...fetchOptions,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
  }

  if (!response.ok) {
    // Handle 401: clear session and redirect to login
    if (response.status === 401 && !skipAuthRedirect) {
      // Import dynamically to avoid circular dependency
      // In the client, this will trigger AuthProvider cleanup
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:401"));
      }
    }
    await handleApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "GET" });
  },

  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "DELETE" });
  },
};
