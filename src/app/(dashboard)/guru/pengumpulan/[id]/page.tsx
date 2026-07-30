import { PengumpulanDetailPage } from "@/features/pengumpulan/components/pengumpulan-detail-page"

export default function PengumpulanDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <PengumpulanDetailPage params={params} />
}
