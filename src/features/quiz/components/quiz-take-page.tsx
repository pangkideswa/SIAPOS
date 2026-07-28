"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { DUMMY_QUIZ } from "../dummy/quiz.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import { DUMMY_BANK_SOAL } from "@/features/bank-soal/dummy/bank-soal.data"
import type { QuizAnswer } from "../types/quiz"
import type { BankSoal } from "@/features/bank-soal/types/bank-soal"

interface QuizTakePageProps {
  id: string
}

export function QuizTakePage({ id }: QuizTakePageProps) {
  const router = useRouter()
  const quiz = DUMMY_QUIZ.find((q) => q.id === Number(id))
  const paket = quiz ? DUMMY_PAKET_SOAL.find((p) => p.id === quiz.paket_soal_id) : null

  const soalList: BankSoal[] = paket
    ? DUMMY_BANK_SOAL.filter((s) => paket.soal_ids.includes(s.id))
    : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz ? quiz.durasi * 60 : 0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const currentSoal = soalList[currentIndex]
  const progress = soalList.length > 0 ? ((currentIndex + 1) / soalList.length) * 100 : 0

  const handleAnswer = useCallback((jawaban: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal?.id)
      if (existing) {
        return prev.map((a) => a.soal_id === currentSoal?.id ? { ...a, jawaban } : a)
      }
      return [...prev, { soal_id: currentSoal?.id ?? 0, jawaban }]
    })
  }, [currentSoal])

  function handleFinish() {
    setIsFinished(true)
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  if (!quiz || !paket || soalList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Quiz tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>Kembali</Button>
      </div>
    )
  }

  if (isFinished) {
    const totalBenar = answers.filter((a) => {
      const soal = soalList.find((s) => s.id === a.soal_id)
      return soal?.jawaban_benar === a.jawaban
    }).length
    const totalSalah = soalList.length - totalBenar
    const nilai = Math.round((totalBenar / soalList.length) * 100)
    const lulus = nilai >= 70

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center">
              {lulus ? (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                  <Clock className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{lulus ? "Selamat! Anda Lulus" : "Belum Tercapai"}</h2>
              <p className="text-muted-foreground mt-1">{quiz.judul}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Nilai</p>
                <p className="text-3xl font-bold text-primary">{nilai}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Waktu</p>
                <p className="text-3xl font-bold">{formatTime((quiz.durasi * 60) - timeLeft)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Benar</p>
                <p className="text-3xl font-bold text-green-600">{totalBenar}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Salah</p>
                <p className="text-3xl font-bold text-red-600">{totalSalah}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>Kembali ke Daftar Quiz</Button>
              {quiz.tampilkan_nilai && (
                <Button onClick={() => router.push(`/siswa/quiz/${quiz.id}/hasil`)}>Lihat Hasil</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/siswa/quiz")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Keluar
        </Button>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? "text-destructive" : ""}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Soal {currentIndex + 1} dari {soalList.length}</span>
          <span>{answers.length}/{soalList.length} dijawab</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentSoal && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Badge className="bg-primary/10 text-primary">{currentSoal.tipe_soal}</Badge>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{currentSoal.pertanyaan}</p>
            </div>

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
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
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
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Selesai
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {soalList.map((soal, idx) => {
          const isAnswered = answers.some((a) => a.soal_id === soal.id)
          return (
            <button
              key={soal.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                idx === currentIndex
                  ? "bg-primary text-white"
                  : isAnswered
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
