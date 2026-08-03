"use client"

import { useState, useCallback } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { KelasMengajarFormDialog } from "./kelas-mengajar-form-dialog"
import { KelasMengajarDeleteDialog } from "./kelas-mengajar-delete-dialog"
import {
  STATUS_COLORS,
  SEMESTER_COLORS,
  GURU_OPTIONS,
  KELAS_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
} from "@/features/kelas-mengajar/constants/kelas-mengajar.constants"
import { DUMMY_KELAS_MENGAJAR } from "@/features/kelas-mengajar/dummy/kelas-mengajar.data"
import type { KelasMengajar, KelasMengajarFormData } from "@/features/kelas-mengajar/types/kelas-mengajar"

export function KelasMengajarListPage() {
  const [search, setSearch] = useState("")
  const [guruFilter, setGuruFilter] = useState<string>("all")
  const [kelasFilter, setKelasFilter] = useState<string>("all")
  const [tahunFilter, setTahunFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KelasMengajar | null>(null)
  const [deletingItem, setDeletingItem] = useState<KelasMengajar | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const perPage = 10

  const filteredData = DUMMY_KELAS_MENGAJAR.filter((item) => {
    if (guruFilter !== "all" && item.guru_nama !== guruFilter) return false
    if (kelasFilter !== "all" && item.kelas !== kelasFilter) return false
    if (tahunFilter !== "all" && item.tahun_ajaran !== tahunFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        item.guru_nama.toLowerCase().includes(q) ||
        item.mata_pelajaran.toLowerCase().includes(q) ||
        item.kelas.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "guru_nama",
      header: "Guru",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
            {String(item.guru_nama)
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className="font-medium">{String(item.guru_nama)}</span>
        </div>
      ),
    },
    {
      key: "mata_pelajaran",
      header: "Mata Pelajaran",
      render: (item) => (
        <span className="text-sm">{String(item.mata_pelajaran)}</span>
      ),
    },
    {
      key: "kelas",
      header: "Kelas",
      render: (item) => (
        <Badge variant="secondary" className="text-xs">
          {String(item.kelas)}
        </Badge>
      ),
    },
    {
      key: "tahun_ajaran",
      header: "Tahun Ajaran",
      render: (item) => (
        <span className="text-sm">{String(item.tahun_ajaran)}</span>
      ),
    },
    {
      key: "semester",
      header: "Semester",
      render: (item) => {
        const semester = String(item.semester)
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEMESTER_COLORS[semester] ?? "bg-gray-100 text-gray-800"}`}
          >
            {semester}
          </span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = String(item.status)
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {status}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[100px]",
      render: (item) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => openEdit(item as unknown as KelasMengajar)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Hapus"
            onClick={() => {
              setDeletingItem(item as unknown as KelasMengajar)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  function openCreate() {
    setEditingItem(null)
    setFormDialogOpen(true)
  }

  function openEdit(item: KelasMengajar) {
    setEditingItem(item)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = useCallback(
    async (formData: KelasMengajarFormData) => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (editingItem) {
          const idx = DUMMY_KELAS_MENGAJAR.findIndex(
            (i) => i.id === editingItem.id
          )
          if (idx !== -1) {
            DUMMY_KELAS_MENGAJAR[idx] = {
              ...DUMMY_KELAS_MENGAJAR[idx],
              ...formData,
              updated_at: new Date().toISOString(),
            }
          }
        } else {
          const newItem: KelasMengajar = {
            id: Date.now(),
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          DUMMY_KELAS_MENGAJAR.push(newItem)
        }
        setFormDialogOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [editingItem]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const idx = DUMMY_KELAS_MENGAJAR.findIndex(
        (i) => i.id === deletingItem.id
      )
      if (idx !== -1) DUMMY_KELAS_MENGAJAR.splice(idx, 1)
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } finally {
      setIsLoading(false)
    }
  }, [deletingItem])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelas Mengajar"
        description="Kelola data kelas mengajar guru"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari guru, mata pelajaran, atau kelas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={guruFilter}
          onValueChange={(value) => {
            setGuruFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru</SelectItem>
            {GURU_OPTIONS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={kelasFilter}
          onValueChange={(value) => {
            setKelasFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {KELAS_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={tahunFilter}
          onValueChange={(value) => {
            setTahunFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {TAHUN_AJARAN_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        loading={false}
        emptyMessage="Tidak ada kelas mengajar ditemukan"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredData.length} data)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <KelasMengajarFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <KelasMengajarDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
