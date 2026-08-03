import { PengumumanDetailPage } from "@/features/pengumuman/components/pengumuman-detail-page"

export default function SiswaPengumumanDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <PengumumanDetailPage params={params} variant="siswa" />
}
