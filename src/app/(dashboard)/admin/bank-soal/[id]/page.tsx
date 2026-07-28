"use client"

import { useParams } from "next/navigation"
import { BankSoalDetailPage } from "@/features/bank-soal/components/bank-soal-detail-page"

export default function BankSoalDetailRoute() {
  const params = useParams<{ id: string }>()
  return <BankSoalDetailPage id={params.id} />
}
