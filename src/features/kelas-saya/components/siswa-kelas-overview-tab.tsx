"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Award,
  GraduationCap,
  CalendarDays,
  Megaphone,
  Pin,
  Clock,
} from "lucide-react"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Siswa } from "@/features/siswa/types/siswa"
import { formatTanggalPendek } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { useClassroom } from "@/hooks/use-classroom"

interface SiswaKelasOverviewTabProps {
  kelasMengajar: KelasMengajar
  siswa: Siswa
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

export function SiswaKelasOverviewTab({
  kelasMengajar,
  siswa,
}: SiswaKelasOverviewTabProps) {
  const classroom = useClassroom()
  const materi = classroom.getKelasMateri(kelasMengajar.id).filter(
    (m) => m.status === "Publish"
  )
  const tugas = classroom.getKelasTugas(kelasMengajar.id).filter(
    (t) => t.status === "Dipublikasikan"
  )
  const pengumuman = classroom.getKelasPengumuman(kelasMengajar.kelas)

  const mySubmissions = tugas.map((t) =>
    classroom.getTugasPengumpulan(t.id).find((p) => p.siswa_id === siswa.id)
  )
  const selesai = mySubmissions.filter(
    (p) => p && p.status !== "Belum Mengumpulkan"
  ).length
  const nilaiTerkumpul = mySubmissions
    .filter((p) => p && p.nilai !== null)
    .map((p) => p!.nilai as number)
  const rataRata =
    nilaiTerkumpul.length > 0
      ? Math.round(
          (nilaiTerkumpul.reduce((a, b) => a + b, 0) /
            nilaiTerkumpul.length) *
            10
        ) / 10
      : null

  const jadwal = classroom.getKelasJadwal(siswa.kelas).sort(
    (a, b) =>
      HARI_URUTAN.indexOf(a.hari) - HARI_URUTAN.indexOf(b.hari) ||
      a.waktu_mulai.localeCompare(b.waktu_mulai)
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Materi Tersedia",
            value: materi.length,
            icon: BookOpen,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Tugas Aktif",
            value: tugas.length,
            icon: ClipboardList,
            color: "text-orange-500 bg-orange-500/10",
          },
          {
            label: "Tugas Selesai",
            value: selesai,
            icon: CheckCircle2,
            color: "text-green-600 bg-green-600/10",
          },
          {
            label: "Rata-rata Nilai",
            value: rataRata ?? "-",
            icon: Award,
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
              Informasi Pelajaran
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
                <p className="font-medium mt-0.5">
                  {kelasMengajar.guru_nama}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="font-medium mt-0.5">
                  {kelasMengajar.semester}
                </p>
              </div>
              <div className="col-span-2">
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
              Jadwal {siswa.kelas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jadwal.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Tidak ada jadwal
              </p>
            ) : (
              <div className="space-y-2">
                {jadwal.map((j) => (
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
                          {j.guru_nama} · {j.waktu_mulai} - {j.waktu_selesai}
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
              <Megaphone className="h-4 w-4 text-orange-500" />
              Pengumuman Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pengumuman.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada pengumuman
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pengumuman.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href="/siswa/pengumuman"
                    className="block rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {p.pinned && (
                        <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <p className="text-sm font-medium line-clamp-1">
                        {p.judul}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {p.ringkasan}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTanggalPendek(p.tanggal_publish)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
