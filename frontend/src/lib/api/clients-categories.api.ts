// ==========================================================
// توابع API موکل‌ها و دسته‌بندی‌ها (وابسته به BE1 و BE2)
// ==========================================================

import { apiClient } from "../api-client";
import type { ClientSummary, CategorySummary } from "../../mocks/cases.types";

export function searchClients(query: string): Promise<ClientSummary[]> {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiClient<ClientSummary[]>(`/clients${queryString}`);
}

export function getClientById(id: string): Promise<ClientSummary> {
  return apiClient<ClientSummary>(`/clients/${id}`);
}

export function getCategories(): Promise<CategorySummary[]> {
  return apiClient<CategorySummary[]>(`/categories`);
}