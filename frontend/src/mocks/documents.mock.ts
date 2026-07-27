// documents.mock.ts
import type { DocumentFile, DocumentFolder } from "./cases.types";

// ---------- فولدرهای تقلبی ----------
export const mockFolders: Record<string, DocumentFolder[]> = {
  "case-001": [
    { id: "folder-001", name: "لوایح", parentId: null, createdAt: "2026-04-05T10:00:00Z" },
    { id: "folder-002", name: "مدارک هویتی", parentId: null, createdAt: "2026-04-05T10:00:00Z" },
    { id: "folder-003", name: "احکام", parentId: "folder-001", createdAt: "2026-04-10T10:00:00Z" },
  ],
  "case-002": [],
};

// ---------- فایل‌های تقلبی ----------
export const mockDocumentFiles: Record<string, DocumentFile[]> = {
  "case-001": [
    {
      id: "file-001",
      name: "دادخواست اولیه.pdf",
      type: "pdf",
      url: "#",
      size: 245000,
      uploadedAt: "2026-04-05T11:00:00Z",
      folderId: "folder-001",
    },
    {
      id: "file-002",
      name: "کارت ملی موکل.jpg",
      type: "image",
      url: "https://placehold.co/600x400",
      size: 120000,
      uploadedAt: "2026-04-06T09:30:00Z",
      folderId: "folder-002",
    },
    {
      id: "file-003",
      name: "قرارداد ازدواج.pdf",
      type: "pdf",
      url: "#",
      size: 340000,
      uploadedAt: "2026-04-07T14:00:00Z",
      folderId: null,
    },
  ],
  "case-002": [],
};

// ---------- helper هایی برای شبیه‌سازی CRUD ----------
export function getCaseDocuments(caseId: string) {
  return {
    folders: mockFolders[caseId] ?? [],
    files: mockDocumentFiles[caseId] ?? [],
  };
}

export function addMockFolder(caseId: string, name: string, parentId: string | null) {
  const folder: DocumentFolder = {
    id: `folder-${Date.now()}`,
    name,
    parentId,
    createdAt: new Date().toISOString(),
  };
  if (!mockFolders[caseId]) mockFolders[caseId] = [];
  mockFolders[caseId].push(folder);
  return folder;
}

export function addMockFile(
  caseId: string,
  file: Omit<DocumentFile, "id" | "uploadedAt">
) {
  const doc: DocumentFile = {
    ...file,
    id: `file-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };
  if (!mockDocumentFiles[caseId]) mockDocumentFiles[caseId] = [];
  mockDocumentFiles[caseId].push(doc);
  return doc;
}