"use client"

import { useState, useCallback, useMemo } from "react"
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
  TAHUN_AJARAN_OPTIONS,
} from "@/features/kelas-mengajar/constants/kelas-mengajar.constants"
import {
  useTeachingClassesPaginated,
  useCreateTeachingClass,
  useUpdateTeachingClass,
  useRemoveTeachingClass,
} from "@/hooks/use-teaching-classes"
import { useTeachers } from "@/hooks/use-teachers"
import { useClasses } from "@/hooks/use-classes"
import type { KelasMengajar, KelasMengajarFormData } from "@/features/kelas-mengajar/types/kelas-mengajar"

export function KelasMengajarListPage() {
  const [search, setSearch] = useState("")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [tahunFilter, setTahunFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KelasMengajar | null>(null)
  const [deletingItem, setDeletingItem] = useState<KelasMengajar | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load filter options dari API
  const { data: teachersData } = useTeachers()
  const { data: classesData } = useClasses({ per_page: 200 })
  const teacherOptions = useMemo(() => teachersData ?? [], [teachersData])
  const classOptions = useMemo(() => classesData?.data ?? [], [classesData])

  const {
    data,
    isLoading: isTableLoading,
    isError,
    refetch,
  } = useTeachingClassesPaginated({
    search: search || undefined,
    guru: guruFilter,
    kelas: kelasFilter,
    tahun_ajaran: tahunFilter,
    page,
    per_page: 10,
  })
  const createTeachingClass = useCreateTeachingClass()
  const updateTeachingClass = useUpdateTeachingClass()
  const removeTeachingClass = useRemoveTeachingClass()

  const items = data?.data ?? []
  const meta = data?.meta

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
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEMESTER_COLORS[semester] ?? "bg-muted text-foreground"}`}
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
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-muted text-foreground"}`}
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
        if (editingItem) {
          await updateTeachingClass.mutateAsync({
            id: editingItem.id,
            data: formData,
          })
        } else {
          await createTeachingClass.mutateAsync(formData)
        }
        setFormDialogOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [editingItem, createTeachingClass, updateTeachingClass]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      await removeTeachingClass.mutateAsync(deletingItem.id)
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } finally {
      setIsLoading(false)
    }
  }, [deletingItem, removeTeachingClass])

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

        {/* Filter Guru — dari database */}
        <Select
          value={guruFilter}
          onValueChange={(value) => {
            setGuruFilter(value ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Guru</SelectItem>
            {teacherOptions.map((t) => (
              <SelectItem key={t.id} value={t.nama_lengkap}>
                {t.nama_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Kelas — dari database */}
        <Select
          value={kelasFilter}
          onValueChange={(value) => {
            setKelasFilter(value ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {classOptions.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tahunFilter}
          onValueChange={(value) => {
            setTahunFilter(value ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Tahun</SelectItem>
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
        data={items as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError
            ? "Gagal memuat data kelas mengajar"
            : "Tidak ada kelas mengajar ditemukan"
        }
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data kelas mengajar.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {meta.current_page} dari {meta.last_page} ({meta.total} data)
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
              disabled={page >= (meta?.last_page ?? 1)}
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
