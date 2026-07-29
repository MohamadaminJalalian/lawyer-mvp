export interface Client {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  caseCount: number;
}
