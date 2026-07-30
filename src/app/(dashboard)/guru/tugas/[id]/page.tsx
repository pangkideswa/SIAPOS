import { TugasDetailPage } from "@/features/tugas/components/tugas-detail-page"

export default function TugasDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <TugasDetailPage params={params} />
}
