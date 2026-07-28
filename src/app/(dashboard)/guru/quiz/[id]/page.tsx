"use client"

import { useParams } from "next/navigation"
import { QuizDetailPage } from "@/features/quiz/components/quiz-detail-page"

export default function QuizDetailRoute() {
  const params = useParams<{ id: string }>()
  return <QuizDetailPage id={params.id} />
}
