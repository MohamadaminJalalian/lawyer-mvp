// ==========================================================
// توابع API موکل‌ها و دسته‌بندی‌ها (وابسته به BE1 و BE2)
// ==========================================================

import { apiFetch } from "./api-client";
import type { ClientSummary, CategorySummary } from "../../types/cases.types";

export function searchClients(query: string): Promise<ClientSummary[]> {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch<ClientSummary[]>(`/clients${queryString}`);
}

export function getClientById(id: string): Promise<ClientSummary> {
  return apiFetch<ClientSummary>(`/clients/${id}`);
}

export function getCategories(): Promise<CategorySummary[]> {
  return apiFetch<CategorySummary[]>(`/categories`);
}