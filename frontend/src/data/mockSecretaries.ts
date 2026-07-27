import { Secretary } from "@/types/secretary";

export const mockSecretaries: Secretary[] = [
  {
    id: "sec-1",
    name: "سارا محمدی",
    mobile: "09121234567",
    online: true,
    permissions: { canDeleteFiles: true },
    createdAt: "2025-03-02T08:00:00.000Z",
  },
  {
    id: "sec-2",
    name: "نگار حسینی",
    mobile: "09351234567",
    online: false,
    permissions: { canDeleteFiles: false },
    createdAt: "2025-05-14T08:00:00.000Z",
  },
];