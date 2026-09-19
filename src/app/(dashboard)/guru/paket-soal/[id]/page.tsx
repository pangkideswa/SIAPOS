"use client"

import { useParams } from "next/navigation"
import { PaketSoalDetailPage } from "@/features/paket-soal/components/paket-soal-detail-page"

export default function PaketSoalDetailRoute() {
  const params = useParams<{ id: string }>()
  return <PaketSoalDetailPage id={params.id} />
}
