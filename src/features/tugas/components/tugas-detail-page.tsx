"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  Clock,
  User,
  BookOpen,
  School,
  Download,
  ClipboardList,
} from "lucide-react"
import { toast } from "sonner"
import { TugasFormDialog } from "./tugas-form-dialog"
import { TugasDeleteDialog } from "./tugas-delete-dialog"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { assignmentService } from "@/features/tugas/lib/assignment.service"
import type { TugasFormData } from "@/features/tugas/types/tugas"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  )
}

export function TugasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const tugas = assignmentService.getById(Number(resolvedParams.id))

  function handleEditSubmit(data: TugasFormData) {
    return new Promise<void>(async (resolve) => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 500))
      if (tugas) {
        assignmentService.update(tugas.id, data)
      }
      setIsLoading(false)
      setFormDialogOpen(false)
      toast.success("Tugas berhasil diperbarui.")
      resolve()
    })
  }

  function handleDelete() {
    if (!tugas) return
    setIsLoading(true)
    setTimeout(() => {
      assignmentService.remove(tugas.id)
      setIsLoading(false)
      setDeleteDialogOpen(false)
      toast.success("Tugas berhasil dihapus.")
      router.push("/guru/tugas")
    }, 500)
  }

  if (!tugas) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Tugas"
          description="Tugas tidak ditemukan."
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/guru/tugas")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            Tugas dengan ID {resolvedParams.id} tidak ditemukan.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Tugas"
        description={tugas.judul}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => router.push("/guru/tugas")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button variant="outline" onClick={() => setFormDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
            <Button
              onClick={() =>
                router.push(`/guru/pengumpulan/${tugas.id}`)
              }
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Lihat Pengumpulan
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow icon={User} label="Guru" value={tugas.guru_nama} />
              <InfoRow
                icon={BookOpen}
                label="Mata Pelajaran"
                value={tugas.mata_pelajaran}
              />
              <InfoRow icon={School} label="Kelas" value={tugas.kelas} />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuka"
                value={formatDate(tugas.tanggal_dibuka)}
              />
              <InfoRow
                icon={Clock}
                label="Tenggat Waktu"
                value={
                  tugas.tenggat_jam
                    ? `${formatDate(tugas.tenggat_waktu)} ${tugas.tenggat_jam} WIB`
                    : formatDate(tugas.tenggat_waktu)
                }
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuat"
                value={formatDateTime(tugas.created_at)}
              />
              <InfoRow
                icon={Clock}
                label="Terakhir Diubah"
                value={formatDateTime(tugas.updated_at)}
              />
            </div>
            <div className="mt-4 space-y-2">
              <Badge className={STATUS_TUGAS_COLORS[tugas.status]}>
                {tugas.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Nilai Maksimal:{" "}
                <span className="font-semibold text-foreground">
                  {tugas.nilai_maksimal}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deskripsi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {tugas.deskripsi || "Tidak ada deskripsi."}
              </p>
            </CardContent>
          </Card>

          {/* Lampiran */}
          {tugas.lampiran.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lampiran ({tugas.lampiran.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tugas.lampiran.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.nama}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.ukuran}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TugasFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={tugas}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />
      <TugasDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={tugas}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
