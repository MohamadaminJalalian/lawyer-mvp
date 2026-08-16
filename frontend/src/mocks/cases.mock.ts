// ==========================================================
// Mock Data ماژول «پرونده‌ها»
// ==========================================================

import type {
  CaseListItem,
  ClientSummary,
  CategorySummary,
  PaginatedResponse,
} from "./cases.types";

export const mockClients: ClientSummary[] = [
  { id: "client-001", fullName: "مریم احمدی", nationalCode: "1234567890", isActive: true },
  { id: "client-002", fullName: "علی رضایی", nationalCode: "0987654321", isActive: true },
  { id: "client-003", fullName: "سارا محمدی", nationalCode: "1122334455", isActive: false },
];

export const mockCategories: CategorySummary[] = [
  { id: "cat-family", name: "خانواده" },
  { id: "cat-mahrieh", name: "مهریه" },
  { id: "cat-nafaghe", name: "نفقه" },
  { id: "cat-criminal", name: "کیفری" },
  { id: "cat-fraud", name: "کلاهبرداری" },
];

export const mockCases: CaseListItem[] = [
  {
    id: "case-001", internalNumber: "1405-001", title: "مطالبه مهریه",
     isUrgent: false,
    client: mockClients[0], category: mockCategories[1],subject: "خیانت",
    status: "ACTIVE", priority: "HIGH", opponentName: "محمد رضایی",
    formedAt: "2026-04-04", nextSessionAt: "2026-04-20",
    description: "پیگیری مطالبه مهریه",
    createdAt: "2026-04-04T09:00:00Z", updatedAt: "2026-04-04T09:00:00Z",
  },
  {
    id: "case-002", internalNumber: "1405-002", title: "دعوای نفقه",
     isUrgent: false,
    client: mockClients[1], category: mockCategories[2],subject: "نان",
    status: "ACTIVE", priority: "NORMAL", opponentName: "زهرا کریمی",
    formedAt: "2026-03-10", nextSessionAt: null,
    description: null,
    createdAt: "2026-03-10T10:30:00Z", updatedAt: "2026-03-15T08:00:00Z",
  },
  {
    id: "case-003", internalNumber: "1405-003", title: "کلاهبرداری اینترنتی",
    isUrgent: true,
    client: mockClients[2], category: mockCategories[4],subject: "گوم",
    status: "CLOSED", priority: "URGENT", opponentName: "شرکت نمونه",
    formedAt: "2026-01-15", nextSessionAt: null,
    description: "پرونده با رأی نهایی مختومه شد",
    createdAt: "2026-01-15T11:00:00Z", updatedAt: "2026-06-01T14:00:00Z",
  },
  {
    id: "case-004", internalNumber: "1404-088", title: "طلاق توافقی",
     isUrgent: false,
    client: mockClients[0], category: mockCategories[0],subject: "زل",
    status: "CLOSED", priority: "LOW", opponentName: null,
    formedAt: "2025-11-01", nextSessionAt: null,
    description: "پرونده مختومه شد",
    createdAt: "2025-11-01T09:00:00Z", updatedAt: "2026-01-05T09:00:00Z",
  },
];

export const mockCasesResponse: PaginatedResponse<CaseListItem> = {
  items: mockCases,
  page: 1,
  pageSize: 10,
  total: mockCases.length,
  totalPages: 1,
};
