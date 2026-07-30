import NoticeDocumentsPage from "@/components/notices/NoticeDocumentsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NoticeDocumentsPage noticeId={id} />;
}