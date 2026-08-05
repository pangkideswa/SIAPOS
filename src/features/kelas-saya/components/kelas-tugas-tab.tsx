"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  ClipboardList,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  ArrowUpDown,
  Clock,
} from "lucide-react"
import { TugasFormDialog } from "@/features/tugas/components/tugas-form-dialog"
import { TugasDeleteDialog } from "@/features/tugas/components/tugas-delete-dialog"
import { TugasDetailDialog } from "@/features/kelas-saya/components/tugas-detail-dialog"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import {
  useCreateAssignment,
  useUpdateAssignment,
  useRemoveAssignment,
} from "@/hooks/use-assignments"
import { useClassroom } from "@/hooks/use-classroom"
import type { Tugas, TugasFormData } from "@/features/tugas/types/tugas"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import { cn } from "@/lib/utils"

interface KelasTugasTabProps {
  kelasMengajar: KelasMengajar
}

type TugasFilter = "Semua" | "Draft" | "Dipublikasikan" | "Ditutup"
type TugasSort = "terbaru" | "terlama"

const FILTER_OPTIONS: { value: TugasFilter; label: string }[] = [
  { value: "Semua", label: "Semua" },
  { value: "Dipublikasikan", label: "Published" },
  { value: "Draft", label: "Draft" },
  { value: "Ditutup", label: "Closed" },
]

export function KelasTugasTab({ kelasMengajar }: KelasTugasTabProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<TugasFilter>("Semua")
  const [sort, setSort] = useState<TugasSort>("terbaru")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Tugas | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Tugas | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<Tugas | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const classroom = useClassroom()
  const createAssignment = useCreateAssignment()
  const updateAssignment = useUpdateAssignment()
  const removeAssignment = useRemoveAssignment()

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const jumlahSiswa = classroom.getAnggotaKelas(kelasMengajar.kelas).length
  const tugasList = classroom
    .getTugas(kelasMengajar.id)
    .filter(
      (t) =>
        filter === "Semua" || t.status === filter
    )
    .filter(
      (t) =>
        !search ||
        t.judul.toLowerCase().includes(search.toLowerCase()) ||
        t.deskripsi.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "terbaru"
        ? b.updated_at.localeCompare(a.updated_at)
        : a.updated_at.localeCompare(b.updated_at)
    )

  async function handleFormSubmit(data: TugasFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))

    if (editingItem) {
      await updateAssignment.mutateAsync({ id: editingItem.id, data })
    } else {
      await createAssignment.mutateAsync(data)
    }

    if (data.status === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "tugas",
        judul: `Tugas Baru: ${data.judul}`,
        pesan: `Tugas baru dipublikasikan di kelas ${data.mata_pelajaran} — ${data.kelas}. Tenggat: ${formatDeadline(data.tenggat_waktu, data.tenggat_jam)}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: ["siswa"],
      })
    }

    setIsLoading(false)
    setFormDialogOpen(false)
    setEditingItem(null)
  }

  function formatDeadline(dateStr: string, jam?: string | null) {
    const date = new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    return jam ? `${date} ${jam}` : date
  }

  async function handleDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    await removeAssignment.mutateAsync(deletingItem.id)
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  function cycleStatus(tugas: Tugas) {
    const nextStatus: Tugas["status"] =
      tugas.status === "Draft"
        ? "Dipublikasikan"
        : tugas.status === "Dipublikasikan"
          ? "Ditutup"
          : "Dipublikasikan"
    updateAssignment.mutate({
      id: tugas.id,
      data: { ...tugas, status: nextStatus },
    })
    if (nextStatus === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "tugas",
        judul: `Tugas Baru: ${tugas.judul}`,
        pesan: `Tugas dipublikasikan di kelas ${tugas.mata_pelajaran} — ${tugas.kelas}. Tenggat: ${formatDeadline(tugas.tenggat_waktu, tugas.tenggat_jam)}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: ["siswa"],
      })
    }
  }

  function handleDuplicate(tugas: Tugas) {
    createAssignment.mutate({
      judul: `${tugas.judul} (Salinan)`,
      deskripsi: tugas.deskripsi,
      kelas_mengajar_id: tugas.kelas_mengajar_id,
      guru_nama: tugas.guru_nama,
      mata_pelajaran: tugas.mata_pelajaran,
      kelas: tugas.kelas,
      lampiran: tugas.lampiran,
      tanggal_dibuka: tugas.tanggal_dibuka,
      tenggat_waktu: tugas.tenggat_waktu,
      tenggat_jam: tugas.tenggat_jam,
      nilai_maksimal: tugas.nilai_maksimal,
      status: "Draft",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari tugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditingItem(null)
            setFormDialogOpen(true)
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tugas
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
      ) : tugasList.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            search || filter !== "Semua"
              ? "Tugas tidak ditemukan"
              : "Belum Ada Tugas"
          }
          description={
            search || filter !== "Semua"
              ? "Tidak ada tugas yang cocok dengan pencarian atau filter."
              : "Klik 'Tambah Tugas' untuk mulai membuat tugas baru."
          }
        />
      ) : (
        <div className="space-y-3">
          {tugasList.map((tugas) => {
            const pengumpulan = classroom.getTugasPengumpulan(tugas.id)
            const sudah = pengumpulan.filter(
              (p) => p.status !== "Belum Mengumpulkan"
            ).length
            const progress =
              jumlahSiswa > 0
                ? Math.round((sudah / jumlahSiswa) * 100)
                : 0
            return (
              <div
                key={tugas.id}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 shrink-0">
                      <ClipboardList className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{tugas.judul}</h4>
                        <Badge
                          className={
                            STATUS_TUGAS_COLORS[tugas.status] ?? ""
                          }
                        >
                          {tugas.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {tugas.deskripsi || "Tidak ada deskripsi."}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Tenggat:{" "}
                          {formatDeadline(
                            tugas.tenggat_waktu,
                            tugas.tenggat_jam
                          )}
                        </span>
                        {tugas.tenggat_jam && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {tugas.tenggat_jam} WIB
                          </span>
                        )}
                        <span>Nilai Maks: {tugas.nilai_maksimal}</span>
                        {tugas.lampiran.length > 0 && (
                          <span>{tugas.lampiran.length} lampiran</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Lihat Detail"
                      onClick={() => {
                        setDetailItem(tugas)
                        setDetailDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={
                        tugas.status === "Draft"
                          ? "Publikasikan"
                          : tugas.status === "Dipublikasikan"
                            ? "Tutup Tugas"
                            : "Buka Kembali"
                      }
                      onClick={() => cycleStatus(tugas)}
                    >
                      {tugas.status === "Draft" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : tugas.status === "Dipublikasikan" ? (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Edit"
                      onClick={() => {
                        setEditingItem(tugas)
                        setFormDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Duplikasi"
                      onClick={() => handleDuplicate(tugas)}
                    >
                      <Copy className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Hapus"
                      onClick={() => {
                        setDeletingItem(tugas)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <Progress
                    value={progress}
                    className="flex-1 h-1.5"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {sudah}/{jumlahSiswa} mengumpulkan
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TugasFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        defaultKelasMengajarId={kelasMengajar.id}
      />
      <TugasDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
      <TugasDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        tugas={detailItem}
      />
    </div>
  )
}
