import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse, User } from "../types/auth.types";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", credentials);
}

export async function logout(): Promise<void> {
  return apiClient.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  return apiClient.get<User>("/auth/currentuser");
}
