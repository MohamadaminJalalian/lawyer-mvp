// ==========================================================
// توابع API ماژول «پرونده‌ها»
// ==========================================================

import { apiFetch } from "./api-client";
import type {
  CaseListItem,
  CreateCaseRequest,
  UpdateCaseRequest,
  PaginatedResponse,
} from "../../types/cases.types";

export interface GetCasesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getCases(
  params: GetCasesParams = {}
): Promise<PaginatedResponse<CaseListItem>> {
  const queryString = buildQueryString({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    status: params.status,
    categoryId: params.categoryId,
  });
  return apiFetch<PaginatedResponse<CaseListItem>>(`/cases${queryString}`);
}

export function getCaseById(id: string): Promise<CaseListItem> {
  return apiFetch<CaseListItem>(`/cases/${id}`);
}

export function createCase(data: CreateCaseRequest): Promise<CaseListItem> {
  return apiFetch<CaseListItem>(`/cases`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCase(
  id: string,
  data: UpdateCaseRequest
): Promise<CaseListItem> {
  return apiFetch<CaseListItem>(`/cases/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function archiveCase(id: string): Promise<CaseListItem> {
  return apiFetch<CaseListItem>(`/cases/${id}/archive`, {
    method: "POST",
  });
}