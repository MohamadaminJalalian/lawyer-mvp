"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  Folder,
  FolderPlus,
  Upload,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File as FileIcon,
  Download,
  Trash2,
  X,
} from "lucide-react";
import {
  getNoticeDocuments,
  addMockNoticeFolder,
  addMockNoticeFile,
  deleteMockNoticeFolder,
  deleteMockNoticeFile,
  noticeInfoMock,
  type NoticeDocumentFile,
} from "./notices.mock";

interface NoticeDocumentsPageProps {
  noticeId: string;
}

function fileIconFor(type: NoticeDocumentFile["type"]) {
  switch (type) {
    case "pdf":
      return FileText;
    case "image":
      return ImageIcon;
    case "excel":
      return FileSpreadsheet;
    default:
      return FileIcon;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function NoticeDocumentsPage({ noticeId }: NoticeDocumentsPageProps) {
  const info = noticeInfoMock[noticeId];

  const [{ folders, files }, setDocs] = useState(() => getNoticeDocuments(noticeId));
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewFile, setPreviewFile] = useState<NoticeDocumentFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => setDocs(getNoticeDocuments(noticeId));

  // مسیر breadcrumb از فولدر جاری تا ریشه
  const breadcrumb = useMemo(() => {
    const trail: { id: string | null; name: string }[] = [{ id: null, name: "اسناد" }];
    let cursor = currentFolderId;
    const chain: { id: string; name: string }[] = [];

    while (cursor) {
      const f = folders.find((x) => x.id === cursor);
      if (!f) break;
      chain.unshift({ id: f.id, name: f.name });
      cursor = f.parentId;
    }

    return [...trail, ...chain];
  }, [currentFolderId, folders]);

  const visibleFolders = folders.filter((f) => f.parentId === currentFolderId);
  const visibleFiles = files.filter((f) => f.folderId === currentFolderId);

  function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    addMockNoticeFolder(noticeId, newFolderName.trim(), currentFolderId);
    setNewFolderName("");
    setNewFolderOpen(false);
    refresh();
  }

  function handleUpload(fileList: FileList | null) {
    if (!fileList) return;

    Array.from(fileList).forEach((f) => {
      const isImage = f.type.startsWith("image/");

      addMockNoticeFile(noticeId, {
        name: f.name,
        type: isImage ? "image" : f.type.includes("pdf") ? "pdf" : "other",
        url: URL.createObjectURL(f),
        size: f.size,
        folderId: currentFolderId,
      });
    });

    refresh();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDeleteFolder(folderId: string, folderName: string) {
    if (!confirm(`پوشه‌ی «${folderName}» و همه‌ی محتوای داخلش حذف بشه؟`)) return;
    deleteMockNoticeFolder(noticeId, folderId);
    refresh();
  }

  function handleDeleteFile(fileId: string, fileName: string) {
    if (!confirm(`فایل «${fileName}» حذف بشه؟`)) return;
    deleteMockNoticeFile(noticeId, fileId);
    refresh();
  }

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div dir="rtl" className="mx-auto max-w-5xl">
        {/* بازگشت */}
        <Link
          href="/notices"
          className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 transition hover:text-[#a9762f]"
        >
          <ArrowRight size={16} />
          بازگشت به لیست اطلاعیه‌ها
        </Link>

        {/* هدر اطلاعیه */}
        <div className="mb-5 overflow-hidden rounded-xl border border-[#e5e0d6] bg-white">
          <div className="border-b border-[#e5e0d6] bg-[#faf8f4] px-4 py-4 sm:px-5">
            <h1 className="text-lg font-bold text-neutral-900">
              اسناد اطلاعیه: {info?.title ?? "—"}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-2 sm:px-5">
            <div>
              <span className="text-[#8a8175]">موکل: </span>
              <span className="font-medium text-neutral-900">
                {info?.clientName ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* باکس مدیریت اسناد */}
        <div className="overflow-hidden rounded-xl border border-[#e5e0d6] bg-white">
          {/* نوار ابزار: breadcrumb + دکمه‌ها */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e0d6] bg-[#faf8f4] px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-1 text-sm text-[#8a8175]">
              {breadcrumb.map((crumb, i) => (
                <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                  {i > 0 && <ChevronLeft size={14} />}
                  <button
                    type="button"
                    onClick={() => setCurrentFolderId(crumb.id)}
                    className={
                      i === breadcrumb.length - 1
                        ? "font-medium text-neutral-900"
                        : "transition hover:text-neutral-900"
                    }
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewFolderOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[#ddd5c8] bg-white px-3 py-1.5 text-sm text-neutral-900 transition hover:bg-[#f8f5ef]"
              >
                <FolderPlus size={16} />
                پوشه جدید
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg bg-[#a9762f] px-3 py-1.5 text-sm text-white transition hover:bg-[#946727]"
              >
                <Upload size={16} />
                آپلود فایل
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>
          </div>

          {/* فرم فولدر جدید */}
          {newFolderOpen && (
            <div className="flex items-center gap-2 border-b border-[#e5e0d6] px-4 py-3 sm:px-5">
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                placeholder="نام پوشه"
                className="flex-1 rounded-lg border border-[#ddd5c8] px-3 py-1.5 text-sm outline-none focus:border-[#a9762f]"
              />
              <button
                type="button"
                onClick={handleCreateFolder}
                className="rounded-lg bg-[#a9762f] px-3 py-1.5 text-sm text-white"
              >
                ایجاد
              </button>
              <button
                type="button"
                onClick={() => setNewFolderOpen(false)}
                className="rounded-lg border border-[#ddd5c8] px-3 py-1.5 text-sm"
              >
                انصراف
              </button>
            </div>
          )}

          {/* محتوا: فولدرها و فایل‌ها */}
          <div className="p-4 sm:p-5">
            {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#8b8b8b]">
                هنوز سندی در این بخش ثبت نشده است.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {visibleFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="group relative flex flex-col items-center gap-2 rounded-xl border border-[#e5e0d6] p-4 transition hover:border-[#E4D3B0] hover:bg-[#faf8f4]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteFolder(folder.id, folder.name)
                      }
                      title="حذف پوشه"
                      className="absolute left-2 top-2 rounded-lg p-1.5 text-[#b3aca0] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="flex w-full flex-col items-center gap-2"
                    >
                      <Folder size={32} className="text-[#a9762f]" />
                      <span className="w-full truncate text-center text-sm text-neutral-800">
                        {folder.name}
                      </span>
                    </button>
                  </div>
                ))}

                {visibleFiles.map((file) => {
                  const Icon = fileIconFor(file.type);
                  return (
                    <div
                      key={file.id}
                      className="group relative flex flex-col items-center gap-2 rounded-xl border border-[#e5e0d6] p-4 transition hover:bg-[#faf8f4]"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.id, file.name)}
                        title="حذف فایل"
                        className="absolute left-2 top-2 rounded-lg p-1.5 text-[#b3aca0] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          file.type === "image"
                            ? setPreviewFile(file)
                            : window.open(file.url, "_blank")
                        }
                        className="flex w-full flex-col items-center gap-2"
                      >
                        <Icon size={32} className="text-[#8a8175]" />
                        <span className="w-full truncate text-center text-sm text-neutral-800">
                          {file.name}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {formatSize(file.size)}
                        </span>
                      </button>

                      <a
                        href={file.url}
                        download={file.name}
                        className="flex items-center gap-1 text-xs text-[#a9762f] opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Download size={12} />
                        دانلود
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* لایت‌باکس پیش‌نمایش عکس */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e5e0d6] px-4 py-3">
              <span className="text-sm font-medium text-neutral-900">
                {previewFile.name}
              </span>
              <button type="button" onClick={() => setPreviewFile(null)}>
                <X size={18} className="text-[#8a8175]" />
              </button>
            </div>
            <img
              src={previewFile.url}
              alt={previewFile.name}
              className="max-h-[70vh] w-full bg-[#faf8f4] object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
