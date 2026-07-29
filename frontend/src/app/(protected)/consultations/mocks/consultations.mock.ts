import { Consultation } from "../types/consultation.types";

export const mockConsultations: Consultation[] = [
  {
    id: 1,
    clientName: "مریم احمدی",
    phone: "09121234567",
    date: "1405/05/12",
    weekday: "دوشنبه",
    time: "09:15",
    status: "scheduled",
  },
  {
    id: 2,
    clientName: "علی رضایی",
    phone: "09351239876",
    date: "1405/05/14",
    weekday: "چهارشنبه",
    time: "10:00",
    status: "completed",
  },
  {
    id: 3,
    clientName: "سارا محمدی",
    phone: "09189876543",
    date: "1405/05/18",
    weekday: "یکشنبه",
    time: "11:30",
    status: "cancelled",
  },
];