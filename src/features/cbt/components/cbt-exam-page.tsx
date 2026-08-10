"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react"
import { DUMMY_CBT } from "../dummy/cbt.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import { DUMMY_BANK_SOAL } from "@/features/bank-soal/dummy/bank-soal.data"
import type { CBTAnswer } from "../types/cbt"
import type { BankSoal } from "@/features/bank-soal/types/bank-soal"

interface CBTExamPageProps {
  id: string
}

export function CBTExamPage({ id }: CBTExamPageProps) {
  const router = useRouter()
  const cbt = DUMMY_CBT.find((c) => c.id === Number(id))
  const paket = cbt ? DUMMY_PAKET_SOAL.find((p) => p.id === cbt.paket_soal_id) : null

  const soalList: BankSoal[] = paket
    ? DUMMY_BANK_SOAL.filter((s) => paket.soal_ids.includes(s.id))
    : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<CBTAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(cbt ? cbt.durasi * 60 : 0)
  const [isFinished, setIsFinished] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      if (cbt?.auto_submit) {
        setIsFinished(true)
      }
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (cbt?.auto_submit) setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const currentSoal = soalList[currentIndex]
  const progress = soalList.length > 0 ? ((currentIndex + 1) / soalList.length) * 100 : 0

  const answeredCount = answers.length
  const bookmarkedIds = answers.filter((a) => a.ditandai).map((a) => a.soal_id)

  const handleAnswer = useCallback((jawaban: string) => {
    if (!currentSoal) return
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal.id)
      if (existing) {
        return prev.map((a) => a.soal_id === currentSoal.id ? { ...a, jawaban } : a)
      }
      return [...prev, { soal_id: currentSoal.id, jawaban, ditandai: false }]
    })
  }, [currentSoal])

  function handleBookmark() {
    if (!currentSoal) return
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal.id)
      if (existing) {
        return prev.map((a) => a.soal_id === currentSoal.id ? { ...a, ditandai: !a.ditandai } : a)
      }
      return [...prev, { soal_id: currentSoal.id, jawaban: "", ditandai: true }]
    })
  }

  function handleFinish() {
    setShowFinishDialog(false)
    setIsFinished(true)
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  function getSoalStatus(soalId: number) {
    const answer = answers.find((a) => a.soal_id === soalId)
    if (!answer) return "belum"
    if (answer.ditandai) return "ditandai"
    if (answer.jawaban) return "dijawab"
    return "belum"
  }

  if (!cbt || !paket || soalList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Ujian CBT tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>Kembali</Button>
      </div>
    )
  }

  if (isFinished) {
    const totalBenar = answers.filter((a) => {
      const soal = soalList.find((s) => s.id === a.soal_id)
      return soal?.jawaban_benar === a.jawaban
    }).length
    const totalSalah = answers.filter((a) => {
      const soal = soalList.find((s) => s.id === a.soal_id)
      return soal && a.jawaban && soal.jawaban_benar !== a.jawaban
    }).length
    const nilai = Math.round((totalBenar / soalList.length) * 100)
    const lulus = nilai >= cbt.nilai_minimum_lulus

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="flex flex-col items-center gap-4">
          {lulus ? (
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <Clock className="h-10 w-10 text-red-600" />
            </div>
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{lulus ? "Selamat! Anda Lulus" : "Belum Tercapai"}</h2>
            <p className="text-muted-foreground mt-1">{cbt.nama_ujian}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Nilai</p>
            <p className="text-3xl font-bold text-primary">{nilai}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Waktu</p>
            <p className="text-3xl font-bold">{formatTime((cbt.durasi * 60) - timeLeft)}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Benar</p>
            <p className="text-3xl font-bold text-green-600">{totalBenar}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Salah</p>
            <p className="text-3xl font-bold text-red-600">{totalSalah}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>Kembali ke Daftar Ujian</Button>
          {cbt.tampilkan_nilai && (
            <Button onClick={() => router.push(`/siswa/cbt/${cbt.id}/hasil`)}>Lihat Hasil</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Soal Navigation */}
        <div className="hidden lg:flex w-72 border-r bg-muted/30 flex-col">
          <div className="p-4 border-b space-y-2">
            <h3 className="font-semibold text-sm">Navigasi Soal</h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500" /> Sudah Dijawab
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-yellow-500" /> Ditandai
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {soalList.map((soal, idx) => {
                const status = getSoalStatus(soal.id)
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={soal.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? "bg-primary text-white ring-2 ring-primary/30"
                        : status === "dijawab"
                          ? "bg-green-500 text-white"
                          : status === "ditandai"
                            ? "bg-yellow-500 text-white"
                            : "bg-card border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="p-4 border-t space-y-2">
            <div className="text-xs text-muted-foreground">
              <p>{answeredCount}/{soalList.length} soal dijawab</p>
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={() => router.push("/siswa/cbt")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Timer & Progress */}
          <div className="border-b bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => router.push("/siswa/cbt")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="font-semibold text-sm">{cbt.nama_ujian}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? "text-destructive" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Soal {currentIndex + 1} dari {soalList.length}</span>
              <span>{answeredCount}/{soalList.length} dijawab</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {currentSoal && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                  <Badge className="bg-primary/10 text-primary">{currentSoal.tipe_soal}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={bookmarkedIds.includes(currentSoal.id) ? "text-yellow-600" : "text-muted-foreground"}
                  >
                    {bookmarkedIds.includes(currentSoal.id) ? (
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-1" />
                    )}
                    Tandai Soal
                  </Button>
                </div>

                <div className="text-base leading-relaxed whitespace-pre-wrap">{currentSoal.pertanyaan}</div>

                {currentSoal.tipe_soal === "Pilihan Ganda" && currentSoal.pilihan && (
                  <div className="space-y-3">
                    {(["A", "B", "C", "D", "E"] as const).map((key) => {
                      const optionText = currentSoal.pilihan?.[key]
                      if (!optionText) return null
                      const isSelected = answers.find((a) => a.soal_id === currentSoal.id)?.jawaban === key
                      return (
                        <button
                          key={key}
                          onClick={() => handleAnswer(key)}
                          className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${
                            isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}>
                            {key}
                          </span>
                          <span className="text-sm flex-1 pt-1">{optionText}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentSoal.tipe_soal === "Benar / Salah" && (
                  <div className="space-y-3">
                    {["Benar", "Salah"].map((option) => {
                      const isSelected = answers.find((a) => a.soal_id === currentSoal.id)?.jawaban === option
                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? option === "Benar" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                              : "border-border hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${
                            isSelected
                              ? option === "Benar" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {option === "Benar" ? "✓" : "✗"}
                          </span>
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentSoal.tipe_soal === "Isian Singkat" && (
                  <div>
                    <input
                      type="text"
                      value={answers.find((a) => a.soal_id === currentSoal.id)?.jawaban ?? ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Ketik jawaban Anda..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none transition-colors text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t bg-card p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sebelumnya
              </Button>
              <div className="flex gap-2">
                {currentIndex < soalList.length - 1 ? (
                  <Button onClick={() => setCurrentIndex((prev) => Math.min(soalList.length - 1, prev + 1))}>
                    Selanjutnya
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setShowFinishDialog(true)} className="bg-green-600 hover:bg-green-700">
                    <Flag className="mr-2 h-4 w-4" />
                    Selesai Ujian
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finish Confirmation Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <Flag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DialogTitle>Selesai Ujian?</DialogTitle>
                <DialogDescription>
                  Pastikan semua soal sudah dijawab. Anda tidak dapat mengubah jawaban setelah mengirim.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Soal Dijawab</span>
              <span className="font-medium">{answeredCount}/{soalList.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Soal Ditandai</span>
              <span className="font-medium">{bookmarkedIds.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sisa Waktu</span>
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>Batal</Button>
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Ya, Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
