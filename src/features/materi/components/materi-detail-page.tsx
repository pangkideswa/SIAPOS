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
  Video,
  Calendar,
  Clock,
  User,
  BookOpen,
  School,
  Download,
} from "lucide-react"
import { MateriFormDialog } from "./materi-form-dialog"
import { MateriDeleteDialog } from "./materi-delete-dialog"
import { STATUS_MATERI_COLORS } from "@/features/materi/constants/materi.constants"
import { materialService } from "@/features/materi/lib/material.service"
import type { MateriFormData } from "@/features/materi/types/materi"

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

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  )
  return match ? match[1] : null
}

export function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const materi = materialService.getById(Number(resolvedParams.id))

  function handleEditSubmit(data: MateriFormData) {
    return new Promise<void>(async (resolve) => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 500))
      if (materi) {
        materialService.update(materi.id, data)
      }
      setIsLoading(false)
      setFormDialogOpen(false)
      resolve()
    })
  }

  function handleDelete() {
    if (!materi) return
    setIsLoading(true)
    setTimeout(() => {
      materialService.remove(materi.id)
      setIsLoading(false)
      setDeleteDialogOpen(false)
      router.push("/guru/materi")
    }, 500)
  }

  if (!materi) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Materi"
          description="Materi tidak ditemukan."
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/guru/materi")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            Materi dengan ID {resolvedParams.id} tidak ditemukan.
          </CardContent>
        </Card>
      </div>
    )
  }

  const videoId = materi.video_url
    ? extractVideoId(materi.video_url)
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Materi"
        description={materi.judul}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/guru/materi")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              variant="outline"
              onClick={() => setFormDialogOpen(true)}
            >
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
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Materi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow
                icon={User}
                label="Guru"
                value={materi.guru_nama}
              />
              <InfoRow
                icon={BookOpen}
                label="Mata Pelajaran"
                value={materi.mata_pelajaran}
              />
              <InfoRow
                icon={School}
                label="Kelas"
                value={materi.kelas}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuat"
                value={formatDate(materi.created_at)}
              />
              <InfoRow
                icon={Clock}
                label="Terakhir Diubah"
                value={formatDateTime(materi.updated_at)}
              />
            </div>
            <div className="mt-4">
              <Badge className={STATUS_MATERI_COLORS[materi.status]}>
                {materi.status}
              </Badge>
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
              <p className="text-sm text-muted-foreground">
                {materi.deskripsi || "Tidak ada deskripsi."}
              </p>
            </CardContent>
          </Card>

          {/* Isi Materi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Isi Materi</CardTitle>
            </CardHeader>
            <CardContent>
              {materi.isi_materi ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: materi.isi_materi }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada konten materi.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Video */}
          {materi.video_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  Video Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videoId ? (
                  <div className="aspect-video rounded-lg overflow-hidden border border-border">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={materi.judul}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={materi.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {materi.video_url}
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lampiran */}
          {materi.lampiran.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lampiran ({materi.lampiran.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materi.lampiran.map((file) => (
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

      <MateriFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={materi}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />
      <MateriDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={materi}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
