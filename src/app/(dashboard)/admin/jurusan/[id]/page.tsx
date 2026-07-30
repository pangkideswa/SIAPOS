"use client"

import { JurusanDetailPage } from "@/features/jurusan/components/jurusan-detail-page"

export default function JurusanDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <JurusanDetailPage params={params} />
}
