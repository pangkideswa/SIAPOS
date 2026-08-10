"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import type { KalenderEvent } from "../types/kalender-akademik"
import { KATEGORI_COLORS } from "../constants/kalender-akademik.constants"
import { formatDateID } from "./kalender-helpers"
import { CalendarDays } from "lucide-react"

interface AgendaViewProps {
  events: KalenderEvent[]
  onEventClick: (event: KalenderEvent) => void
}

export function KalenderAgendaView({ events, onEventClick }: AgendaViewProps) {
  const grouped = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => new Date(a.tanggal_mulai).getTime() - new Date(b.tanggal_mulai).getTime()
    )
    const groups: Record<string, KalenderEvent[]> = {}
    for (const event of sorted) {
      const key = event.tanggal_mulai
      if (!groups[key]) groups[key] = []
      groups[key].push(event)
    }
    return groups
  }, [events])

  const entries = Object.entries(grouped)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mb-3" />
        <p>Tidak ada event</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="divide-y divide-border">
        {entries.map(([tanggal, dayEvents]) => (
          <div key={tanggal} className="p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              {formatDateID(tanggal)}
            </h4>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Badge
                    className={`${KATEGORI_COLORS[event.kategori]} shrink-0 mt-0.5`}
                  >
                    {event.kategori}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{event.nama_event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {event.deskripsi}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
