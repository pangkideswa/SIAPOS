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
  Pin,
  User,
  CalendarDays,
  Target,
  School,
  Clock,
  Paperclip,
  Download,
  FileText,
} from "lucide-react"
import { RichTextContent } from "@/components/ui/rich-text-editor"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { PengumumanFormDialog } from "./pengumuman-form-dialog"
import { DUMMY_PENGUMUMAN } from "../dummy/pengumuman.data"
import type { Pengumuman } from "../types/pengumuman"
import {
  GURU_PENULIS,
  KATEGORI_PENGUMUMAN_COLORS,
  STATUS_PENGUMUMAN_COLORS,
} from "../constants/pengumuman.constants"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"

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

export function PengumumanDetailPage({
  params,
  variant,
}: {
  params: Promise<{ id: string }>
  variant: "admin" | "guru" | "siswa"
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const item = DUMMY_PENGUMUMAN.find((d) => d.id === Number(resolvedParams.id))
  const listPath = `/${variant}/pengumuman`

  const isOwner = item?.penulis === GURU_PENULIS
  const canEdit = variant === "admin" || (variant === "guru" && isOwner)

  function handleEditSubmit(data: Pengumuman) {
    if (!item) return
    const idx = DUMMY_PENGUMUMAN.findIndex((d) => d.id === item.id)
    if (idx !== -1) {
      DUMMY_PENGUMUMAN[idx] = {
        ...data,
        created_at: item.created_at,
        updated_at: new Date().toISOString(),
      }
    }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!item) return
    const idx = DUMMY_PENGUMUMAN.findIndex((d) => d.id === item.id)
    if (idx !== -1) DUMMY_PENGUMUMAN.splice(idx, 1)
    setDeleteOpen(false)
    router.push(listPath)
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Pengumuman"
          description="Pengumuman tidak ditemukan."
          action={
            <Button variant="outline" onClick={() => router.push(listPath)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            Pengumuman dengan ID {resolvedParams.id} tidak ditemukan.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Pengumuman"
        description={item.judul}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(listPath)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            {canEdit && (
              <>
                <Button variant="outline" onClick={() => setFormOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Pengumuman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow icon={User} label="Penulis" value={item.penulis} />
              <InfoRow
                icon={CalendarDays}
                label="Tanggal Publish"
                value={formatDateID(item.tanggal_publish)}
              />
              <InfoRow icon={Target} label="Target" value={item.target} />
              <InfoRow icon={School} label="Kelas" value={item.kelas ?? "-"} />
              <InfoRow
                icon={Clock}
                label="Terakhir Diubah"
                value={formatDateTime(item.updated_at)}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Badge className={STATUS_PENGUMUMAN_COLORS[item.status]}>
                {item.status}
              </Badge>
              <Badge className={KATEGORI_PENGUMUMAN_COLORS[item.kategori]}>
                {item.kategori}
              </Badge>
              {item.pinned && (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  Penting
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.ringkasan || "Tidak ada ringkasan."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Isi Pengumuman</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextContent html={item.isi} />
            </CardContent>
          </Card>

          {item.lampiran.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Lampiran ({item.lampiran.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.lampiran.map((file) => (
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

      <PengumumanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={item}
        onSave={handleEditSubmit}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
      />
    </div>
  )
}
