import type { ConsultationSession } from "@/types/session.types";

export const mockSessions: ConsultationSession[] = [
  {
    id: "session-001",
    clientName: "مریم احمدی",
    clientPhone: "09121234567",
    sessionDate: "2026-04-04",
    sessionTime: "10:30",
    status: "DONE",
    description: "بررسی مدارک مهریه و توضیح مراحل بعدی پرونده.",
    createdAt: "2026-03-28T09:00:00Z",
  },
  {
    id: "session-002",
    clientName: "علی رضایی",
    clientPhone: "09359876543",
    sessionDate: "2026-04-06",
    sessionTime: "14:00",
    status: "SCHEDULED",
    description: "جلسه اول مشاوره درباره دعوای نفقه.",
    createdAt: "2026-03-29T11:00:00Z",
  },
  {
    id: "session-003",
    clientName: "سارا محمدی",
    clientPhone: "09121122334",
    sessionDate: "2026-04-10",
    sessionTime: "16:30",
    status: "SCHEDULED",
    description: "پیگیری وضعیت پرونده کلاهبرداری اینترنتی.",
    createdAt: "2026-03-30T08:30:00Z",
  },
];