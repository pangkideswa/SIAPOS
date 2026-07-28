"use client"

import { useParams } from "next/navigation"
import { HasilUjianDetailPage } from "@/features/hasil-ujian/components/hasil-ujian-detail-page"

export default function SiswaHasilUjianDetailRoute() {
  const params = useParams<{ id: string }>()
  return <HasilUjianDetailPage id={params.id} />
}
