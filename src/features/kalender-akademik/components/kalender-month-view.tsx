"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { KalenderEvent } from "../types/kalender-akademik"
import { KATEGORI_COLORS } from "../constants/kalender-akademik.constants"
import {
  getMonthDays,
  isSameDay,
  isDateInRange,
  DAY_NAMES,
  MONTH_NAMES,
} from "./kalender-helpers"

interface MonthViewProps {
  events: KalenderEvent[]
  onEventClick: (event: KalenderEvent) => void
}

export function KalenderMonthView({ events, onEventClick }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = useMemo(() => getMonthDays(year, month), [year, month])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const today = new Date()

  const getEventsForDay = (day: Date) => {
    return events.filter(
      (e) =>
        isSameDay(day, new Date(e.tanggal_mulai + "T00:00:00")) ||
        isDateInRange(day, e.tanggal_mulai, e.tanggal_selesai)
    )
  }

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="outline" size="icon-sm" onClick={prevMonth} aria-label="Bulan sebelumnya">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-semibold">
          {MONTH_NAMES[month]} {year}
        </h3>
        <Button variant="outline" size="icon-sm" onClick={nextMonth} aria-label="Bulan berikutnya">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-2 text-xs font-medium text-muted-foreground border-b border-border bg-muted/30"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === month
          const isToday = isSameDay(day, today)
          const dayEvents = getEventsForDay(day)
          return (
            <div
              key={i}
              className={`min-h-[90px] border-b border-r border-border p-1 ${
                !isCurrentMonth ? "bg-muted/20" : ""
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left"
                  >
                    <Badge
                      className={`${KATEGORI_COLORS[event.kategori]} text-[10px] px-1 py-0 truncate block max-w-full h-auto leading-tight`}
                    >
                      {event.nama_event}
                    </Badge>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted-foreground px-1">
                    +{dayEvents.length - 3} lainnya
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
