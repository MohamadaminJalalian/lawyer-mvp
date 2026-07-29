export type CaseStatus = "active" | "closed" | "archived";
export type CasePriority = "high" | "medium" | "low";
export type CourtType = "civil" | "criminal" | "family" | "commercial" | "administrative";

export interface Case {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  status: CaseStatus;
  priority: CasePriority;
  courtType: CourtType;
  caseNumber: string;
  createdAt: string;
  lastUpdate: string;
}
