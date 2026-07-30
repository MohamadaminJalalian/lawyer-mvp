"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/clients-categories.api";
import type { CategorySummary } from "../../../mocks/cases.types";

// هوک مشترک برای گرفتن لیست دسته‌بندی‌ها از بک‌اند
// (جایگزین mockCategories در همه فرم‌ها و فیلترهای مربوط به پرونده)
export function useCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setError("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}