"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, FileEdit, CheckCircle, Archive, Pin } from "lucide-react"
import type { Pengumuman } from "../types/pengumuman"

interface SummaryCardsProps {
  data: Pengumuman[]
}

export function PengumumanSummaryCards({ data }: SummaryCardsProps) {
  const total = data.length
  const draft = data.filter((d) => d.status === "Draft").length
  const published = data.filter((d) => d.status === "Dipublikasikan").length
  const archived = data.filter((d) => d.status === "Diarsipkan").length
  const pinned = data.filter((d) => d.pinned).length

  const cards = [
    { label: "Total Pengumuman", value: total, icon: Megaphone, color: "text-blue-600 bg-blue-100" },
    { label: "Draft", value: draft, icon: FileEdit, color: "text-yellow-600 bg-yellow-100" },
    { label: "Dipublikasikan", value: published, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    { label: "Diarsipkan", value: archived, icon: Archive, color: "text-muted-foreground bg-muted" },
    { label: "Pengumuman Penting", value: pinned, icon: Pin, color: "text-red-600 bg-red-100" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardContent className="flex items-start gap-3 pt-4">
            <div className={`shrink-0 rounded-lg p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
