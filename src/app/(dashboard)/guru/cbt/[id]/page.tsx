"use client"

import { useParams } from "next/navigation"
import { CBTDetailPage } from "@/features/cbt/components/cbt-detail-page"

export default function CBTDetailRoute() {
  const params = useParams<{ id: string }>()
  return <CBTDetailPage id={params.id} />
}
