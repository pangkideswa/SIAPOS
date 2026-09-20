"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Monitor, Maximize, ShieldAlert, AlertTriangle, Bookmark, BookmarkCheck, Flag, Menu, X } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { QuizAnswer } from "../types/quiz"

interface QuizTakePageProps {
  id: string
}

export function QuizTakePage({ id }: QuizTakePageProps) {
  const router = useRouter()
  
  const [quiz, setQuiz] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const [soalList, setSoalList] = useState<any[]>([])
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [violationCount, setViolationCount] = useState(0)
  const [showViolationDialog, setShowViolationDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/exams/${id}/start`, { method: 'POST' })
        const json = await res.json()
        if (json.data || json.success) {
          const payload = json.data || json;
          setQuiz(payload.exam)
          setParticipant(payload.participant)
          
          let items = payload.exam?.paket_soal?.items?.map((i: any) => i.bank_soal) || []
          if (payload.exam?.acak_urutan_soal) {
             items = [...items].sort(() => Math.random() - 0.5)
          }
          setSoalList(items)
          setTimeLeft((payload.exam?.durasi_menit || 60) * 60)
          
          // Load previous answers
          if (payload.participant?.answers) {
             const prevAnswers = payload.participant.answers.map((a: any) => ({
                soal_id: a.bank_soal_id,
                jawaban: a.selected_option_id ? String(a.selected_option_id) : (a.jawaban_esai || ""),
                ditandai: false
             }))
             setAnswers(prevAnswers)
          }

          if (payload.participant?.status === "SELESAI") {
             setIsFinished(true)
             setIsStarted(true)
          }
        } else {
          toast.error(json.error || "Gagal memuat quiz")
        }
      } catch (error) {
        toast.error("Terjadi kesalahan jaringan")
      } finally {
        setIsLoading(false)
      }
    }
    loadQuiz()
  }, [id])

  useEffect(() => {
    if (!isStarted || isFinished || !quiz) return

    const handleBlur = () => {
      setViolationCount((prev) => prev + 1)
      setShowViolationDialog(true)
    }
    
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolationCount((prev) => prev + 1)
        setShowViolationDialog(true)
      }
    }

    window.addEventListener("blur", handleBlur)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    
    return () => {
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [isStarted, isFinished, quiz])

  useEffect(() => {
    if (!isStarted || isFinished) return
    if (timeLeft <= 0) {
      handleFinish()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isStarted, isFinished])

  const startExam = () => {
    setIsStarted(true)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error)
    }
  }

  const currentSoal = soalList[currentIndex]
  const progress = soalList.length > 0 ? ((currentIndex + 1) / soalList.length) * 100 : 0

  const answeredCount = answers.filter(a => a.jawaban !== "").length
  const bookmarkedIds = answers.filter((a) => (a as any).ditandai).map((a) => a.soal_id)

  const handleAnswer = useCallback(async (jawaban: string) => {
    if (!currentSoal || !participant) return
    
    // Optimistic update
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal.id)
      if (existing) {
        return prev.map((a) => a.soal_id === currentSoal.id ? { ...a, jawaban } : a)
      }
      return [...prev, { soal_id: currentSoal.id, jawaban, ditandai: false } as any]
    })

    // Auto save to backend
    try {
      const payload = {
         participant_id: participant.id,
         action: "save",
         answers: [{
            bank_soal_id: currentSoal.id,
            selected_option_id: currentSoal.tipe_soal === "PILIHAN_GANDA" ? Number(jawaban) : null,
            jawaban_esai: currentSoal.tipe_soal === "ESAI" ? jawaban : null
         }]
      }
      await fetch("/api/exams/submit", {
         method: "POST",
         body: JSON.stringify(payload)
      })
    } catch (e) {
      console.error("Gagal auto-save", e)
    }
  }, [currentSoal, participant])

  function handleBookmark() {
    if (!currentSoal) return
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal.id)
      if (existing) {
        return prev.map((a) => a.soal_id === currentSoal.id ? { ...a, ditandai: !(a as any).ditandai } : a)
      }
      return [...prev, { soal_id: currentSoal.id, jawaban: "", ditandai: true } as any]
    })
  }

  async function handleFinish() {
    setShowFinishDialog(false)
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
    }
    setIsFinished(true)
    setIsLoading(true)
    try {
      const payload = {
         participant_id: participant.id,
         action: "submit"
      }
      const res = await fetch("/api/exams/submit", {
         method: "POST",
         body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (json.success) {
         setParticipant(json.data)
      }
    } catch (e) {
      toast.error("Gagal mengirim jawaban akhir")
    } finally {
      setIsLoading(false)
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  function getSoalStatus(soalId: number) {
    const answer = answers.find((a) => a.soal_id === soalId) as any
    if (!answer) return "belum"
    if (answer.ditandai) return "ditandai"
    if (answer.jawaban && answer.jawaban !== "") return "dijawab"
    return "belum"
  }

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center">Memuat Quiz...</div>
  }

  if (!quiz || soalList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Quiz tidak ditemukan atau soal kosong.</p>
        <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>Kembali</Button>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Monitor className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Konfirmasi Kesiapan Quiz</h2>
            <p className="text-muted-foreground mt-1">{quiz.judul}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Soal</p>
            <p className="text-2xl font-bold">{soalList.length}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Durasi Quiz</p>
            <p className="text-2xl font-bold">{quiz.durasi_menit || 60} Menit</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm space-y-2">
          <p className="font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Perhatian & Tata Tertib
          </p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>Pastikan koneksi internet Anda stabil sebelum memulai.</li>
            <li>Quiz akan berjalan dalam mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
            <li>Sistem akan mendeteksi jika Anda keluar dari layar penuh, membuka tab baru, atau meminimalkan browser. Tindakan tersebut akan dicatat sebagai <strong>Pelanggaran</strong>.</li>
            <li>Waktu quiz akan otomatis dimulai ketika Anda menekan tombol di bawah.</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>
            Kembali
          </Button>
          <Button onClick={startExam} className="bg-primary hover:bg-primary/90 text-white">
            <Maximize className="mr-2 h-4 w-4" />
            Mulai Quiz Sekarang
          </Button>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const nilai = participant?.nilai_akhir ?? 0
    const lulus = nilai >= (quiz.kkm ?? 75)

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
            <h2 className="text-2xl font-bold">{lulus ? "Selamat! Anda Lulus" : "Belum Lulus (Di bawah KKM)"}</h2>
            <p className="text-muted-foreground mt-1">{quiz.judul}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-sm text-muted-foreground">Nilai Akhir</p>
            <p className="text-4xl font-bold text-primary">{Math.round(nilai)}</p>
            <p className="text-xs text-muted-foreground mt-2">KKM: {quiz.kkm ?? 75}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>Kembali ke Daftar Quiz</Button>
          {quiz.tampilkan_nilai && (
            <Button onClick={() => router.push(`/siswa/quiz/${quiz.id}/hasil`)}>Lihat Analitik Hasil</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Soal Navigation (Desktop) & Overlay (Mobile) */}
        <div className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all lg:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-lg transform transition-transform duration-300 lg:static lg:transform-none lg:flex lg:flex-col lg:bg-muted/30 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Navigasi Soal</h3>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500" /> Dijawab
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-500" /> Ditandai
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {soalList.map((soal, idx) => {
                const status = getSoalStatus(soal.id)
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={soal.id}
                    onClick={() => { setCurrentIndex(idx); setIsMobileMenuOpen(false); }}
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
            <Button variant="outline" className="w-full" size="sm" onClick={() => router.push("/siswa/quiz")}>
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
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <h2 className="font-semibold text-sm line-clamp-1">{quiz.judul}</h2>
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
                  <Badge className="bg-primary/10 text-primary">{currentSoal.tipe_soal === "PILIHAN_GANDA" ? "Pilihan Ganda" : "Esai"}</Badge>
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

                {currentSoal.tipe_soal === "PILIHAN_GANDA" && currentSoal.options && (
                  <div className="space-y-3">
                    {currentSoal.options.map((opt: any, i: number) => {
                      const letter = String.fromCharCode(65 + i)
                      const isSelected = answers.find((a) => a.soal_id === currentSoal.id)?.jawaban === String(opt.id)
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleAnswer(String(opt.id))}
                          className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${
                            isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}>
                            {letter}
                          </span>
                          <span className="text-sm flex-1 pt-1">{opt.teks}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentSoal.tipe_soal === "ESAI" && (
                  <div>
                    <textarea
                      value={answers.find((a) => a.soal_id === currentSoal.id)?.jawaban ?? ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Ketik jawaban Anda..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none transition-colors text-sm min-h-[150px]"
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
                    Selesai Quiz
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
                <DialogTitle>Selesai Quiz?</DialogTitle>
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

      {/* Violation Alert Dialog */}
      <Dialog open={showViolationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-destructive">Peringatan Anti-Curang!</DialogTitle>
                <DialogDescription>
                  Sistem mendeteksi Anda berpindah tab atau meminimalkan browser.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
            <p className="text-sm">Tindakan ini tercatat sebagai pelanggaran ujian.</p>
            <div className="flex justify-between items-center bg-destructive/10 p-3 rounded-md">
              <span className="text-sm font-medium text-destructive">Total Pelanggaran Anda:</span>
              <span className="text-xl font-bold text-destructive">{violationCount}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowViolationDialog(false)} className="bg-destructive hover:bg-destructive/90">
              Saya Mengerti & Kembali ke Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
