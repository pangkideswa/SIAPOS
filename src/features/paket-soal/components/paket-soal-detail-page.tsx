"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock, FileText, Sparkles, Save, CheckCircle2, AlertCircle, Printer } from "lucide-react"
import { toast } from "sonner"
import {
  STATUS_PAKET_SOAL_COLORS,
} from "../constants/paket-soal.constants"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS,
} from "@/features/bank-soal/constants/bank-soal.constants"
import { distributeProportionalWeights } from "@/lib/cbt-scoring"
import { PaketSoalPrintDialog } from "./paket-soal-print-dialog"

interface PaketSoalDetailPageProps {
  id: string
}

export function PaketSoalDetailPage({ id }: PaketSoalDetailPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname?.startsWith("/guru") ? "/guru" : "/admin"

  const [paket, setPaket] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingWeights, setIsSavingWeights] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isPrintOpen, setIsPrintOpen] = useState(false)

  useEffect(() => {
    async function loadPaket() {
      try {
        const [res, resUser] = await Promise.all([
          fetch(`/api/exams/packages/${id}`),
          fetch("/api/auth/profile"),
        ])
        const [json, jsonUser] = await Promise.all([
          res.json(),
          resUser.json(),
        ])

        if (jsonUser?.data) {
          setCurrentUser(jsonUser.data)
        }

        if (json.data || json.success) {
          const payload = json.data || json
          setPaket(payload)
          setItems(payload.items || [])
        }
      } catch (error) {
        console.error("Gagal memuat paket soal")
        toast.error("Gagal memuat detail paket soal")
      } finally {
        setIsLoading(false)
      }
    }
    loadPaket()
  }, [id])

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center font-medium">Memuat Detail Paket Soal...</div>
  }

  if (!paket) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Paket Soal" description="Paket soal tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push(`${basePath}/paket-soal`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Paket Soal
        </Button>
      </div>
    )
  }

  const isSuperAdminOrAdmin = currentUser?.role === "super_admin" || currentUser?.role === "admin"
  const isCreator = !paket?.guru_id || (currentUser?.teacher_id && paket?.guru_id === currentUser.teacher_id)
  const canEditWeights = isSuperAdminOrAdmin || isCreator

  const totalBobot = items.reduce((sum, it) => sum + (Number(it.bobot) || 0), 0)
  const roundedTotalBobot = Math.round(totalBobot * 100) / 100
  const isPerfectTotal = Math.abs(roundedTotalBobot - 100) < 0.01

  function handleBobotChange(bankSoalId: number, val: number) {
    if (!canEditWeights) return
    setItems((prev) =>
      prev.map((it) => (it.bank_soal_id === bankSoalId ? { ...it, bobot: val } : it))
    )
  }

  function handleAutoDistributeWeights() {
    if (!canEditWeights) return
    if (items.length === 0) return
    const formatted = items.map((it, idx) => ({
      bank_soal_id: it.bank_soal_id,
      tipe_soal: it.bank_soal?.tipe_soal || "PILIHAN_GANDA",
      nomor_urut: it.nomor_urut || idx + 1,
      bank_soal: it.bank_soal,
    }))
    const distributed = distributeProportionalWeights(formatted, 100)
    setItems(distributed)
    toast.success("Bobot soal berhasil dihitung proporsional (Total = 100). Esai memiliki bobot lebih tinggi dari PG.")
  }

  async function handleSaveWeights() {
    if (!canEditWeights) {
      toast.error("Anda tidak memiliki hak akses untuk mengubah bobot paket ini")
      return
    }
    setIsSavingWeights(true)
    try {
      const payloadItems = items.map((it, idx) => ({
        bank_soal_id: it.bank_soal_id,
        bobot: Number(it.bobot) || 0,
        nomor_urut: it.nomor_urut || idx + 1,
      }))

      const res = await fetch(`/api/exams/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      })

      const json = await res.json()
      if (res.ok && (json.success || json.data)) {
        toast.success("Perubahan bobot soal berhasil disimpan ke database!")
      } else {
        toast.error(json.message || "Gagal menyimpan bobot soal")
      }
    } catch (e) {
      toast.error("Terjadi kesalahan jaringan saat menyimpan bobot")
    } finally {
      setIsSavingWeights(false)
    }
  }

  const guruNama = paket.guru?.nama_lengkap || paket.guru_nama || "—"

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={paket.judul}
        description={`${paket.mata_pelajaran} • Guru Pembuat: ${guruNama}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`${basePath}/paket-soal`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrintOpen(true)}
              className="gap-1.5"
              title="Cetak naskah soal fisik atau simpan PDF untuk arsip"
            >
              <Printer className="h-4 w-4 text-primary" />
              Cetak Naskah Soal
            </Button>
            {canEditWeights ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoDistributeWeights}
                  className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
                  title="Hitung otomatis agar total bobot = 100 dengan bobot esai lebih tinggi"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Hitung Bobot Proporsional (100)
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveWeights}
                  disabled={isSavingWeights}
                  className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  {isSavingWeights ? "Menyimpan..." : "Simpan Bobot Soal"}
                </Button>
              </>
            ) : (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 py-1 px-2.5">
                Mode Lihat: Hanya Pembuat & Super Admin yang dapat mengubah bobot
              </Badge>
            )}
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Deskripsi Paket</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {paket.deskripsi || "Tidak ada deskripsi"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Daftar Soal & Bobot ({items.length} Soal)
                </CardTitle>
                <CardDescription className="text-xs">
                  Ubah bobot masing-masing butir soal secara mandiri atau gunakan tombol hitung proporsional.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs font-semibold px-2.5 py-1 ${
                    isPerfectTotal
                      ? "bg-green-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {isPerfectTotal ? (
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5 inline" />
                  ) : (
                    <AlertCircle className="mr-1 h-3.5 w-3.5 inline" />
                  )}
                  Total Bobot: {roundedTotalBobot} / 100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {items.map((item: any, index: number) => {
                const soal = item.bank_soal
                const isEsai =
                  soal?.tipe_soal === "ESAI" ||
                  soal?.tipe_soal === "Essay" ||
                  soal?.tipe_soal === "Isian Singkat"

                return (
                  <div
                    key={soal?.id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 text-foreground">
                          {soal?.pertanyaan || "Pertanyaan"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            className={
                              TIPE_SOAL_COLORS[soal?.tipe_soal] ||
                              (isEsai
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700")
                            }
                          >
                            {soal?.tipe_soal === "PILIHAN_GANDA"
                              ? "Pilihan Ganda"
                              : isEsai
                              ? "Esai / Isian"
                              : soal?.tipe_soal}
                          </Badge>
                          <Badge
                            className={`font-semibold text-xs border ${
                              KESULITAN_COLORS[soal?.kesulitan] ||
                              (String(soal?.kesulitan).toUpperCase() === "MUDAH"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : String(soal?.kesulitan).toUpperCase() === "SEDANG"
                                ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300")
                            }`}
                          >
                            {String(soal?.kesulitan).toUpperCase() === "MUDAH"
                              ? "Mudah"
                              : String(soal?.kesulitan).toUpperCase() === "SEDANG"
                              ? "Sedang"
                              : String(soal?.kesulitan).toUpperCase() === "SULIT"
                              ? "Sulit"
                              : soal?.kesulitan}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Bobot:
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        disabled={!canEditWeights}
                        value={item.bobot ?? 0}
                        onChange={(e) =>
                          handleBobotChange(
                            item.bank_soal_id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 h-9 text-center font-bold text-sm border-2 focus:border-primary disabled:opacity-75"
                        title={canEditWeights ? "Ubah bobot butir soal ini" : "Hanya Super Admin & Guru Pembuat yang dapat mengubah"}
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        poin
                      </span>
                    </div>
                  </div>
                )
              })}

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Tidak ada butir soal dalam paket ini
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Paket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-semibold">{paket.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru Pengampu</p>
                <p className="text-sm font-semibold">{guruNama}</p>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                  <p className="text-sm font-medium">{items.length} butir</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi Pengerjaan</p>
                  <p className="text-sm font-medium">{paket.durasi_menit ?? 60} Menit</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status Publikasi</p>
                <Badge
                  className={`font-semibold text-xs border ${
                    STATUS_PAKET_SOAL_COLORS[paket.status] ||
                    (paket.status === "PUBLISH" || paket.status === "Aktif"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300")
                  }`}
                >
                  {paket.status === "PUBLISH"
                    ? "Aktif / Terbit"
                    : paket.status === "DRAFT"
                    ? "Draft"
                    : paket.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dibuat</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(paket.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaketSoalPrintDialog
        open={isPrintOpen}
        onOpenChange={setIsPrintOpen}
        paket={paket}
        items={items}
      />
    </div>
  )
}
