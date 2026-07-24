export type UserRole = "ADMIN" | "STAFF";

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
}
