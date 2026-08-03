"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  Phone,
  Home,
} from "lucide-react"
import { SiswaFormDialog } from "./siswa-form-dialog"
import { SiswaDeleteDialog } from "./siswa-delete-dialog"
import { STATUS_SISWA_COLORS } from "@/features/siswa/constants/siswa.constants"
import { DUMMY_SISWA } from "@/features/siswa/dummy/siswa.data"
import type { SiswaFormData } from "@/features/siswa/types/siswa"

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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

export function SiswaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const siswa = DUMMY_SISWA.find((s) => s.id === Number(resolvedParams.id))

  if (!siswa) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Siswa"
          action={
            <Button variant="outline" onClick={() => router.push("/admin/siswa")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Siswa tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Data siswa dengan ID {resolvedParams.id} tidak tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  async function handleEditSubmit(formData: SiswaFormData) {
    if (!siswa) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const idx = DUMMY_SISWA.findIndex((s) => s.id === siswa.id)
      if (idx !== -1) {
        DUMMY_SISWA[idx] = {
          ...DUMMY_SISWA[idx],
          ...formData,
          updated_at: new Date().toISOString(),
        }
      }
      setFormDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!siswa) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const idx = DUMMY_SISWA.findIndex((s) => s.id === siswa.id)
      if (idx !== -1) DUMMY_SISWA.splice(idx, 1)
      setDeleteDialogOpen(false)
      router.push("/admin/siswa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Siswa"
        description={`Informasi lengkap tentang ${siswa.nama_lengkap}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/siswa")}
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
                <AvatarImage src={siswa.foto ?? undefined} alt={siswa.nama_lengkap} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {getInitials(siswa.nama_lengkap)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{siswa.nama_lengkap}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                NIS: {siswa.nis} | NISN: {siswa.nisn}
              </p>
              <div className="flex gap-2 mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_SISWA_COLORS[siswa.status]}`}
                >
                  {siswa.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {siswa.jenis_kelamin}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                <Badge variant="secondary" className="text-[10px]">
                  {siswa.kelas}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {siswa.jurusan_nama ?? "Tanpa Jurusan"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identitas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identitas Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <InfoRow icon={User} label="Nama Lengkap" value={siswa.nama_lengkap} />
                <InfoRow icon={CreditCard} label="NIS" value={siswa.nis} />
                <InfoRow icon={CreditCard} label="NISN" value={siswa.nisn} />
                <InfoRow icon={User} label="Jenis Kelamin" value={siswa.jenis_kelamin} />
                <InfoRow
                  icon={MapPin}
                  label="Tempat, Tanggal Lahir"
                  value={`${siswa.tempat_lahir}, ${formatShortDate(siswa.tanggal_lahir)} (${calculateAge(siswa.tanggal_lahir)})`}
                />
                <InfoRow icon={BookOpen} label="Agama" value={siswa.agama} />
                <InfoRow
                  icon={MapPin}
                  label="Alamat"
                  value={<p className="text-sm leading-relaxed">{siswa.alamat || "-"}</p>}
                />
              </div>
            </CardContent>
          </Card>

          {/* Akademik */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Akademik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <InfoRow
                  icon={GraduationCap}
                  label="Jurusan"
                  value={siswa.jurusan_nama ?? "-"}
                />
                <InfoRow icon={BookOpen} label="Kelas" value={siswa.kelas} />
                <InfoRow icon={Calendar} label="Tahun Masuk" value={siswa.tahun_masuk} />
                <InfoRow icon={Calendar} label="Tahun Ajaran" value={siswa.tahun_ajaran} />
                <InfoRow
                  icon={User}
                  label="Status"
                  value={
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_SISWA_COLORS[siswa.status]}`}
                    >
                      {siswa.status}
                    </span>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Orang Tua */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Orang Tua</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <InfoRow icon={Users} label="Nama Ayah" value={siswa.nama_ayah} />
                <InfoRow icon={Users} label="Nama Ibu" value={siswa.nama_ibu} />
                <InfoRow icon={Phone} label="No. HP Orang Tua" value={siswa.no_hp_ortu ?? "-"} />
                <InfoRow
                  icon={Home}
                  label="Alamat Orang Tua"
                  value={<p className="text-sm leading-relaxed">{siswa.alamat_ortu || "-"}</p>}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="pt-6">
              <div className="divide-y divide-border">
                <InfoRow
                  icon={Calendar}
                  label="Tanggal Dibuat"
                  value={formatDate(siswa.created_at)}
                />
                <InfoRow
                  icon={Clock}
                  label="Terakhir Diperbarui"
                  value={formatDate(siswa.updated_at)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SiswaFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingSiswa={siswa}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      <SiswaDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        siswa={siswa}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
