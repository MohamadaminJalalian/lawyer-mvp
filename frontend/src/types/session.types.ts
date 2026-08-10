export type SessionStatus = "SCHEDULED" | "DONE";

export type SessionClientType = "PERMANENT" | "TEMPORARY";

export interface ConsultationSession {
  id: string;
  clientType: SessionClientType;
  clientName: string;
  clientPhone: string;
  clientNationalCode?: string;
  sessionDate: string; // ISO date
  sessionTime: string; // "14:30"
  status: SessionStatus;
  description: string;
  createdAt: string;
}

export interface CreateSessionInput {
  clientType: SessionClientType;
  clientName: string;
  clientPhone: string;
  clientNationalCode?: string;
  sessionDate: string;
  sessionTime: string;
  description: string;
}