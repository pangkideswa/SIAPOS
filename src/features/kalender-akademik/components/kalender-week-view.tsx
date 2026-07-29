"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { KalenderEvent } from "../types/kalender-akademik"
import { KATEGORI_COLORS } from "../constants/kalender-akademik.constants"
import {
  getWeekDays,
  isSameDay,
  isDateInRange,
  DAY_NAMES,
} from "./kalender-helpers"

interface WeekViewProps {
  events: KalenderEvent[]
  onEventClick: (event: KalenderEvent) => void
}

export function KalenderWeekView({ events, onEventClick }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const days = useMemo(() => getWeekDays(currentDate), [currentDate])

  const prevWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }
  const nextWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const today = new Date()

  const getEventsForDay = (day: Date) => {
    return events.filter(
      (e) =>
        isSameDay(day, new Date(e.tanggal_mulai + "T00:00:00")) ||
        isDateInRange(day, e.tanggal_mulai, e.tanggal_selesai)
    )
  }

  const weekLabel = `${days[0].toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })} - ${days[6].toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="outline" size="icon-sm" onClick={prevWeek} aria-label="Minggu sebelumnya">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-semibold">{weekLabel}</h3>
        <Button variant="outline" size="icon-sm" onClick={nextWeek} aria-label="Minggu berikutnya">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today)
          const dayEvents = getEventsForDay(day)
          return (
            <div
              key={i}
              className={`min-h-[200px] border-r border-border p-2 ${
                isToday ? "bg-primary/5" : ""
              }`}
            >
              <div className="text-center mb-2">
                <p className="text-xs text-muted-foreground">{DAY_NAMES[i]}</p>
                <div
                  className={`text-sm font-semibold mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                    isToday ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 5).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left"
                  >
                    <Badge
                      className={`${KATEGORI_COLORS[event.kategori]} text-[10px] px-1.5 py-0.5 block w-full h-auto leading-tight text-wrap`}
                    >
                      {event.nama_event}
                    </Badge>
                  </button>
                ))}
                {dayEvents.length > 5 && (
                  <p className="text-[10px] text-muted-foreground text-center">
                    +{dayEvents.length - 5} lainnya
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
