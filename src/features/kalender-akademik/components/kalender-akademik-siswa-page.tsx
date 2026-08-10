"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs } from "@/components/ui/tabs"
import type { KalenderEvent } from "../types/kalender-akademik"
import {
  KATEGORI_OPTIONS,
  BULAN_OPTIONS,
} from "../constants/kalender-akademik.constants"
import { DUMMY_KALENDER_EVENTS } from "../dummy/kalender-akademik.data"
import { KalenderSummaryCards } from "./kalender-summary-cards"
import { KalenderMonthView } from "./kalender-month-view"
import { KalenderWeekView } from "./kalender-week-view"
import { KalenderAgendaView } from "./kalender-agenda-view"
import { KalenderEventDetailDialog } from "./kalender-event-detail-dialog"

export function KalenderAkademikSiswaPage() {
  const [events] = useState<KalenderEvent[]>(DUMMY_KALENDER_EVENTS)
  const [search, setSearch] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("semua")
  const [bulanFilter, setBulanFilter] = useState("semua")
  const [viewMode, setViewMode] = useState("month")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<KalenderEvent | null>(null)

  const filteredData = useMemo(() => {
    let data = [...events]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((e) => e.nama_event.toLowerCase().includes(q))
    }
    if (kategoriFilter !== "semua") {
      data = data.filter((e) => e.kategori === kategoriFilter)
    }
    if (bulanFilter !== "semua") {
      const month = Number.parseInt(bulanFilter)
      data = data.filter((e) => {
        const d = new Date(e.tanggal_mulai + "T00:00:00")
        return d.getMonth() === month
      })
    }
    return data
  }, [events, search, kategoriFilter, bulanFilter])

  const handleEventClick = (event: KalenderEvent) => {
    setSelectedEvent(event)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kalender Akademik"
        description="Lihat agenda kegiatan sekolah"
      />

      <KalenderSummaryCards events={events} />

      <Tabs.Root value={viewMode} onValueChange={(v) => setViewMode(v as string)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs.List>
            <Tabs.Tab value="month">Month</Tabs.Tab>
            <Tabs.Tab value="week">Week</Tabs.Tab>
            <Tabs.Tab value="agenda">Agenda</Tabs.Tab>
          </Tabs.List>
        </div>

        <Tabs.Panel value="month">
          <KalenderMonthView events={filteredData} onEventClick={handleEventClick} />
        </Tabs.Panel>
        <Tabs.Panel value="week">
          <KalenderWeekView events={filteredData} onEventClick={handleEventClick} />
        </Tabs.Panel>
        <Tabs.Panel value="agenda">
          <KalenderAgendaView events={filteredData} onEventClick={handleEventClick} />
        </Tabs.Panel>
      </Tabs.Root>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={kategoriFilter} onValueChange={(v) => setKategoriFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            {KATEGORI_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={bulanFilter} onValueChange={(v) => setBulanFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Bulan</SelectItem>
            {BULAN_OPTIONS.map((b) => (
              <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <KalenderEventDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        event={selectedEvent}
      />
    </div>
  )
}
