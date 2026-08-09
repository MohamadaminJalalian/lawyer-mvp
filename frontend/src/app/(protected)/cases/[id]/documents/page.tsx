"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Folder,
  FolderPlus,
  Upload,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File as FileIcon,
  Download,
  X,
  ChevronLeft,
} from "lucide-react";
import { mockCases } from "@/mocks/cases.mock";
import {
  getCaseDocuments,
  addMockFolder,
  addMockFile,
} from "@/mocks/documents.mock";
import type { DocumentFile } from "@/mocks/cases.types";

function fileIconFor(type: DocumentFile["type"]) {
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

export default function CaseDocumentsPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const caseItem = mockCases.find((c) => c.id === caseId);

  const [{ folders, files }, setDocs] = useState(() => getCaseDocuments(caseId));
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => setDocs(getCaseDocuments(caseId));

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
    addMockFolder(caseId, newFolderName.trim(), currentFolderId);
    setNewFolderName("");
    setNewFolderOpen(false);
    refresh();
  }

  function handleUpload(fileList: FileList | null) {
    if (!fileList) return;
    Array.from(fileList).forEach((f) => {
      const isImage = f.type.startsWith("image/");
      addMockFile(caseId, {
        name: f.name,
        type: isImage ? "image" : f.type.includes("pdf") ? "pdf" : "other",
        url: isImage ? URL.createObjectURL(f) : "#",
        size: f.size,
        folderId: currentFolderId,
      });
    });
    refresh();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!caseItem) {
    return <div className="p-8 text-sm text-[#8C8A80]">پرونده پیدا نشد.</div>;
  }

  return (
    <div className=" mx-auto">
      {/* هدر صفحه */}
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/cases`} className="flex items-center gap-1 text-sm text-[#8C8A80] hover:text-[#262420]">
          <ArrowRight size={16} />
          بازگشت به لیست پرونده‌ها
        </Link>
      </div>

      <div className="rounded-xl border border-[#EDEBE2] bg-white overflow-hidden mb-5">
        <div className="px-5 py-4 bg-[#FAF8F3] border-b border-[#EDEBE2]">
          <h1 className="text-lg font-bold text-[#262420]">اسناد پرونده: {caseItem.title}</h1>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#8C8A80]">موکل: </span>
            <span className="font-medium text-[#262420]">{caseItem.client.fullName}</span>
          </div>
          <div>
            <span className="text-[#8C8A80]">شماره داخلی: </span>
            <span className="font-mono text-[#262420]">{caseItem.internalNumber}</span>
          </div>
        </div>
      </div>

      {/* باکس مدیریت اسناد */}
      <div className="rounded-xl border border-[#EDEBE2] bg-white overflow-hidden">
        {/* نوار ابزار: breadcrumb + دکمه‌ها */}
        <div className="px-5 py-3 bg-[#FAF8F3] border-b border-[#EDEBE2] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 text-sm text-[#8C8A80]">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                {i > 0 && <ChevronLeft size={14} />}
                <button
                  type="button"
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={i === breadcrumb.length - 1 ? "text-[#262420] font-medium" : "hover:text-[#262420]"}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-sm text-[#262420] hover:bg-[#FAF8F3]"
            >
              <FolderPlus size={16} />
              فولدر جدید
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8A5D1F] text-white text-sm hover:bg-[#734C19]"
            >
              <Upload size={16} />
              آپلود فایل
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          </div>
        </div>

        {/* فرم فولدر جدید */}
        {newFolderOpen && (
          <div className="px-5 py-3 border-b border-[#EDEBE2] flex items-center gap-2">
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              placeholder="نام فولدر"
              className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4E1D8] text-sm focus:outline-none focus:border-[#8A5D1F]"
            />
            <button type="button" onClick={handleCreateFolder} className="px-3 py-1.5 rounded-lg bg-[#8A5D1F] text-white text-sm">
              ایجاد
            </button>
            <button type="button" onClick={() => setNewFolderOpen(false)} className="px-3 py-1.5 rounded-lg border border-[#E4E1D8] text-sm">
              انصراف
            </button>
          </div>
        )}

        {/* محتوا: فولدرها و فایل‌ها */}
        <div className="p-5">
          {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
            <p className="text-center text-sm text-[#8C8A80] py-10">هنوز سندی در این بخش ثبت نشده است.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {visibleFolders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#EDEBE2] hover:border-[#E4D3B0] hover:bg-[#FAF8F3] transition-colors"
                >
                  <Folder size={32} className="text-[#8A5D1F]" />
                  <span className="text-sm text-[#262420] text-center truncate w-full">{folder.name}</span>
                </button>
              ))}

              {visibleFiles.map((file) => {
                const Icon = fileIconFor(file.type);
                return (
                  <div key={file.id} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#EDEBE2] hover:bg-[#FAF8F3] transition-colors group">
                    <button
                      type="button"
                      onClick={() => (file.type === "image" ? setPreviewFile(file) : window.open(file.url, "_blank"))}
                      className="flex flex-col items-center gap-2 w-full"
                    >
                      <Icon size={32} className="text-[#8C8A80]" />
                      <span className="text-sm text-[#262420] text-center truncate w-full">{file.name}</span>
                      <span className="text-xs text-[#8C8A80]">{formatSize(file.size)}</span>
                    </button>
                    <a href={file.url} download={file.name} className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-[#8A5D1F] transition-opacity">
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

      {/* لایت‌باکس پیش‌نمایش عکس */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEBE2]">
              <span className="text-sm font-medium text-[#262420]">{previewFile.name}</span>
              <button type="button" onClick={() => setPreviewFile(null)}>
                <X size={18} className="text-[#8C8A80]" />
              </button>
            </div>
            <img src={previewFile.url} alt={previewFile.name} className="w-full max-h-[70vh] object-contain bg-[#FAF8F3]" />
          </div>
        </div>
      )}
    </div>
  );
}