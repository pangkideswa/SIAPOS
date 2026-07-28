"use client"

import { useParams } from "next/navigation"
import { CBTResultPage } from "@/features/cbt/components/cbt-result-page"

export default function CBTResultRoute() {
  const params = useParams<{ id: string }>()
  return <CBTResultPage id={params.id} />
}
