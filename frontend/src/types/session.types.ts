export type SessionStatus = "SCHEDULED" | "DONE";

export interface ConsultationSession {
  id: string;
  clientName: string;
  clientPhone: string;
  sessionDate: string; // ISO date
  sessionTime: string; // "14:30"
  status: SessionStatus;
  description: string;
  createdAt: string;
}

export interface CreateSessionInput {
  clientName: string;
  clientPhone: string;
  sessionDate: string;
  sessionTime: string;
  description: string;
}