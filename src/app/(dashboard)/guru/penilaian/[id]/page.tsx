import { PenilaianDetailPage } from "@/features/penilaian/components/penilaian-detail-page"

export default function PenilaianDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <PenilaianDetailPage params={params} />
}
