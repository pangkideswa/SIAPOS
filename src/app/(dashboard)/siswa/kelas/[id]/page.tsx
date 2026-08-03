import { SiswaKelasDetailPage } from "@/features/kelas-saya/components/siswa-kelas-detail-page"

export default function SiswaKelasDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <SiswaKelasDetailPage params={params} />
}
