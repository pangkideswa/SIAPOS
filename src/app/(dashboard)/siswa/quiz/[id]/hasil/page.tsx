"use client"

import { useParams } from "next/navigation"
import { QuizResultPage } from "@/features/quiz/components/quiz-result-page"

export default function QuizResultRoute() {
  const params = useParams<{ id: string }>()
  return <QuizResultPage id={params.id} />
}
