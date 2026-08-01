export interface NoticeDocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface NoticeDocumentFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "excel" | "other";
  url: string;
  size: number; // بایت
  uploadedAt: string;
  folderId: string | null;
}

// ---------- فولدرهای تقلبی ----------
export const mockNoticeFolders: Record<string, NoticeDocumentFolder[]> = {
  "1": [
    { id: "folder-1", name: "مدارک هویتی", parentId: null, createdAt: "2026-04-05T10:00:00Z" },
    { id: "folder-2", name: "لوایح", parentId: null, createdAt: "2026-04-05T10:00:00Z" },
  ],
  "3": [
    { id: "folder-3", name: "مکاتبات", parentId: null, createdAt: "2026-04-05T10:00:00Z" },
  ],
};

// ---------- فایل‌های تقلبی ----------
export const mockNoticeFiles: Record<string, NoticeDocumentFile[]> = {
  "1": [
    {
      id: "file-1",
      name: "دعوت‌نامه جلسه.pdf",
      type: "pdf",
      url: "#",
      size: 215040,
      uploadedAt: "2026-04-05T11:00:00Z",
      folderId: null,
    },
  ],
  "3": [
    {
      id: "file-2",
      name: "قرارداد.pdf",
      type: "pdf",
      url: "#",
      size: 184320,
      uploadedAt: "2026-04-05T11:00:00Z",
      folderId: null,
    },
  ],
};

// ---------- helper هایی برای شبیه‌سازی CRUD (دقیقاً مثل documents.mock.ts پروژه‌ی پرونده‌ها) ----------
export function getNoticeDocuments(noticeId: string) {
  return {
    folders: mockNoticeFolders[noticeId] ?? [],
    files: mockNoticeFiles[noticeId] ?? [],
  };
}

export function addMockNoticeFolder(
  noticeId: string,
  name: string,
  parentId: string | null
) {
  const folder: NoticeDocumentFolder = {
    id: `folder-${Date.now()}`,
    name,
    parentId,
    createdAt: new Date().toISOString(),
  };

  if (!mockNoticeFolders[noticeId]) mockNoticeFolders[noticeId] = [];
  mockNoticeFolders[noticeId].push(folder);

  return folder;
}

export function addMockNoticeFile(
  noticeId: string,
  file: Omit<NoticeDocumentFile, "id" | "uploadedAt">
) {
  const doc: NoticeDocumentFile = {
    ...file,
    id: `file-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };

  if (!mockNoticeFiles[noticeId]) mockNoticeFiles[noticeId] = [];
  mockNoticeFiles[noticeId].push(doc);

  return doc;
}

export function deleteMockNoticeFolder(noticeId: string, folderId: string) {
  if (!mockNoticeFolders[noticeId]) return;

  // زیرپوشه‌ها و فایل‌های داخل همین پوشه هم حذف می‌شن
  const idsToRemove = new Set<string>([folderId]);
  let changed = true;

  while (changed) {
    changed = false;
    mockNoticeFolders[noticeId].forEach((f) => {
      if (f.parentId && idsToRemove.has(f.parentId) && !idsToRemove.has(f.id)) {
        idsToRemove.add(f.id);
        changed = true;
      }
    });
  }

  mockNoticeFolders[noticeId] = mockNoticeFolders[noticeId].filter(
    (f) => !idsToRemove.has(f.id)
  );

  if (mockNoticeFiles[noticeId]) {
    mockNoticeFiles[noticeId] = mockNoticeFiles[noticeId].filter(
      (f) => !f.folderId || !idsToRemove.has(f.folderId)
    );
  }
}

export function deleteMockNoticeFile(noticeId: string, fileId: string) {
  if (!mockNoticeFiles[noticeId]) return;

  mockNoticeFiles[noticeId] = mockNoticeFiles[noticeId].filter(
    (f) => f.id !== fileId
  );
}

// اطلاعات کلی اطلاعیه برای نمایش در هدر صفحه‌ی اسناد
export const noticeInfoMock: Record<string, { title: string; clientName: string }> = {
  "1": { title: "جلسه دادگاه پرونده احمدی", clientName: "محمد احمدی" },
  "2": { title: "ارسال لایحه دفاعیه", clientName: "علی رضایی" },
  "3": { title: "تمدید قرارداد موکل", clientName: "زهرا کریمی" },
};
