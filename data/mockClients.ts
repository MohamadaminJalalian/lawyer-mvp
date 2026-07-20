export type Client = {
    id: string;
    fullName: string;
    nationalCode: string;
    mobile: string;
    caseCount: number;
    createdAt: string;
};
export const mockClients: Client[] = [
    {
        id: "client-1",
        fullName: "مریم احمدی",
        nationalCode: "1234567890",
        mobile: "09121234567",
        caseCount: 3,
        createdAt: "1405/04/15",
    },
    {
        id: "client-2",
        fullName: "علی رضایی",
        nationalCode: "0987654321",
        mobile: "09351234567",
        caseCount: 1,
        createdAt: "1405/04/16",
    },
    {
        id: "client-3",
        fullName: "سارا محمدی",
        nationalCode: "1122334455",
        mobile: "09121112233",
        caseCount: 0,
        createdAt: "1405/04/17",
    },
    {
        id: "client-4",
        fullName: "حسین کریمی",
        nationalCode: "5566778899",
        mobile: "09199988776",
        caseCount: 5,
        createdAt: "1405/04/18",
    },
    {
        id: "client-5",
        fullName: "زهرا نوری",
        nationalCode: "6677889900",
        mobile: "09351234000",
        caseCount: 2,
        createdAt: "1405/04/19",
    },
];