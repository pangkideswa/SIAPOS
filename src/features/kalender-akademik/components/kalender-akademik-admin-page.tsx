"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import type { KalenderEvent } from "../types/kalender-akademik"
import {
  KATEGORI_OPTIONS,
  KATEGORI_COLORS,
  STATUS_EVENT_COLORS,
  SEMESTER_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
  BULAN_OPTIONS,
} from "../constants/kalender-akademik.constants"
import { DUMMY_KALENDER_EVENTS } from "../dummy/kalender-akademik.data"
import { KalenderSummaryCards } from "./kalender-summary-cards"
import { KalenderMonthView } from "./kalender-month-view"
import { KalenderWeekView } from "./kalender-week-view"
import { KalenderAgendaView } from "./kalender-agenda-view"
import { KalenderEventFormDialog } from "./kalender-event-form-dialog"
import { KalenderEventDetailDialog } from "./kalender-event-detail-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatDateID } from "./kalender-helpers"

const PER_PAGE = 10

type EventRow = Record<string, unknown> & {
  id: number
  nama_event: string
  kategori: string
  tanggal_mulai: string
  tanggal_selesai: string
  tahun_ajaran: string
  semester: string
  status: string
}

export function KalenderAkademikAdminPage() {
  const [events, setEvents] = useState<KalenderEvent[]>(DUMMY_KALENDER_EVENTS)
  const [search, setSearch] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("semua")
  const [semesterFilter, setSemesterFilter] = useState("semua")
  const [tahunAjaranFilter, setTahunAjaranFilter] = useState("semua")
  const [bulanFilter, setBulanFilter] = useState("semua")
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState("month")
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<KalenderEvent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<KalenderEvent | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filteredData = useMemo(() => {
    let data = [...events]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((e) => e.nama_event.toLowerCase().includes(q))
    }
    if (kategoriFilter !== "semua") {
      data = data.filter((e) => e.kategori === kategoriFilter)
    }
    if (semesterFilter !== "semua") {
      data = data.filter((e) => e.semester === semesterFilter)
    }
    if (tahunAjaranFilter !== "semua") {
      data = data.filter((e) => e.tahun_ajaran === tahunAjaranFilter)
    }
    if (bulanFilter !== "semua") {
      const month = Number.parseInt(bulanFilter)
      data = data.filter((e) => {
        const d = new Date(e.tanggal_mulai + "T00:00:00")
        return d.getMonth() === month
      })
    }
    return data
  }, [events, search, kategoriFilter, semesterFilter, tahunAjaranFilter, bulanFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCreate = () => {
    setEditingEvent(null)
    setFormOpen(true)
  }

  const handleEdit = (event: KalenderEvent) => {
    setEditingEvent(event)
    setFormOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      setEvents((prev) => prev.filter((e) => e.id !== deletingId))
      setDeleteOpen(false)
      setDeletingId(null)
    }
  }

  const handleSave = (data: KalenderEvent) => {
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)))
    } else {
      setEvents((prev) => [...prev, data])
    }
  }

  const handleEventClick = (event: KalenderEvent) => {
    setSelectedEvent(event)
    setDetailOpen(true)
  }

  const columns: Column<EventRow>[] = [
    { key: "nama_event", header: "Nama Event" },
    {
      key: "kategori",
      header: "Kategori",
      render: (item) => (
        <Badge className={KATEGORI_COLORS[item.kategori as keyof typeof KATEGORI_COLORS] ?? ""}>
          {item.kategori}
        </Badge>
      ),
    },
    {
      key: "tanggal_mulai",
      header: "Tanggal Mulai",
      render: (item) => formatDateID(item.tanggal_mulai),
    },
    {
      key: "tanggal_selesai",
      header: "Tanggal Selesai",
      render: (item) => formatDateID(item.tanggal_selesai),
    },
    { key: "tahun_ajaran", header: "Tahun Ajaran" },
    { key: "semester", header: "Semester" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_EVENT_COLORS[item.status as keyof typeof STATUS_EVENT_COLORS] ?? ""}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(events.find((ev) => ev.id === item.id)!)
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(item.id)
            }}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kalender Akademik"
        description="Kelola seluruh kegiatan akademik sekolah"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Event
          </Button>
        }
      />

      <KalenderSummaryCards events={events} />

      <Tabs.Root value={viewMode} onValueChange={(v) => { setViewMode(v as string); setPage(1) }}>
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={kategoriFilter} onValueChange={(v) => { setKategoriFilter(v ?? "semua"); setPage(1) }}>
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
        <Select value={semesterFilter} onValueChange={(v) => { setSemesterFilter(v ?? "semua"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Semester</SelectItem>
            {SEMESTER_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tahunAjaranFilter} onValueChange={(v) => { setTahunAjaranFilter(v ?? "semua"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Tahun Ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua TA</SelectItem>
            {TAHUN_AJARAN_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={bulanFilter} onValueChange={(v) => { setBulanFilter(v ?? "semua"); setPage(1) }}>
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

      <DataTable<EventRow>
        columns={columns}
        data={paginatedData as unknown as EventRow[]}
        emptyMessage="Tidak ada data kalender akademik"
        onRowClick={(item) => handleEventClick(events.find((ev) => ev.id === item.id)!)}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(page - 1) * PER_PAGE + 1}-
            {Math.min(page * PER_PAGE, filteredData.length)} dari{" "}
            {filteredData.length} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      <KalenderEventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSave={handleSave}
      />

      <KalenderEventDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        event={selectedEvent}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Event"
        description="Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  )
}
