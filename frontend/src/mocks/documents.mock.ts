// اسناد پرونده — داده‌های موقت برای رابط کاربری
import type { DocumentFile } from "./cases.types";

export const mockDocumentFiles: Record<string, DocumentFile[]> = {
  "case-001": [
    {
      id: "file-001",
      title: "دادخواست اولیه و مدارک مربوط به پرونده",
      name: "دادخواست اولیه.pdf",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: 245000,
      uploadedAt: "2026-04-05T11:00:00Z",
      },
    {
      id: "file-002",
      title: "تصویر کارت ملی موکل",
      name: "کارت ملی موکل.jpg",
      type: "image",
      url: "https://placehold.co/900x600",
      size: 120000,
      uploadedAt: "2026-04-06T09:30:00Z",
      },
    {
      id: "file-003",
      title: "قرارداد ازدواج",
      name: "قرارداد ازدواج.pdf",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: 340000,
      uploadedAt: "2026-04-07T14:00:00Z",
      },
  ],
  "case-002": [],
};

export function getCaseDocuments(caseId: string) {
  return { files: mockDocumentFiles[caseId] ?? [] };
}

export function addMockFile(
  caseId: string,
  file: Omit<DocumentFile, "id" | "uploadedAt" | "folderId">
) {
  const doc: DocumentFile = {
    ...file,
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    uploadedAt: new Date().toISOString(),
  };
  if (!mockDocumentFiles[caseId]) mockDocumentFiles[caseId] = [];
  mockDocumentFiles[caseId].unshift(doc);
  return doc;
}

export function setFileProcessing(
  caseId: string,
  fileId: string,
  isProcessing: boolean
) {
  const files = mockDocumentFiles[caseId];
  if (!files) return;
  const file = files.find((f) => f.id === fileId);
  if (file) file.isProcessing = isProcessing;
}

export function setFileExtractedText(
  caseId: string,
  fileId: string,
  text: string
) {
  const files = mockDocumentFiles[caseId];
  if (!files) return;
  const file = files.find((f) => f.id === fileId);
  if (file) {
    file.extractedText = text;
    file.isProcessing = false;
  }
}
