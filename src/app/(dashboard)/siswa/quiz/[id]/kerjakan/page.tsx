"use client"

import { useParams } from "next/navigation"
import { QuizTakePage } from "@/features/quiz/components/quiz-take-page"

export default function QuizTakeRoute() {
  const params = useParams<{ id: string }>()
  return <QuizTakePage id={params.id} />
}
