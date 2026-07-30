import { MateriDetailPage } from "@/features/materi/components/materi-detail-page"

export default function MateriDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <MateriDetailPage params={params} />
}
