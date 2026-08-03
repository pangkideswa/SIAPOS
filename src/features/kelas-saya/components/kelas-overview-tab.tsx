"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Users,
  BookOpen,
  ClipboardList,
  Send,
  GraduationCap,
  CalendarDays,
  Megaphone,
  Activity,
  Pin,
  PinOff,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react"
import { toast } from "sonner"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Pengumuman } from "@/features/pengumuman/types/pengumuman"
import { PengumumanFormDialog } from "@/features/pengumuman/components/pengumuman-form-dialog"
import { STATUS_PENGUMUMAN_COLORS } from "@/features/pengumuman/constants/pengumuman.constants"
import { DUMMY_PENGUMUMAN } from "@/features/pengumuman/dummy/pengumuman.data"
import { getPengumumanTargetRoles } from "@/features/pengumuman/lib/pengumuman-helpers"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import {
  getAnggotaKelas,
  getKelasAktivitas,
  getKelasJadwal,
  getKelasMateri,
  getKelasPengumumanAll,
  getKelasTugas,
  getTugasPengumpulan,
  formatTanggalPendek,
} from "@/features/kelas-saya/lib/kelas-saya-helpers"

interface KelasOverviewTabProps {
  kelasMengajar: KelasMengajar
}

const HARI_URUTAN = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
]

export function KelasOverviewTab({ kelasMengajar }: KelasOverviewTabProps) {
  const siswa = getAnggotaKelas(kelasMengajar.kelas)
  const materi = getKelasMateri(kelasMengajar.id)
  const tugas = getKelasTugas(kelasMengajar.id)
  const jadwal = getKelasJadwal(kelasMengajar.kelas)
  const aktivitas = getKelasAktivitas(kelasMengajar.id)
  const [, setVersion] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Pengumuman | null>(null)
  const [pengumumanSearch, setPengumumanSearch] = useState("")

  const pengumumanAll = getKelasPengumumanAll(kelasMengajar.kelas).filter(
    (p) =>
      !pengumumanSearch ||
      p.judul.toLowerCase().includes(pengumumanSearch.toLowerCase()) ||
      p.ringkasan.toLowerCase().includes(pengumumanSearch.toLowerCase())
  )

  function handleSave(data: Pengumuman) {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === data.id)
    if (idx !== -1) {
      DUMMY_PENGUMUMAN[idx] = { ...data }
    } else {
      DUMMY_PENGUMUMAN.unshift(data)
    }
    if (data.status === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "pengumuman",
        judul: `Pengumuman Kelas: ${data.judul}`,
        pesan: `Pengumuman baru di kelas ${kelasMengajar.mata_pelajaran} — ${kelasMengajar.kelas}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: getPengumumanTargetRoles(data.target),
      })
    }
    setVersion((v) => v + 1)
    setFormOpen(false)
    setEditingItem(null)
    toast.success(
      idx !== -1 ? "Pengumuman berhasil diperbarui" : "Pengumuman berhasil dibuat"
    )
  }

  function togglePin(item: Pengumuman) {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === item.id)
    if (idx !== -1) {
      DUMMY_PENGUMUMAN[idx] = {
        ...DUMMY_PENGUMUMAN[idx],
        pinned: !DUMMY_PENGUMUMAN[idx].pinned,
        updated_at: new Date().toISOString(),
      }
    }
    setVersion((v) => v + 1)
    toast.success(item.pinned ? "Pengumuman dilepas dari pin" : "Pengumuman dipin")
  }

  function confirmDelete() {
    if (!deletingItem) return
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === deletingItem.id)
    if (idx !== -1) DUMMY_PENGUMUMAN.splice(idx, 1)
    setVersion((v) => v + 1)
    setDeleteOpen(false)
    setDeletingItem(null)
    toast.success("Pengumuman berhasil dihapus")
  }

  const sudahMengumpulkan = tugas.reduce(
    (total, t) =>
      total +
      getTugasPengumpulan(t.id).filter(
        (p) => p.status !== "Belum Mengumpulkan"
      ).length,
    0
  )

  const jadwalTersortir = [...jadwal].sort(
    (a, b) =>
      HARI_URUTAN.indexOf(a.hari) - HARI_URUTAN.indexOf(b.hari) ||
      a.waktu_mulai.localeCompare(b.waktu_mulai)
  )

  return (
    <div className="space-y-5">
      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Siswa",
            value: siswa.length,
            icon: Users,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Materi",
            value: materi.length,
            icon: BookOpen,
            color: "text-orange-500 bg-orange-500/10",
          },
          {
            label: "Tugas",
            value: tugas.length,
            icon: ClipboardList,
            color: "text-green-600 bg-green-600/10",
          },
          {
            label: "Pengumpulan",
            value: sudahMengumpulkan,
            icon: Send,
            color: "text-purple-600 bg-purple-600/10",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Informasi Kelas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Informasi Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">
                  Mata Pelajaran
                </p>
                <p className="font-medium mt-0.5">
                  {kelasMengajar.mata_pelajaran}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="font-medium mt-0.5">{kelasMengajar.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru Pengampu</p>
                <p className="font-medium mt-0.5">{kelasMengajar.guru_nama}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jumlah Siswa</p>
                <p className="font-medium mt-0.5">{siswa.length} siswa</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="font-medium mt-0.5">
                  {kelasMengajar.semester}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Tahun Ajaran
                </p>
                <p className="font-medium mt-0.5">
                  {kelasMengajar.tahun_ajaran}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jadwal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Jadwal {kelasMengajar.kelas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jadwalTersortir.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Tidak ada jadwal
              </p>
            ) : (
              <div className="space-y-2">
                {jadwalTersortir.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 rounded-md bg-primary/10 py-1">
                        <span className="text-[10px] font-semibold text-primary uppercase">
                          {j.hari.slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {j.mata_pelajaran}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {j.waktu_mulai} - {j.waktu_selesai}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pengumuman */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-orange-500" />
              Pengumuman Kelas
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingItem(null)
                setFormOpen(true)
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Buat Pengumuman
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-sm mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengumuman..."
                value={pengumumanSearch}
                onChange={(e) => setPengumumanSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {pengumumanAll.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                {pengumumanSearch
                  ? "Pengumuman tidak ditemukan."
                  : "Belum ada pengumuman untuk kelas ini."}
              </p>
            ) : (
              <div className="space-y-2">
                {pengumumanAll.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.pinned && (
                            <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <p className="text-sm font-medium line-clamp-1">
                            {p.judul}
                          </p>
                          <Badge
                            className={
                              STATUS_PENGUMUMAN_COLORS[p.status] ?? ""
                            }
                          >
                            {p.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {p.ringkasan}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatTanggalPendek(p.tanggal_publish)} · {p.penulis}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title={p.pinned ? "Lepas Pin" : "Pin"}
                          onClick={() => togglePin(p)}
                        >
                          {p.pinned ? (
                            <PinOff className="h-4 w-4 text-primary" />
                          ) : (
                            <Pin className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Edit"
                          onClick={() => {
                            setEditingItem(p)
                            setFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Hapus"
                          onClick={() => {
                            setDeletingItem(p)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aktivitas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aktivitas.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada aktivitas
              </p>
            ) : (
              <div className="space-y-1">
                {aktivitas.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted shrink-0">
                      {a.tipe === "materi" && (
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                      )}
                      {a.tipe === "tugas" && (
                        <ClipboardList className="h-3.5 w-3.5 text-orange-500" />
                      )}
                      {a.tipe === "pengumpulan" && (
                        <Send className="h-3.5 w-3.5 text-green-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm line-clamp-1">{a.pesan}</p>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        {formatTanggalPendek(a.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PengumumanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editingItem}
        onSave={handleSave}
        teacherMode
        allowedKelas={[kelasMengajar.kelas]}
        defaultTarget="Kelas Tertentu"
        defaultKelas={kelasMengajar.kelas}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pengumuman"
        description={`Apakah Anda yakin ingin menghapus pengumuman "${deletingItem?.judul}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
