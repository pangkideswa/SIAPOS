"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"
import { MateriFormDialog } from "./materi-form-dialog"
import { MateriDeleteDialog } from "./materi-delete-dialog"
import { STATUS_MATERI_COLORS } from "@/features/materi/constants/materi.constants"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import {
  useMaterials,
  useCreateMaterial,
  useUpdateMaterial,
  useRemoveMaterial,
} from "@/hooks/use-materials"
import type { Materi, MateriFormData } from "@/features/materi/types/materi"

export function MateriListPage() {
  const router = useRouter()
  const {
    data: allMaterials = [],
    isLoading: isTableLoading,
    isError,
    refetch,
  } = useMaterials()
  
  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = classesData?.data ?? []
  const { data: teachers } = useTeachers()
  const createMutation = useCreateMaterial()
  const updateMutation = useUpdateMaterial()
  const removeMutation = useRemoveMaterial()
  const [search, setSearch] = useState("")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Materi | null>(null)
  const [deletingItem, setDeletingItem] = useState<Materi | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const perPage = 10

  const filteredData = allMaterials.filter((item) => {
    const matchesSearch =
      !search ||
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase())
    const matchesGuru = guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus =
      statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesGuru && matchesKelas && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "judul",
      header: "Judul Materi",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.judul)}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
            {String(item.deskripsi)}
          </p>
        </div>
      ),
    },
    {
      key: "guru_nama",
      header: "Guru",
      render: (item) => String(item.guru_nama),
    },
    {
      key: "mata_pelajaran",
      header: "Mata Pelajaran",
      render: (item) => String(item.mata_pelajaran),
    },
    {
      key: "kelas",
      header: "Kelas",
      render: (item) => (
        <Badge variant="outline">{String(item.kelas)}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = String(item.status)
        return (
          <Badge className={STATUS_MATERI_COLORS[status] ?? ""}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: "created_at",
      header: "Tanggal",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(String(item.created_at)).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[120px]",
      render: (item) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            title="Lihat Detail"
            onClick={() => router.push(`/guru/materi/${String(item.id)}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Edit"
            onClick={() =>
              openEdit(allMaterials.find((m) => m.id === Number(item.id)) ?? null)
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Hapus"
            onClick={() =>
              openDelete(allMaterials.find((m) => m.id === Number(item.id)) ?? null)
            }
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  function openCreate() {
    setEditingItem(null)
    setFormDialogOpen(true)
  }

  function openEdit(item: Materi | null) {
    setEditingItem(item)
    setFormDialogOpen(true)
  }

  function openDelete(item: Materi | null) {
    setDeletingItem(item)
    setDeleteDialogOpen(true)
  }

  async function handleFormSubmit(data: MateriFormData) {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      setFormDialogOpen(false)
      setEditingItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      await removeMutation.mutateAsync(deletingItem.id)
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materi Pembelajaran"
        description="Kelola materi pembelajaran untuk siswa."
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Materi
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, guru, atau mapel..."
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
          onValueChange={(v: string | null) => {
            setGuruFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Guru</SelectItem>
            {teachers?.map((guru) => (
              <SelectItem key={guru.id} value={guru.nama_lengkap}>
                {guru.nama_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={kelasFilter}
          onValueChange={(v: string | null) => {
            setKelasFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {classes.map((kelas) => (
              <SelectItem key={kelas.id} value={kelas.name}>
                {kelas.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v: string | null) => {
            setStatusFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Publish">Publish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError ? "Gagal memuat data materi" : "Tidak ada materi ditemukan"
        }
        onRowClick={(item) =>
          router.push(`/guru/materi/${String(item.id)}`)
        }
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data materi.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredData.length} data)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <MateriFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
      <MateriDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
