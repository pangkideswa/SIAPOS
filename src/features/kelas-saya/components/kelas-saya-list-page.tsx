"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  ArrowRight,
  GraduationCap,
  Calendar,
} from "lucide-react"
import {
  getAnggotaKelas,
  getKelasJadwal,
  getKelasMateri,
  getKelasSayaByGuru,
  getKelasTugas,
} from "@/features/kelas-saya/lib/kelas-saya-helpers"

export function KelasSayaListPage() {
  const { user } = useAuth()
  const router = useRouter()

  const kelasList = getKelasSayaByGuru(user?.name ?? "")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelas Saya"
        description="Daftar kelas yang Anda ampu pada tahun ajaran berjalan."
      />

      {kelasList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Belum Ada Kelas</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Anda belum memiliki kelas mengajar yang aktif pada tahun ajaran
              ini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kelasList.map((kelas) => {
            const jumlahSiswa = getAnggotaKelas(kelas.kelas).length
            const jumlahMateri = getKelasMateri(kelas.id).length
            const jumlahTugas = getKelasTugas(kelas.id).length
            const jadwalList = getKelasJadwal(kelas.kelas)
            const jadwalStr = jadwalList.length > 0
              ? `${jadwalList[0].hari} ${jadwalList[0].waktu_mulai}-${jadwalList[0].waktu_selesai}`
              : "Belum ada jadwal"
            return (
              <Card
                key={kelas.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:ring-primary/40"
                onClick={() => router.push(`/guru/kelas/${kelas.id}`)}
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

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{jadwalStr}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {jumlahSiswa} siswa
                        </span>
                        <span>·</span>
                        <span>{jumlahMateri} materi</span>
                        <span>·</span>
                        <span>{jumlahTugas} tugas</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-[10px]">
                        {kelas.status}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => router.push(`/guru/kelas/${kelas.id}`)}
                    >
                      Masuk Kelas
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
