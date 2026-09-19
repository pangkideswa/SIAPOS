"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Brain, TrendingUp, AlertTriangle } from "lucide-react"
import type { NilaiAkademik } from "../types/nilai-akademik"

interface AIClassAnalyticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NilaiAkademik[]
  mapel: string
  kelas: string
}

export function AIClassAnalyticsDialog({ open, onOpenChange, data, mapel, kelas }: AIClassAnalyticsDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setInsight(null)
      setIsAnalyzing(true)
      fetchClassAnalytics()
    }
  }, [open])

  const fetchClassAnalytics = async () => {
    if (data.length === 0) {
      setInsight("Belum ada data yang cukup untuk dianalisis.")
      setIsAnalyzing(false)
      return
    }

    try {
      const avgUas = Math.round(data.reduce((acc, curr) => acc + (curr.uas || 0), 0) / data.length)
      const avgUts = Math.round(data.reduce((acc, curr) => acc + (curr.uts || 0), 0) / data.length)
      const avgTugas = Math.round(data.reduce((acc, curr) => acc + (curr.tugas || 0), 0) / data.length)
      const avgPraktik = Math.round(data.reduce((acc, curr) => acc + (curr.praktik || 0), 0) / data.length)

      const prompt = `Saya adalah seorang guru. Ini adalah data rata-rata kelas saya: UTS (${avgUts}), UAS (${avgUas}), Tugas (${avgTugas}), Praktik (${avgPraktik}). Tolong buatkan 2-3 paragraf analisis kelas (menggunakan markdown format tebal/miring jika perlu) yang menyoroti tren nilai dan berikan masukan strategis mengajar yang dapat ditindaklanjuti.`

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || "Gagal menghubungi AI")
      }

      setInsight(json.result)
    } catch (error: any) {
      setInsight(`Maaf, gagal memproses analisis: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Class Analytics
          </DialogTitle>
          <DialogDescription>
            Ringkasan kecerdasan buatan mengenai performa kelas berdasarkan data nilai yang ada.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <div className="relative">
                <Brain className="h-12 w-12 text-purple-600/20" />
                <Loader2 className="h-6 w-6 animate-spin text-purple-600 absolute bottom-0 right-0" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">AI sedang menganalisis pola nilai...</p>
                <p className="text-xs text-muted-foreground">Membaca {data.length} baris data nilai akademik</p>
              </div>
            </div>
          ) : insight ? (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {insight}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-3 flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-xs text-green-800 dark:text-green-300">
                    <span className="font-semibold block mb-0.5">Kekuatan Kelas</span>
                    Nilai praktik rata-rata di atas 85.
                  </div>
                </div>
                <div className="flex-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold block mb-0.5">Area Perhatian</span>
                    Tugas individu butuh pengawasan.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          {!isAnalyzing && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => {
              setIsAnalyzing(true)
              fetchClassAnalytics()
            }}>
              <Sparkles className="mr-2 h-4 w-4" />
              Analisis Ulang
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
