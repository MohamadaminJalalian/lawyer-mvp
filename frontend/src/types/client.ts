export type ClientType = "PERSON" | "LEGAL";

export interface Client {
  id: string;
  type: ClientType;

  firstName: string;
  lastName: string;

  nationalCode: string;
  mobile: string;
  phone?: string;

  address?: string;
  description?: string;

  caseCount?: number;

  createdAt: string;
  updatedAt: string;
}