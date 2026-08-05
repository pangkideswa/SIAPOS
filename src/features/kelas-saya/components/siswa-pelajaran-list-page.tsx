"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  ArrowRight,
  Users,
} from "lucide-react"
import { useClassroom } from "@/hooks/use-classroom"

export function SiswaPelajaranListPage() {
  const { user } = useAuth()
  const router = useRouter()

  const classroom = useClassroom()
  const siswa = classroom.getSiswaByNama(user?.name ?? "")
  const pelajaran = siswa ? classroom.getKelasByRombel(siswa.kelas) : []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pelajaran"
        description={
          siswa
            ? `Mata pelajaran yang Anda ikuti di kelas ${siswa.kelas}.`
            : "Daftar mata pelajaran yang Anda ikuti."
        }
      />

      {!siswa || pelajaran.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Belum Ada Pelajaran</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Data kelas belum ditemukan untuk akun Anda. Hubungi admin sekolah
              untuk informasi lebih lanjut.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pelajaran.map((kelas) => {
            const jumlahSiswa = classroom.getAnggotaKelas(kelas.kelas).length
            const jumlahMateri = classroom.getKelasMateri(kelas.id).length
            const jumlahTugas = classroom.getKelasTugas(kelas.id).length
            return (
              <Card
                key={kelas.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:ring-primary/40"
                onClick={() => router.push(`/siswa/kelas/${kelas.id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-primary to-orange-500 rounded-t-xl" />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold leading-tight">
                            {kelas.mata_pelajaran}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {kelas.guru_nama}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{kelas.kelas}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Semester {kelas.semester} · Tahun Ajaran{" "}
                      {kelas.tahun_ajaran}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="rounded-lg bg-muted/50 px-2 py-2 text-center">
                        <Users className="mx-auto h-4 w-4 text-primary mb-1" />
                        <p className="text-sm font-semibold">{jumlahSiswa}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Siswa
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-2 py-2 text-center">
                        <BookOpen className="mx-auto h-4 w-4 text-orange-500 mb-1" />
                        <p className="text-sm font-semibold">{jumlahMateri}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Materi
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-2 py-2 text-center">
                        <ClipboardList className="mx-auto h-4 w-4 text-green-600 mb-1" />
                        <p className="text-sm font-semibold">{jumlahTugas}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Tugas
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => router.push(`/siswa/kelas/${kelas.id}`)}
                    >
                      Buka Kelas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
