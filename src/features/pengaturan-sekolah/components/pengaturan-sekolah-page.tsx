"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/ui/page-header"
import {
  JENJANG_OPTIONS,
  STATUS_SEKOLAH_OPTIONS,
  AKREDITASI_OPTIONS,
  SEMESTER_OPTIONS,
  BAHASA_OPTIONS,
  ZONA_WAKTU_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
} from "@/features/pengaturan-sekolah/constants/pengaturan-sekolah.constants"
import { useSettings } from "@/contexts/settings-context"
import type { SekolahFormData } from "@/features/pengaturan-sekolah/types/pengaturan-sekolah"
import {
  School,
  Phone,
  Image,
  CalendarDays,
  MonitorCog,
  Share2,
  Save,
  Loader2,
  Upload,
  X,
} from "lucide-react"

function ImageUpload({
  label,
  currentImage,
  onUpload,
  onRemove,
  aspect = "aspect-square",
  sizeClass = "w-32 h-32",
}: {
  label: string
  currentImage: string
  onUpload: (dataUrl: string) => void
  onRemove: () => void
  aspect?: string
  sizeClass?: string
}) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      onUpload(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  if (currentImage) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="relative inline-block">
          <div className={`${sizeClass} ${aspect} overflow-hidden rounded-lg border border-border bg-muted`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={label}
            className="w-full h-full object-contain"
          />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <label className={`flex flex-col items-center justify-center ${sizeClass} ${aspect} rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/50 hover:bg-muted`}>
        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
        <span className="text-xs text-muted-foreground">Pilih gambar</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function PengaturanSekolahPage() {
  const { settings: initialSettings, refreshSettings } = useSettings()
  const [form, setForm] = useState<SekolahFormData>(() => structuredClone(initialSettings))
  const [isSaving, setIsSaving] = useState(false)

  function handleGroupChange<K extends keyof SekolahFormData>(
    group: K,
    field: keyof SekolahFormData[K],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }))
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      
      if (!response.ok) {
        throw new Error('Gagal menyimpan pengaturan')
      }
      
      await refreshSettings()
      alert('Pengaturan berhasil disimpan!')
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sekolah"
        description="Konfigurasi data sekolah, logo, tahun akademik, dan pengaturan sistem"
        action={
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
            Simpan Pengaturan
          </Button>
        }
      />

      {/* SECTION 1: Informasi Sekolah */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={School}
            title="Informasi Sekolah"
            description="Data identitas dan profil sekolah"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_sekolah">Nama Sekolah *</Label>
            <Input
              id="nama_sekolah"
              value={form.informasi_sekolah.nama_sekolah}
              onChange={(e) => handleGroupChange("informasi_sekolah", "nama_sekolah", e.target.value)}
              placeholder="Contoh: SMK Wahana Bakti"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="npsn">NPSN *</Label>
              <Input
                id="npsn"
                value={form.informasi_sekolah.npsn}
                onChange={(e) => handleGroupChange("informasi_sekolah", "npsn", e.target.value)}
                placeholder="20228917"
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nss">NSS (Opsional)</Label>
              <Input
                id="nss"
                value={form.informasi_sekolah.nss}
                onChange={(e) => handleGroupChange("informasi_sekolah", "nss", e.target.value)}
                placeholder="5225615"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Jenjang *</Label>
              <Select
                value={form.informasi_sekolah.jenjang}
                onValueChange={(v) => v && handleGroupChange("informasi_sekolah", "jenjang", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JENJANG_OPTIONS.map((j) => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Sekolah *</Label>
              <Select
                value={form.informasi_sekolah.status_sekolah}
                onValueChange={(v) => v && handleGroupChange("informasi_sekolah", "status_sekolah", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_SEKOLAH_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Akreditasi *</Label>
              <Select
                value={form.informasi_sekolah.akreditasi}
                onValueChange={(v) => v && handleGroupChange("informasi_sekolah", "akreditasi", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AKREDITASI_OPTIONS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Kontak */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={Phone}
            title="Kontak"
            description="Informasi kontak dan alamat sekolah"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_sekolah">Email *</Label>
              <Input
                id="email_sekolah"
                type="email"
                value={form.kontak.email}
                onChange={(e) => handleGroupChange("kontak", "email", e.target.value)}
                placeholder="info@smkwahanabakti.sch.id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_telepon">Nomor Telepon</Label>
              <Input
                id="no_telepon"
                value={form.kontak.no_telepon}
                onChange={(e) => handleGroupChange("kontak", "no_telepon", e.target.value)}
                placeholder="021-56789012"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.kontak.website}
              onChange={(e) => handleGroupChange("kontak", "website", e.target.value)}
              placeholder="https://smkwahanabakti.sch.id"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat_lengkap">Alamat Lengkap *</Label>
            <Textarea
              id="alamat_lengkap"
              value={form.kontak.alamat_lengkap}
              onChange={(e) => handleGroupChange("kontak", "alamat_lengkap", e.target.value)}
              placeholder="Jl. Raya Bogor Km. 23, No. 45, Kecamatan Ciracas, Jakarta Timur 13740, DKI Jakarta"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Logo */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={Image}
            title="Logo"
            description="Upload logo sekolah, logo SIAPOS, dan favicon"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ImageUpload
              label="Logo Sekolah"
              currentImage={form.logo.logo_sekolah}
              onUpload={(dataUrl) => handleGroupChange("logo", "logo_sekolah", dataUrl)}
              onRemove={() => handleGroupChange("logo", "logo_sekolah", "")}
              sizeClass="w-32 h-32"
            />

            <ImageUpload
              label="Favicon"
              currentImage={form.logo.favicon}
              onUpload={(dataUrl) => handleGroupChange("logo", "favicon", dataUrl)}
              onRemove={() => handleGroupChange("logo", "favicon", "")}
              sizeClass="w-16 h-16"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Format: PNG, JPG, atau SVG. Ukuran maksimal 2MB.
          </p>
        </CardContent>
      </Card>

      {/* SECTION 4: Tahun Akademik */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={CalendarDays}
            title="Tahun Akademik"
            description="Pengaturan tahun ajaran dan semester aktif"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tahun Ajaran Aktif *</Label>
              <Select
                value={form.tahun_akademik.tahun_ajaran_aktif}
                onValueChange={(v) => v && handleGroupChange("tahun_akademik", "tahun_ajaran_aktif", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAHUN_AJARAN_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester Aktif *</Label>
              <Select
                value={form.tahun_akademik.semester_aktif}
                onValueChange={(v) => v && handleGroupChange("tahun_akademik", "semester_aktif", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: Pengaturan Sistem */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={MonitorCog}
            title="Pengaturan Sistem"
            description="Konfigurasi aplikasi dan zona waktu"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama_aplikasi">Nama Aplikasi *</Label>
              <Input
                id="nama_aplikasi"
                value={form.pengaturan_sistem.nama_aplikasi}
                onChange={(e) => handleGroupChange("pengaturan_sistem", "nama_aplikasi", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bahasa *</Label>
              <Select
                value={form.pengaturan_sistem.bahasa}
                onValueChange={(v) => v && handleGroupChange("pengaturan_sistem", "bahasa", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAHASA_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona Waktu *</Label>
              <Select
                value={form.pengaturan_sistem.zona_waktu}
                onValueChange={(v) => v && handleGroupChange("pengaturan_sistem", "zona_waktu", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONA_WAKTU_OPTIONS.map((z) => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: Sosial Media */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={Share2}
            title="Sosial Media"
            description="Tautan media sosial sekolah"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={form.sosial_media.facebook}
              onChange={(e) => handleGroupChange("sosial_media", "facebook", e.target.value)}
              placeholder="https://facebook.com/smkwahanabakti"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={form.sosial_media.instagram}
              onChange={(e) => handleGroupChange("sosial_media", "instagram", e.target.value)}
              placeholder="https://instagram.com/smkwahanabakti"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={form.sosial_media.youtube}
              onChange={(e) => handleGroupChange("sosial_media", "youtube", e.target.value)}
              placeholder="https://youtube.com/@smkwahanabakti"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Bottom save bar */}
      <div className="flex justify-end pb-6">
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
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  )
}
