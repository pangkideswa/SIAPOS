"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Hash,
  BookOpen,
  ToggleLeft,
  FileText,
  Calendar,
  Clock,
} from "lucide-react"
import { JurusanFormDialog } from "./jurusan-form-dialog"
import { JurusanDeleteDialog } from "./jurusan-delete-dialog"
import { STATUS_LABELS, STATUS_COLORS, EMPTY_JURUSAN_FORM } from "@/features/jurusan/constants/jurusan.constants"
import {
  useJurusan,
  useUpdateJurusan,
  useDeleteJurusan,
} from "@/hooks/use-jurusan"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-sm font-medium mt-0.5">{value || "-"}</div>
      </div>
    </div>
  )
}

export function JurusanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: jurusan,
    isLoading: isDetailLoading,
  } = useJurusan(Number(resolvedParams.id))
  const updateJurusan = useUpdateJurusan()
  const deleteJurusan = useDeleteJurusan()

  if (isDetailLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Jurusan"
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/admin/jurusan")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Memuat data jurusan...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!jurusan) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Jurusan"
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/admin/jurusan")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Jurusan tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Jurusan dengan ID {resolvedParams.id} tidak tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusKey = jurusan.is_active ? "active" : "inactive"

  async function handleEditSubmit(formData: typeof EMPTY_JURUSAN_FORM) {
    if (!jurusan) return
    setIsLoading(true)
    try {
      await updateJurusan.mutateAsync({
        id: jurusan.id,
        data: {
          name: formData.name,
          code: formData.code,
          is_active: formData.is_active,
          description: formData.description || null,
        },
      })
      setFormDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!jurusan) return
    setIsLoading(true)
    try {
      await deleteJurusan.mutateAsync(jurusan.id)
      setDeleteDialogOpen(false)
      router.push("/admin/jurusan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Jurusan"
        description={`Informasi lengkap tentang jurusan ${jurusan.name}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/jurusan")}
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
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary font-bold text-2xl mb-4">
                {jurusan.code}
              </div>
              <h2 className="text-lg font-bold">{jurusan.name}</h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-3 ${STATUS_COLORS[statusKey]}`}
              >
                {STATUS_LABELS[statusKey]}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Jurusan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow
                icon={BookOpen}
                label="Nama Jurusan"
                value={jurusan.name}
              />
              <InfoRow
                icon={Hash}
                label="Kode Jurusan"
                value={
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                    {jurusan.code}
                  </span>
                }
              />
              <InfoRow
                icon={ToggleLeft}
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[statusKey]}`}
                  >
                    {STATUS_LABELS[statusKey]}
                  </span>
                }
              />
              <InfoRow
                icon={FileText}
                label="Deskripsi"
                value={
                  <p className="text-sm leading-relaxed">
                    {jurusan.description || "-"}
                  </p>
                }
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuat"
                value={formatDate(jurusan.created_at)}
              />
              <InfoRow
                icon={Clock}
                label="Terakhir Diperbarui"
                value={formatDate(jurusan.updated_at)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <JurusanFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingJurusan={jurusan}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      <JurusanDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        jurusan={jurusan}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
