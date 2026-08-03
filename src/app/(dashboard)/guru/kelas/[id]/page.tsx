import { KelasDetailPage } from "@/features/kelas-saya/components/kelas-detail-page"

export default function KelasDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <KelasDetailPage params={params} />
}
