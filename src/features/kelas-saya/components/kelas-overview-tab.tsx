"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  ClipboardList,
  Send,
  GraduationCap,
  CalendarDays,
  Activity,
  Clock,
} from "lucide-react"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import {
  getAnggotaKelas,
  getKelasAktivitas,
  getKelasJadwal,
  getKelasMateri,
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
    </div>
  )
}
