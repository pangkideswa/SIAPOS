"use client"

import { useParams } from "next/navigation"
import { CBTExamPage } from "@/features/cbt/components/cbt-exam-page"

export default function CBTExamRoute() {
  const params = useParams<{ id: string }>()
  return <CBTExamPage id={params.id} />
}
