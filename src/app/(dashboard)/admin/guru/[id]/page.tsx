import { GuruDetailPage } from "@/features/guru/components/guru-detail-page"

export default function GuruDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <GuruDetailPage params={params} />
}
