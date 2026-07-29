"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CalendarCheck, BookOpen, School, CalendarRange } from "lucide-react"
import type { KalenderEvent } from "../types/kalender-akademik"

interface SummaryCardsProps {
  events: KalenderEvent[]
}

export function KalenderSummaryCards({ events }: SummaryCardsProps) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const totalEvent = events.length
  const eventBulanIni = events.filter((e) => {
    const d = new Date(e.tanggal_mulai + "T00:00:00")
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length
  const libur = events.filter(
    (e) => e.kategori === "Libur Nasional" || e.kategori === "Libur Sekolah"
  ).length
  const ujian = events.filter(
    (e) => e.kategori === "UTS" || e.kategori === "UAS" || e.kategori === "Asesmen"
  ).length
  const kegiatan = events.filter((e) => e.kategori === "Kegiatan Sekolah").length

  const cards = [
    { label: "Total Event", value: totalEvent, icon: Calendar, color: "text-blue-600 bg-blue-100" },
    { label: "Event Bulan Ini", value: eventBulanIni, icon: CalendarCheck, color: "text-green-600 bg-green-100" },
    { label: "Libur", value: libur, icon: BookOpen, color: "text-orange-600 bg-orange-100" },
    { label: "Ujian", value: ujian, icon: School, color: "text-purple-600 bg-purple-100" },
    { label: "Kegiatan", value: kegiatan, icon: CalendarRange ?? Calendar, color: "text-teal-600 bg-teal-100" },
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
