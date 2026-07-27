export type UserRole = "LAWYER" | "SECRETARY";

export interface CurrentUser {
  name: string;
  role: UserRole;
  title?: string;
  secretaryId?: string;
}