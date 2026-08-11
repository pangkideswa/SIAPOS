"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  BookOpen,
  GraduationCap,
  Briefcase,
  User,
} from "lucide-react"
import { GuruFormDialog } from "./guru-form-dialog"
import { GuruDeleteDialog } from "./guru-delete-dialog"
import {
  STATUS_KEPEGAWAIAN_COLORS,
} from "@/features/guru/constants/guru.constants"
import { useTeacher, useUpdateTeacher, useRemoveTeacher } from "@/hooks/use-teachers"
import type { GuruFormData } from "@/features/guru/types/guru"
import { getInitials } from "@/lib/utils"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function calculateAge(dateStr: string): string {
  const birth = new Date(dateStr)
  const today = new Date()
  let years = today.getFullYear() - birth.getFullYear()
  const months = today.getMonth() - birth.getMonth()
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--
  }
  return `${years} tahun`
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

export function GuruDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: guru,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useTeacher(Number(resolvedParams.id))
  const updateTeacher = useUpdateTeacher()
  const removeTeacher = useRemoveTeacher()

  async function handleEditSubmit(formData: GuruFormData) {
    if (!guru) return
    setIsLoading(true)
    try {
      await updateTeacher.mutateAsync({ id: guru.id, data: formData })
      setFormDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!guru) return
    setIsLoading(true)
    try {
      await removeTeacher.mutateAsync(guru.id)
      setDeleteDialogOpen(false)
      router.push("/admin/guru")
    } finally {
      setIsLoading(false)
    }
  }

  if (isDetailLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Guru"
          action={
            <Button variant="outline" onClick={() => router.push("/admin/guru")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Memuat data guru...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !guru) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Guru"
          action={
            <Button variant="outline" onClick={() => router.push("/admin/guru")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {isError ? "Gagal memuat data guru" : "Guru tidak ditemukan"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isError
                ? "Terjadi kesalahan saat memuat data guru."
                : `Data guru dengan ID ${resolvedParams.id} tidak tersedia.`}
            </p>
            {isError && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => refetch()}
              >
                Muat Ulang
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Guru"
        description={`Informasi lengkap tentang ${guru.nama_lengkap}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/guru")}
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
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {getInitials(guru.nama_lengkap)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{guru.nama_lengkap}</h2>
              <p className="text-sm text-muted-foreground mt-1">NIP: {guru.nip}</p>
              <div className="flex gap-2 mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_KEPEGAWAIAN_COLORS[guru.status_kepegawaian]}`}
                >
                  {guru.status_kepegawaian}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {guru.jenis_kelamin === "Laki-laki" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {guru.mata_pelajaran.map((mp) => (
                  <Badge key={mp} variant="secondary" className="text-[10px]">
                    {mp}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow
                icon={User}
                label="Nama Lengkap"
                value={guru.nama_lengkap}
              />
              <InfoRow icon={CreditCard} label="NIP" value={guru.nip} />
              <InfoRow
                icon={CreditCard}
                label="NUPTK"
                value={guru.nuptk ?? "-"}
              />
              <InfoRow
                icon={User}
                label="Jenis Kelamin"
                value={guru.jenis_kelamin}
              />
              <InfoRow
                icon={MapPin}
                label="Tempat, Tanggal Lahir"
                value={`${guru.tempat_lahir}, ${formatShortDate(guru.tanggal_lahir)} (${calculateAge(guru.tanggal_lahir)})`}
              />
              <InfoRow
                icon={Phone}
                label="No. HP"
                value={guru.no_hp ?? "-"}
              />
              <InfoRow icon={Mail} label="Email" value={guru.email} />
              <InfoRow
                icon={MapPin}
                label="Alamat"
                value={
                  <p className="text-sm leading-relaxed">
                    {guru.alamat || "-"}
                  </p>
                }
              />
              <Separator />
              <InfoRow
                icon={GraduationCap}
                label="Pendidikan Terakhir"
                value={guru.pendidikan_terakhir}
              />
              <InfoRow
                icon={Briefcase}
                label="Status Kepegawaian"
                value={
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_KEPEGAWAIAN_COLORS[guru.status_kepegawaian]}`}
                  >
                    {guru.status_kepegawaian}
                  </span>
                }
              />
              <InfoRow
                icon={BookOpen}
                label="Mata Pelajaran"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {guru.mata_pelajaran.map((mp) => (
                      <Badge
                        key={mp}
                        variant="secondary"
                        className="text-xs"
                      >
                        {mp}
                      </Badge>
                    ))}
                  </div>
                }
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuat"
                value={formatDate(guru.created_at)}
              />
              <InfoRow
                icon={Clock}
                label="Terakhir Diperbarui"
                value={formatDate(guru.updated_at)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <GuruFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingGuru={guru}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      <GuruDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        guru={guru}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
