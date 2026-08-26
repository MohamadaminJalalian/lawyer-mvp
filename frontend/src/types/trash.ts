export type TrashFile = {
  id: string;
  fileName: string;
  fileKind: "IMAGE" | "DOCUMENT";
  clientName: string;
  caseTitle: string;
  caseNumber: string;
  deletedAt: string;
};
