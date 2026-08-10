"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Video,
  Globe,
  Type,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  BookOpen,
} from "lucide-react"
import { MateriFormDialog } from "@/features/materi/components/materi-form-dialog"
import { MateriDeleteDialog } from "@/features/materi/components/materi-delete-dialog"
import { MateriJenisBadge } from "@/features/materi/components/materi-jenis-badge"
import { MateriViewDialog } from "@/features/kelas-saya/components/materi-view-dialog"
import { STATUS_MATERI_COLORS } from "@/features/materi/constants/materi.constants"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import {
  useCreateMaterial,
  useUpdateMaterial,
  useRemoveMaterial,
} from "@/hooks/use-materials"
import { useClassroom } from "@/hooks/use-classroom"
import type { Materi, MateriFormData } from "@/features/materi/types/materi"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import { cn } from "@/lib/utils"

interface KelasMateriTabProps {
  kelasMengajar: KelasMengajar
}

type MateriFilter = "Semua" | "Draft" | "Publish"
type MateriSort = "terbaru" | "terlama"

const FILTER_OPTIONS: { value: MateriFilter; label: string }[] = [
  { value: "Semua", label: "Semua" },
  { value: "Publish", label: "Published" },
  { value: "Draft", label: "Draft" },
]

function getJenisIkon(materi: Materi) {
  if (materi.jenis_materi === "Video" || materi.video_url)
    return { icon: Video, label: "Video", className: "text-red-500 bg-red-500/10" }
  if (materi.jenis_materi === "Drive")
    return { icon: Globe, label: "Drive", className: "text-yellow-600 bg-yellow-600/10" }
  if (materi.jenis_materi === "URL")
    return { icon: Globe, label: "URL", className: "text-indigo-600 bg-indigo-600/10" }
  if (materi.jenis_materi !== "Lainnya")
    return { icon: FileText, label: materi.jenis_materi, className: "text-blue-600 bg-blue-600/10" }
  if (materi.lampiran.length > 0)
    return { icon: FileText, label: "File", className: "text-blue-600 bg-blue-600/10" }
  if (materi.isi_materi)
    return { icon: Type, label: "Teks", className: "text-purple-600 bg-purple-600/10" }
  return { icon: Globe, label: "Lainnya", className: "text-muted-foreground bg-gray-600/10" }
}

export function KelasMateriTab({ kelasMengajar }: KelasMateriTabProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<MateriFilter>("Semua")
  const [sort, setSort] = useState<MateriSort>("terbaru")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Materi | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Materi | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<Materi | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const classroom = useClassroom()
  const createMaterial = useCreateMaterial()
  const updateMaterial = useUpdateMaterial()
  const removeMaterial = useRemoveMaterial()

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const materiList = classroom
    .getMateri(kelasMengajar.id)
    .filter(
      (m) =>
        filter === "Semua" || m.status === filter
    )
    .filter(
      (m) =>
        !search ||
        m.judul.toLowerCase().includes(search.toLowerCase()) ||
        m.deskripsi.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "terbaru"
        ? b.updated_at.localeCompare(a.updated_at)
        : a.updated_at.localeCompare(b.updated_at)
    )

  async function handleFormSubmit(data: MateriFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))

    if (editingItem) {
      await updateMaterial.mutateAsync({ id: editingItem.id, data })
    } else {
      await createMaterial.mutateAsync(data)
    }

    if (data.status === "Publish") {
      pushNotifikasi({
        tipe: "materi",
        judul: `Materi Baru: ${data.judul}`,
        pesan: `${data.guru_nama} menambahkan materi baru di kelas ${data.mata_pelajaran} — ${data.kelas}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: ["siswa"],
      })
    }

    setIsLoading(false)
    setFormDialogOpen(false)
    setEditingItem(null)
  }

  async function handleDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    await removeMaterial.mutateAsync(deletingItem.id)
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  function togglePublish(materi: Materi) {
    const nextStatus: Materi["status"] =
      materi.status === "Publish" ? "Draft" : "Publish"
    updateMaterial.mutate({
      id: materi.id,
      data: { ...materi, status: nextStatus },
    })
    if (nextStatus === "Publish") {
      pushNotifikasi({
        tipe: "materi",
        judul: `Materi Baru: ${materi.judul}`,
        pesan: `${materi.guru_nama} memublikasikan materi di kelas ${materi.mata_pelajaran} — ${materi.kelas}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: ["siswa"],
      })
    }
  }

  function openCreate() {
    setEditingItem(null)
    setFormDialogOpen(true)
  }

  function openEdit(materi: Materi) {
    setEditingItem(materi)
    setFormDialogOpen(true)
  }

  function openDelete(materi: Materi) {
    setDeletingItem(materi)
    setDeleteDialogOpen(true)
  }

  function openView(materi: Materi) {
    setViewingItem(materi)
    setViewDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari materi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Materi
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border",
                  filter === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSort(sort === "terbaru" ? "terlama" : "terbaru")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sort === "terbaru" ? "Terbaru" : "Terlama"}
          </button>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : materiList.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={
            search || filter !== "Semua"
              ? "Materi tidak ditemukan"
              : "Belum Ada Materi"
          }
          description={
            search || filter !== "Semua"
              ? "Tidak ada materi yang cocok dengan pencarian atau filter."
              : "Klik 'Tambah Materi' untuk mulai membuat materi pembelajaran."
          }
        />
      ) : (
        <div className="space-y-3">
          {materiList.map((materi) => {
            const jenis = getJenisIkon(materi)
            const JenisIcon = jenis.icon
            return (
              <div
                key={materi.id}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${jenis.className}`}
                    >
                      <JenisIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{materi.judul}</h4>
                        {materi.pertemuan && (
                          <Badge variant="secondary">
                            Pertemuan {materi.pertemuan}
                          </Badge>
                        )}
                        <Badge
                          className={
                            STATUS_MATERI_COLORS[materi.status] ?? ""
                          }
                        >
                          {materi.status}
                        </Badge>
                        <MateriJenisBadge jenis={materi.jenis_materi} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {materi.deskripsi || "Tidak ada deskripsi."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Diperbarui{" "}
                        {new Date(materi.updated_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        {materi.lampiran.length > 0 &&
                          ` · ${materi.lampiran.length} lampiran`}
                        {materi.video_url && " · video"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Lihat"
                      onClick={() => openView(materi)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={
                        materi.status === "Publish"
                          ? "Jadikan Draft"
                          : "Publikasikan"
                      }
                      onClick={() => togglePublish(materi)}
                    >
                      {materi.status === "Publish" ? (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Edit"
                      onClick={() => openEdit(materi)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Hapus"
                      onClick={() => openDelete(materi)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <MateriFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        defaultKelasMengajarId={kelasMengajar.id}
      />
      <MateriDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
      <MateriViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        materi={viewingItem}
      />
    </div>
  )
}
