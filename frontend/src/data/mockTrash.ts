import { TrashFile } from "@/types/trash";

export const mockTrash: TrashFile[] = [
  {
    id: "trash-1",
    fileName: "ابلاغیه",
    fileKind: "IMAGE",
    clientName: "علی رضایی",
    caseTitle: "مطالبه مهریه",
    caseNumber: "۱۴۰۵-۰۰۰۹",
    deletedAt: "2026-07-24T09:30:00.000Z",
  },
  {
    id: "trash-2",
    fileName: "قرارداد اجاره",
    fileKind: "DOCUMENT",
    clientName: "زهرا کریمی",
    caseTitle: "نفقه",
    caseNumber: "۱۴۰۵-۰۰۱۲",
    deletedAt: "2026-07-20T14:10:00.000Z",
  },
];