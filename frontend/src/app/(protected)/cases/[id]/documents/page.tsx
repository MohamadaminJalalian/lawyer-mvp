"use client";

import {
  addMockFile,
  getCaseDocuments,
  setFileProcessing,
  setFileExtractedText,
} from "@/mocks/documents.mock";

import { extractTextFromImage } from "@/lib/ocr";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Download,
  FileImage,
  FileText,
  FileSpreadsheet,
  File,
  Paperclip,
  Upload,
  X,
} from "lucide-react";

import { mockCases } from "@/mocks/cases.mock";
import type { DocumentFile } from "@/mocks/cases.types";

function fileIconFor(type: DocumentFile["type"]) {
  switch (type) {
    case "pdf":
      return FileText;
    case "image":
      return FileImage;
    case "excel":
      return FileSpreadsheet;
    case "word":
      return FileText;
    default:
      return File;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatPersianDate(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}


export default function CaseDocumentsPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const caseItem = mockCases.find((c) => c.id === caseId);
const [{ files }, setDocs] = useState(() => getCaseDocuments(caseId));

const [title, setTitle] = useState("");
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState("");
const [searchQuery, setSearchQuery] = useState("");

const query = searchQuery.trim().toLowerCase();

const filteredFiles = files.filter((file) => {
  if (!query) return true;

  return (
    file.title.toLowerCase().includes(query) ||
    file.name.toLowerCase().includes(query) ||
    (file.extractedText ?? "").toLowerCase().includes(query)
  );
});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!caseItem) {
    return <div className="p-8 text-sm text-[#8C8A80]">پرونده پیدا نشد.</div>;
  }

  function refresh() {
    setDocs(getCaseDocuments(caseId));
  }

  function openDocument(file: DocumentFile) {
    if (file.url && file.url !== "#") {
      if (file.type === "image") {
        setPreviewFile(file);
      } else {
        window.open(file.url, "_blank", "noopener,noreferrer");
      }
    }
  }

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setError("");
  }

  function handleRegister() {
    if (!title.trim()) {
      setError("عنوان سند را وارد کنید.");
      return;
    }
    if (!selectedFile) {
      setError("لطفاً فایل سند را انتخاب کنید.");
      return;
    }

    setIsSaving(true);
    const isImage = selectedFile.type.startsWith("image/");
    const isPdf = selectedFile.type === "application/pdf";
    const isWord =
      selectedFile.type.includes("word") ||
      selectedFile.name.toLowerCase().endsWith(".doc") ||
      selectedFile.name.toLowerCase().endsWith(".docx");
    const isExcel =
      selectedFile.type.includes("sheet") ||
      selectedFile.name.toLowerCase().endsWith(".xls") ||
      selectedFile.name.toLowerCase().endsWith(".xlsx");

    const url = URL.createObjectURL(selectedFile);
    const newDoc = addMockFile(caseId, {
      title: title.trim(),
      name: selectedFile.name,
      type: isImage ? "image" : isPdf ? "pdf" : isWord ? "word" : isExcel ? "excel" : "other",
      url,
      size: selectedFile.size,
      isProcessing: isImage,
    });

    setTitle("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    refresh();
    setIsSaving(false);

    // اگه عکس بود، در پس‌زمینه متنش رو بخون (بدون معطل کردن کاربر)
    if (isImage) {
      setFileProcessing(caseId, newDoc.id, true);
      refresh();

      extractTextFromImage(selectedFile)
        .then((text) => {
          setFileExtractedText(caseId, newDoc.id, text);
          refresh();
        })
        .catch(() => {
          setFileProcessing(caseId, newDoc.id, false);
          refresh();
        });
    }
  }

  return (
    <div dir="rtl" className="min-h-full bg-[#FAF9F6] p-5 sm:p-7">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5">
          <Link
            href={`/cases`}
            className="inline-flex items-center gap-1.5 text-sm text-[#8C8A80] hover:text-[#262420] transition-colors"
          >
            <ArrowRight size={16} />
            بازگشت به لیست پرونده‌ها
          </Link>
        </div>

        <div className="rounded-2xl border border-[#E8E3D9] bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-[#EDEBE2]">
            <h1 className="text-xl font-bold text-[#262420]">اسناد پرونده</h1>
            <p className="text-sm text-[#8C8A80] mt-1">
              {caseItem.title}
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <div className="rounded-2xl border border-[#E5E0D6] bg-[#FCFBF8] p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#F5EBD9] text-[#9A6A24] flex items-center justify-center shrink-0">
                  <Paperclip size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-[#262420]">ثبت سند جدید</h2>
                  <p className="text-xs text-[#8C8A80] mt-1">برای هر سند یک عنوان توضیحی انتخاب کنید و فایل آن را بارگذاری کنید.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr_auto] gap-3 items-end">
                <label className="block">
                  <span className="block text-sm font-medium text-[#262420] mb-2">عنوان سند <span className="text-red-600">*</span></span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: قرارداد اجاره و پیوست‌ها"
                    className="w-full h-11 rounded-xl border border-[#E2DDD2] bg-white px-3.5 text-sm text-[#262420] placeholder:text-[#A6A198] outline-none focus:border-[#B17A2B]"
                  />
                </label>

                <div>
                  <span className="block text-sm font-medium text-[#262420] mb-2">فایل سند <span className="text-red-600">*</span></span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-11 rounded-xl border border-dashed border-[#CFC7B8] bg-white px-3.5 flex items-center justify-between gap-3 text-sm hover:border-[#B17A2B] transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Upload size={17} className="text-[#9A6A24] shrink-0" />
                      <span className="truncate text-[#6F6B63]">{selectedFile?.name ?? "انتخاب PDF، عکس یا فایل مستندات"}</span>
                    </span>
                    <span className="text-xs text-[#9A6A24] shrink-0">انتخاب فایل</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={isSaving}
                  className="h-11 px-5 rounded-xl bg-[#A9762F] text-white text-sm font-medium hover:bg-[#8F6327] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={17} />
                  {isSaving ? "در حال ثبت..." : "ثبت سند"}
                </button>
              </div>

              {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
              <p className="text-xs text-[#9A958C] mt-3">فرمت‌های قابل قبول: PDF، JPG، PNG، WEBP، Word و Excel</p>
            </div>

            <div className="mt-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-bold text-[#262420]">اسناد ثبت‌شده</h2>
                  <p className="text-xs text-[#8C8A80] mt-1">برای مشاهده سند روی عنوان آن کلیک کنید.</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در عنوان یا محتوای تصویر..."
                    className="h-9 rounded-lg border border-[#E2DDD2] bg-white px-3 text-sm text-[#262420] placeholder:text-[#A6A198] outline-none focus:border-[#B17A2B] w-full sm:w-64"
                  />
                  <span className="text-xs text-[#8C8A80] bg-[#F5F2EC] rounded-full px-3 py-1 whitespace-nowrap">{filteredFiles.length} سند</span>
                </div>
              </div>

              {filteredFiles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DCD6CA] py-12 text-center">
                  <FileText size={30} className="mx-auto text-[#C1BAAE]" />
                  <p className="text-sm text-[#8C8A80] mt-3">هنوز سندی برای این پرونده ثبت نشده است.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
                  <div className="hidden sm:grid grid-cols-[1fr_150px_130px] gap-4 px-5 py-3 bg-[#FAF8F3] border-b border-[#EDEBE2] text-xs text-[#8C8A80]">
                    <span>عنوان سند</span>
                    <span>تاریخ ثبت</span>
                    <span className="text-center">عملیات</span>
                  </div>

                  {filteredFiles.map((file) => {
                    const Icon = fileIconFor(file.type);
                    return (
                      <div key={file.id} className="grid grid-cols-1 sm:grid-cols-[1fr_150px_130px] gap-3 sm:gap-4 items-center px-5 py-4 border-b last:border-b-0 border-[#EEEAE2] hover:bg-[#FCFBF8] transition-colors">
                        <button
                          type="button"
                          onClick={() => openDocument(file)}
                          className="flex items-center gap-3 min-w-0 text-right group"
                        >
                          <span className="w-10 h-10 rounded-xl bg-[#F7F3EA] flex items-center justify-center shrink-0">
                            <Icon size={19} className="text-[#9A6A24]" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-[#262420] group-hover:text-[#9A6A24] transition-colors whitespace-normal break-words leading-6">{file.title}</span>
                            <span className="block text-xs text-[#9A958C] mt-1 truncate">{file.name} · {formatSize(file.size)}</span>
                          </span>
                        </button>

                        <div className="flex items-center gap-1.5 text-xs text-[#6F6B63]">
                          <CalendarDays size={15} className="text-[#A9762F]" />
                          {formatPersianDate(file.uploadedAt)}
                        </div>

                        <div className="flex sm:justify-center">
                          <a
                            href={file.url}
                            download={file.name}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-[#E1D9CB] bg-white text-xs text-[#7A531F] hover:bg-[#F9F5ED] transition-colors"
                          >
                            <Download size={15} />
                            دانلود سند
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEBE2]">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{previewFile.title}</p>
                <p className="text-xs text-[#8C8A80] mt-1">{previewFile.name}</p>
              </div>
              <button type="button" onClick={() => setPreviewFile(null)} className="p-2 text-[#8C8A80] hover:text-[#262420]">
                <X size={19} />
              </button>
            </div>
            <div className="p-4 max-h-[78vh] overflow-auto bg-[#F7F5F0]">
              <img src={previewFile.url} alt={previewFile.title} className="max-w-full h-auto mx-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
