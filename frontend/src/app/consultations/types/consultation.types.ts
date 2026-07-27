export type ConsultationStatus =
  | "scheduled"
  | "completed"
  | "cancelled";

export interface Consultation {
  id: number;
  clientName: string;
  phone: string;
  date: string;
  weekday: string;
  time: string;
  status: ConsultationStatus;
}