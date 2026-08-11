"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  Loader2,
  Hash,
} from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/client-api"
import { getInitials } from "@/lib/utils"

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    guru: "Guru",
    siswa: "Siswa",
    wali: "Wali Kelas",
  }
  return labels[role] ?? role
}

interface ProfileData {
  nama: string
  email: string
  nipNisn: string
  noHp: string
  alamat: string
  tanggalLahir: string
  jenisKelamin: string
}

export function ProfilPage() {
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    nama: user?.name ?? "",
    email: user?.email ?? "",
    nipNisn: user?.nip ?? user?.nisn ?? "",
    noHp: "",
    alamat: "",
    tanggalLahir: "",
    jenisKelamin: "",
  })

  async function handleSave() {
    setIsSaving(true)
    try {
      const body: Record<string, string> = {
        name: profileData.nama,
        email: profileData.email,
      }
      if (user?.role === "guru") {
        body.nip = profileData.nipNisn
      } else if (user?.role === "siswa") {
        body.nisn = profileData.nipNisn
      }
      await apiFetch("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      setEditOpen(false)
      toast.success("Profil berhasil diperbarui")
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      toast.error(apiErr.message ?? "Gagal memperbarui profil")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola informasi profil Anda.
          </p>
        </div>
        <Button onClick={() => setEditOpen(true)} className="bg-primary hover:bg-primary/90">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profil
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center py-8 space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {user?.name ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{profileData.nama}</h2>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <Badge className="mt-2 bg-primary/10 text-primary">
                {getRoleLabel(user?.role ?? "")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Nama Lengkap
                </Label>
                <p className="text-sm font-medium">{profileData.nama || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Label>
                <p className="text-sm font-medium">{profileData.email || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" />
                  {user?.role === "guru" ? "NIP" : "NISN/NIS"}
                </Label>
                <p className="text-sm font-medium">{profileData.nipNisn || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  Nomor HP
                </Label>
                <p className="text-sm font-medium">{profileData.noHp || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Tanggal Lahir
                </Label>
                <p className="text-sm font-medium">{profileData.tanggalLahir || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Jenis Kelamin
                </Label>
                <p className="text-sm font-medium">{profileData.jenisKelamin || "-"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Alamat
              </Label>
              <p className="text-sm font-medium">{profileData.alamat || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResponsiveDialog open={editOpen} onOpenChange={setEditOpen}>
        <ResponsiveDialogContent showCloseButton>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Edit Profil</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nama">Nama Lengkap</Label>
                <Input
                  id="edit-nama"
                  value={profileData.nama}
                  onChange={(e) =>
                    setProfileData({ ...profileData, nama: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nipnisn">
                  {user?.role === "guru" ? "NIP" : "NISN/NIS"}
                </Label>
                <Input
                  id="edit-nipnisn"
                  value={profileData.nipNisn}
                  onChange={(e) =>
                    setProfileData({ ...profileData, nipNisn: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nohp">Nomor HP</Label>
                <Input
                  id="edit-nohp"
                  value={profileData.noHp}
                  onChange={(e) =>
                    setProfileData({ ...profileData, noHp: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tanggallahir">Tanggal Lahir</Label>
                <Input
                  id="edit-tanggallahir"
                  type="date"
                  value={profileData.tanggalLahir}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      tanggalLahir: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-jeniskelamin">Jenis Kelamin</Label>
                <Input
                  id="edit-jeniskelamin"
                  value={profileData.jenisKelamin}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      jenisKelamin: e.target.value,
                    })
                  }
                  placeholder="Laki-laki / Perempuan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-alamat">Alamat</Label>
                <Textarea
                  id="edit-alamat"
                  value={profileData.alamat}
                  onChange={(e) =>
                    setProfileData({ ...profileData, alamat: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  )
}
