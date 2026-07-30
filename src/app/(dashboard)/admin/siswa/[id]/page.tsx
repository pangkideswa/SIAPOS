import { SiswaDetailPage } from "@/features/siswa/components/siswa-detail-page"

export default function SiswaDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <SiswaDetailPage params={params} />
}
