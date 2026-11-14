"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Menu,
  Maximize,
  ShieldAlert,
  Monitor,
  X,
  Check,
  CloudOff,
  Type,
  RotateCcw,
  KeyRound,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import type { CBTAnswer } from "../types/cbt"
import { detectSplitScreen } from "@/lib/anti-cheat"

interface CBTExamPageProps {
  id: string
}

type SaveStatus = "saved" | "saving" | "offline"
type FontSize = "sm" | "base" | "lg"

export function CBTExamPage({ id }: CBTExamPageProps) {
  const router = useRouter()

  const [exam, setExam] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const [soalList, setSoalList] = useState<any[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<CBTAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const targetEndTimeRef = useRef<number | null>(null)

  const [isStarted, setIsStarted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isCurang, setIsCurang] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  const [violationCount, setViolationCount] = useState(0)
  const [showViolationDialog, setShowViolationDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
  const [fontSize, setFontSize] = useState<FontSize>("base")

  const [inputToken, setInputToken] = useState("")
  const [isStarting, setIsStarting] = useState(false)
  const [isFullscreenActive, setIsFullscreenActive] = useState(true)
  const [isCheckingUnlock, setIsCheckingUnlock] = useState(false)
  const [isSplitScreen, setIsSplitScreen] = useState(false)

  // Monitor Split Screen state before start
  useEffect(() => {
    if (isStarted || isFinished || isCurang) return

    const checkSplit = () => {
      const res = detectSplitScreen()
      setIsSplitScreen(res.isSplit)
    }

    checkSplit()
    window.addEventListener("resize", checkSplit)
    window.addEventListener("orientationchange", checkSplit)
    window.addEventListener("focus", checkSplit)
    window.addEventListener("blur", checkSplit)

    const interval = setInterval(checkSplit, 1000)

    return () => {
      window.removeEventListener("resize", checkSplit)
      window.removeEventListener("orientationchange", checkSplit)
      window.removeEventListener("focus", checkSplit)
      window.removeEventListener("blur", checkSplit)
      clearInterval(interval)
    }
  }, [isStarted, isFinished, isCurang])

  async function checkUnlockStatus() {
    setIsCheckingUnlock(true)
    try {
      const res = await fetch(`/api/exams/${id}/start`, { method: "POST" })
      const json = await res.json()
      if (json.data || json.success) {
        const payload = json.data || json
        if (payload.participant?.status === "MENGERJAKAN") {
          setIsCurang(false)
          setIsFinished(false)
          setParticipant(payload.participant)
          setViolationCount(payload.participant.violation_count || 0)
          toast.success("Ujian telah dibuka kembali oleh pengawas! Memasuki ujian...")
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {})
          }
          return
        }
      }
      toast.info("Status ujian masih dibekukan. Silakan hubungi pengawas di ruangan.")
    } catch (e) {
      toast.error("Gagal memeriksa status kunci ujian")
    } finally {
      setIsCheckingUnlock(false)
    }
  }

  // Track fullscreen state for student
  useEffect(() => {
    if (!isStarted || isFinished || isCurang) return
    const checkFs = () => {
      setIsFullscreenActive(!!document.fullscreenElement)
    }
    checkFs()
    document.addEventListener("fullscreenchange", checkFs)
    window.addEventListener("focus", checkFs)
    return () => {
      document.removeEventListener("fullscreenchange", checkFs)
      window.removeEventListener("focus", checkFs)
    }
  }, [isStarted, isFinished, isCurang])

  const handleReEnterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setIsFullscreenActive(true)
          setShowViolationDialog(false)
        })
        .catch(() => {})
    }
  }

  // Load Exam
  useEffect(() => {
    async function loadExam() {
      try {
        const res = await fetch(`/api/exams/${id}/start`, { method: "POST" })
        const json = await res.json()

        if (json.data || json.success) {
          const payload = json.data || json
          const loadedExam = payload.exam
          const loadedParticipant = payload.participant
          const items = loadedExam.soal_items || []

          setExam(loadedExam)
          setParticipant(loadedParticipant)
          setSoalList(items)
          setViolationCount(loadedParticipant?.violation_count || 0)

          if (loadedParticipant?.status === "CURANG") {
            setIsCurang(true)
            setIsStarted(true)
            setIsFinished(false)
            setIsLoading(false)
            return
          }

          if (loadedParticipant?.status === "SELESAI") {
            setIsFinished(true)
            setIsStarted(true)
            setIsLoading(false)
            return
          }

          if (loadedParticipant?.status === "MENGERJAKAN") {
            setIsStarted(true)
          }

          // Initialized remaining time from server
          const remainingSecs = payload.remaining_seconds ?? (loadedExam.durasi_menit || 60) * 60
          setTimeLeft(remainingSecs)
          targetEndTimeRef.current = Date.now() + remainingSecs * 1000

          // Prepare answers from server & localStorage fallback
          const initialAnswersMap: Record<number, CBTAnswer> = {}

          // 1. Answers from DB
          if (loadedParticipant?.answers) {
            loadedParticipant.answers.forEach((a: any) => {
              initialAnswersMap[a.bank_soal_id] = {
                soal_id: a.bank_soal_id,
                jawaban: a.selected_option_id ? String(a.selected_option_id) : a.jawaban_esai || "",
                ditandai: false,
              }
            })
          }

          // 2. Answers & Bookmarks from LocalStorage
          try {
            const cachedAnswers = localStorage.getItem(`cbt_answers_${loadedParticipant.id}`)
            if (cachedAnswers) {
              const parsed = JSON.parse(cachedAnswers)
              Object.keys(parsed).forEach((k) => {
                const sId = Number(k)
                if (parsed[sId]) {
                  initialAnswersMap[sId] = {
                    ...(initialAnswersMap[sId] || { soal_id: sId, ditandai: false }),
                    jawaban: parsed[sId],
                  }
                }
              })
            }

            const cachedBookmarks = localStorage.getItem(`cbt_bookmarks_${loadedParticipant.id}`)
            if (cachedBookmarks) {
              const bookmarkedIds: number[] = JSON.parse(cachedBookmarks)
              bookmarkedIds.forEach((bId) => {
                if (initialAnswersMap[bId]) {
                  initialAnswersMap[bId].ditandai = true
                } else {
                  initialAnswersMap[bId] = { soal_id: bId, jawaban: "", ditandai: true }
                }
              })
            }
          } catch (e) {
            console.error("Gagal membaca cache lokal:", e)
          }

          setAnswers(Object.values(initialAnswersMap))

          // If time is already up for an exam that is currently in progress, auto-finish
          if (loadedParticipant?.status === "MENGERJAKAN" && remainingSecs <= 0) {
            handleFinish()
          }
        } else {
          toast.error(json.error || "Gagal memuat ujian")
        }
      } catch (error) {
        toast.error("Terjadi gangguan koneksi internet")
      } finally {
        setIsLoading(false)
      }
    }
    loadExam()
  }, [id])

  // Timer Tick - Resistant to background tab throttling via Date.now()
  useEffect(() => {
    if (!isStarted || isFinished || isCurang || !targetEndTimeRef.current) return

    const timer = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, Math.round((targetEndTimeRef.current! - now) / 1000))
      setTimeLeft(diff)

      if (diff <= 0) {
        clearInterval(timer)
        handleFinish()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isStarted, isFinished, isCurang])

  // Anti-Cheat: Fullscreen, Blur, Split-Screen, and Tab Switch Detection
  useEffect(() => {
    if (!isStarted || isFinished || isCurang || !participant) return

    const triggerViolation = async (reason: string, instant = false) => {
      try {
        const res = await fetch("/api/exams/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_id: participant.id,
            action: "violation",
            instant,
            reason,
          }),
        })
        const json = await res.json()
        if (json.success && json.data) {
          const vCount = json.data.violation_count || violationCount + 1
          setViolationCount(vCount)
          if (json.data.status === "CURANG" || instant) {
            setIsCurang(true)
            setIsFinished(true)
            setShowViolationDialog(false)
            toast.error(instant ? `Ujian dihentikan! ${reason}` : "Ujian Anda telah dihentikan karena terindikasi kecurangan.")
            return
          }
        }
      } catch (e) {
        console.error("Gagal mencatat pelanggaran", e)
      }
      if (!instant) {
        setShowViolationDialog(true)
      }
    }

    const checkSplitInExam = () => {
      const splitCheck = detectSplitScreen()
      if (splitCheck.isSplit) {
        triggerViolation("Terdeteksi menggunakan fitur Split Screen (layar terbelah / multi-window) saat ujian berlangsung", true)
      }
    }

    const handleBlur = () => {
      const splitCheck = detectSplitScreen()
      if (splitCheck.isSplit) {
        triggerViolation("Terdeteksi menggunakan fitur Split Screen (layar terbelah / multi-window) saat ujian berlangsung", true)
      } else {
        triggerViolation("Berpindah tab atau membuka aplikasi lain")
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        const splitCheck = detectSplitScreen()
        if (splitCheck.isSplit) {
          triggerViolation("Terdeteksi menggunakan fitur Split Screen (layar terbelah / multi-window) saat ujian berlangsung", true)
        } else {
          triggerViolation("Keluar dari mode layar penuh (fullscreen)")
        }
      }
    }

    const handleResize = () => {
      checkSplitInExam()
    }

    // Prevent copy, cut, context menu, and devtools shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleCopy = (e: ClipboardEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && (e.key === "c" || e.key === "C" || e.key === "u" || e.key === "U" || e.key === "i" || e.key === "I"))
      ) {
        e.preventDefault()
      }
    }

    window.addEventListener("blur", handleBlur)
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    window.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("copy", handleCopy)
    window.addEventListener("keydown", handleKeyDown)

    // Periodic split-screen verification
    const splitInterval = setInterval(checkSplitInExam, 1500)

    return () => {
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      window.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("copy", handleCopy)
      window.removeEventListener("keydown", handleKeyDown)
      clearInterval(splitInterval)
    }
  }, [isStarted, isFinished, isCurang, participant, violationCount])

  const startExam = async () => {
    const splitCheck = detectSplitScreen()
    if (splitCheck.isSplit) {
      setIsSplitScreen(true)
      toast.error("Tidak dapat memulai ujian: Mode Layar Terbelah (Split Screen) terdeteksi. Silakan gunakan satu layar penuh.")
      return
    }

    if (exam.has_token && (!inputToken || inputToken.trim().length === 0)) {
      toast.error("Silakan masukkan Token Ujian dari pengawas ruangan.")
      return
    }

    setIsStarting(true)
    try {
      const res = await fetch(`/api/exams/${id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken.trim(), start: true }),
      })
      const json = await res.json()
      if (json.data || json.success) {
        const payload = json.data || json
        setParticipant(payload.participant)
        const remainingSecs = (payload.remaining_seconds && payload.remaining_seconds > 0)
          ? payload.remaining_seconds
          : (exam.durasi_menit || 60) * 60
        setTimeLeft(remainingSecs)
        targetEndTimeRef.current = Date.now() + remainingSecs * 1000

        setIsStarted(true)
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {})
        }
      } else {
        toast.error(json.error || "Gagal memulai ujian")
      }
    } catch (e) {
      toast.error("Terjadi gangguan koneksi internet")
    } finally {
      setIsStarting(false)
    }
  }

  const currentSoal = soalList[currentIndex]
  const progress = soalList.length > 0 ? ((currentIndex + 1) / soalList.length) * 100 : 0

  const answeredCount = answers.filter((a) => a.jawaban !== "").length
  const bookmarkedIds = answers.filter((a) => a.ditandai).map((a) => a.soal_id)
  const unansweredCount = soalList.length - answeredCount

  // Handle Answer with Instant LocalStorage & Auto-Save
  const handleAnswer = useCallback(
    async (jawaban: string) => {
      if (!currentSoal || !participant) return

      setSaveStatus("saving")

      // 1. Update State
      setAnswers((prev) => {
        const existing = prev.find((a) => a.soal_id === currentSoal.id)
        if (existing) {
          return prev.map((a) => (a.soal_id === currentSoal.id ? { ...a, jawaban } : a))
        }
        return [...prev, { soal_id: currentSoal.id, jawaban, ditandai: false }]
      })

      // 2. Cache locally
      try {
        const key = `cbt_answers_${participant.id}`
        const cached = JSON.parse(localStorage.getItem(key) || "{}")
        cached[currentSoal.id] = jawaban
        localStorage.setItem(key, JSON.stringify(cached))
      } catch (e) {
        console.error(e)
      }

      // 3. Auto-save to Server
      try {
        const payload = {
          participant_id: participant.id,
          action: "save",
          answers: [
            {
              bank_soal_id: currentSoal.id,
              selected_option_id: currentSoal.tipe_soal === "PILIHAN_GANDA" ? Number(jawaban) : null,
              jawaban_esai: currentSoal.tipe_soal === "ESAI" ? jawaban : null,
            },
          ],
        }
        const res = await fetch("/api/exams/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          setSaveStatus("saved")
        } else {
          setSaveStatus("offline")
        }
      } catch (e) {
        setSaveStatus("offline")
      }
    },
    [currentSoal, participant]
  )

  // Toggle Bookmark (Ragu-ragu)
  function handleBookmark() {
    if (!currentSoal || !participant) return
    setAnswers((prev) => {
      const existing = prev.find((a) => a.soal_id === currentSoal.id)
      const nextDitandai = existing ? !existing.ditandai : true
      const updated = existing
        ? prev.map((a) => (a.soal_id === currentSoal.id ? { ...a, ditandai: nextDitandai } : a))
        : [...prev, { soal_id: currentSoal.id, jawaban: "", ditandai: true }]

      // Update LocalStorage
      try {
        const bookmarks = updated.filter((a) => a.ditandai).map((a) => a.soal_id)
        localStorage.setItem(`cbt_bookmarks_${participant.id}`, JSON.stringify(bookmarks))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  // Handle Final Submission
  async function handleFinish() {
    setShowFinishDialog(false)
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
    }
    setIsFinished(true)
    setIsLoading(true)

    try {
      const formattedAnswers = answers
        .filter((a) => a.jawaban && a.jawaban.trim() !== "")
        .map((a) => {
          const soal = soalList.find((s) => s.id === a.soal_id)
          const isPilihanGanda = soal?.tipe_soal === "PILIHAN_GANDA"
          return {
            bank_soal_id: a.soal_id,
            selected_option_id: isPilihanGanda && !isNaN(Number(a.jawaban)) ? Number(a.jawaban) : undefined,
            jawaban_esai: !isPilihanGanda ? a.jawaban : undefined,
          }
        })

      const payload = {
        participant_id: participant?.id,
        action: "submit",
        answers: formattedAnswers,
      }
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if ((json.success || json.data) && json.data) {
        setParticipant(json.data)
        // Clean local cache after successful submission
        if (participant?.id) {
          localStorage.removeItem(`cbt_answers_${participant.id}`)
          localStorage.removeItem(`cbt_bookmarks_${participant.id}`)
        }
        toast.success("Ujian berhasil dikumpulkan!")
      } else {
        toast.error(json.error || json.message || "Gagal mengumpulkan ujian")
      }
    } catch (e) {
      toast.error("Gagal mengirim jawaban akhir. Hubungi pengawas ujian.")
    } finally {
      setIsLoading(false)
    }
  }

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  function getSoalStatus(soalId: number) {
    const answer = answers.find((a) => a.soal_id === soalId)
    if (!answer) return "belum"
    if (answer.ditandai) return "ditandai"
    if (answer.jawaban && answer.jawaban !== "") return "dijawab"
    return "belum"
  }

  // Text size classes
  const textSizeClass =
    fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg leading-relaxed" : "text-base"

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">Menyiapkan Lembar Ujian CBT...</p>
      </div>
    )
  }

  if (isCurang) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-12 px-4 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mx-auto">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-destructive">Akses Ujian Ditangguhkan</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {participant?.catatan_guru || "Sistem mendeteksi indikasi kecurangan (penggunaan Split Screen / multi-window / berpindah tab atau keluar mode layar penuh). Lembar ujian Anda telah otomatis dibekukan demi menjaga integritas ujian."}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
          Silakan melapor langsung kepada pengawas atau guru di ruangan ujian untuk membuka kunci ujian Anda.
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={checkUnlockStatus}
            disabled={isCheckingUnlock}
            className="w-full sm:w-auto bg-primary text-white gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isCheckingUnlock ? "animate-spin" : ""}`} />
            {isCheckingUnlock ? "Memeriksa Status..." : "Cek Status Buka Kunci"}
          </Button>
          <Button onClick={() => router.push("/siswa/cbt")} variant="outline" className="w-full sm:w-auto">
            Kembali ke Daftar Ujian
          </Button>
        </div>
      </div>
    )
  }

  if (!exam || soalList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Ujian CBT tidak ditemukan atau paket soal belum terisi.</p>
        <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>
          Kembali
        </Button>
      </div>
    )
  }

  // Confirmation Lobby Before Starting Exam
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Monitor className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Konfirmasi Kesiapan Ujian</h2>
            <p className="text-muted-foreground mt-1">{exam.judul}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 text-center bg-card">
            <p className="text-sm text-muted-foreground">Total Soal</p>
            <p className="text-2xl font-bold">{soalList.length} Butir</p>
          </div>
          <div className="rounded-lg border p-4 text-center bg-card">
            <p className="text-sm text-muted-foreground">Durasi Ujian</p>
            <p className="text-2xl font-bold">{exam.durasi_menit || 60} Menit</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-lg p-5 text-sm space-y-3">
          <p className="font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Tata Tertib & Keamanan CBT
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <li>Pastikan koneksi internet perangkat Anda stabil.</li>
            <li>Ujian akan berjalan dalam mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
            <li>
              Dilarang berpindah tab, meminimalkan jendela browser, atau membuka aplikasi lain. Tindakan ini dicatat sebagai <strong>Pelanggaran Anti-Curang</strong>.
            </li>
            <li>
              Dilarang keras menggunakan fitur <strong>Split Screen (layar terbelah / multi-window)</strong> atau floating window. Tindakan ini akan <strong>langsung menyebabkan status CURANG</strong> dan ujian dihentikan seketika.
            </li>
            <li>Maksimal toleransi pelanggaran umum adalah <strong>3 kali</strong>. Melebihi itu, lembar ujian otomatis terkunci.</li>
            <li>Waktu ujian akan terus berjalan secara otomatis dan tidak dapat dihentikan sementara.</li>
          </ul>
        </div>

        {isSplitScreen && (
          <div className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-center space-y-2 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-destructive font-bold text-sm sm:text-base">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Mode Split Screen / Layar Terbelah Terdeteksi!</span>
            </div>
            <p className="text-xs sm:text-sm text-destructive/90 leading-relaxed">
              Sistem mendeteksi layar perangkat Anda sedang terbagi atau tidak dalam ukuran penuh. Untuk mencegah indikasi kecurangan, 
              Anda <strong>wajib menutup aplikasi lain</strong> dan memperluas browser ke <strong>satu layar penuh</strong> sebelum dapat memulai ujian.
            </p>
          </div>
        )}

        {exam.has_token && (
          <div className="rounded-xl border p-4 bg-primary/5 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Token Ujian Diperlukan
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Masukkan 6 digit kode token yang dirilis oleh pengawas di ruangan ujian:
            </p>
            <input
              type="text"
              maxLength={6}
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value.toUpperCase())}
              placeholder="CONTOH: B7K9LP"
              className="w-full max-w-xs mx-auto text-center font-mono text-2xl font-black tracking-widest px-4 py-2.5 rounded-lg border-2 border-primary/40 focus:border-primary bg-background uppercase outline-none shadow-xs"
            />
          </div>
        )}

        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>
            Kembali
          </Button>
          <Button
            onClick={startExam}
            disabled={isStarting || isSplitScreen}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
          >
            <Maximize className="mr-2 h-4 w-4" />
            {isSplitScreen ? "Tutup Split Screen Untuk Memulai" : isStarting ? "Memverifikasi..." : "Mulai Ujian Sekarang"}
          </Button>
        </div>
      </div>
    )
  }

  // Finished Screen
  if (isFinished) {
    const nilai = participant?.nilai_akhir ?? 0
    const lulus = nilai >= (exam.kkm ?? 75)

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-10 px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ujian Telah Selesai</h2>
            <p className="text-muted-foreground mt-1">{exam.judul}</p>
          </div>
        </div>

        {exam.tampilkan_nilai ? (
          <div className="rounded-lg border p-6 max-w-sm mx-auto bg-card space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nilai Akhir Anda</p>
            <p className="text-5xl font-extrabold text-primary">{Math.round(nilai)}</p>
            <div className="pt-2">
              <Badge className={lulus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {lulus ? "Lulus (Di atas KKM)" : `Belum Lulus (KKM: ${exam.kkm ?? 75})`}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border p-6 max-w-md mx-auto bg-muted/40 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Jawaban Anda berhasil disimpan!</p>
            <p>
              Hasil evaluasi dan nilai ujian akhir akan diumumkan oleh guru atau pihak sekolah setelah seluruh periode ujian berakhir.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>
            Kembali ke Daftar Ujian
          </Button>
          {exam.tampilkan_nilai && (
            <Button onClick={() => router.push(`/siswa/cbt/${exam.id}/hasil`)}>
              Lihat Analitik Hasil
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Active Exam Room
  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] select-none">
        {/* Sidebar - Soal Navigation (Desktop) & Overlay (Mobile) */}
        <div
          className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all lg:hidden ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-lg transform transition-transform duration-300 lg:static lg:transform-none lg:flex lg:flex-col lg:bg-muted/20 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Navigasi Nomor Soal</h3>
              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-green-500" /> Dijawab
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Ragu-ragu
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
                    onClick={() => {
                      setCurrentIndex(idx)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                        : status === "dijawab"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : status === "ditandai"
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-card border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {idx + 1}
                    {status === "ditandai" && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-background" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-4 border-t space-y-3 bg-muted/10">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Soal Dijawab:</span>
                <span className="font-semibold text-foreground">
                  {answeredCount}/{soalList.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ragu-ragu:</span>
                <span className="font-semibold text-amber-600">{bookmarkedIds.length}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium"
              onClick={() => setShowFinishDialog(true)}
            >
              <Flag className="mr-1.5 h-3.5 w-3.5" />
              Selesai & Kumpulkan
            </Button>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Header, Timer, Auto-Save Status, Font Resizer */}
          <div className="border-b bg-card p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="font-bold text-sm sm:text-base line-clamp-1">{exam.judul}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {saveStatus === "saving" ? (
                      <span className="flex items-center gap-1 text-muted-foreground animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Menyimpan jawaban...
                      </span>
                    ) : saveStatus === "offline" ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <CloudOff className="h-3 w-3" /> Tersimpan lokal (offline)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Jawaban tersimpan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Font Size Adjuster */}
                <div className="hidden sm:flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setFontSize("sm")}
                    className={`px-2 py-1 rounded ${fontSize === "sm" ? "bg-background shadow-xs text-primary" : "text-muted-foreground"}`}
                    title="Font Kecil"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize("base")}
                    className={`px-2 py-1 rounded ${fontSize === "base" ? "bg-background shadow-xs text-primary" : "text-muted-foreground"}`}
                    title="Font Normal"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("lg")}
                    className={`px-2 py-1 rounded ${fontSize === "lg" ? "bg-background shadow-xs text-primary" : "text-muted-foreground"}`}
                    title="Font Besar"
                  >
                    A+
                  </button>
                </div>

                {/* Countdown Timer */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-bold ${
                    timeLeft < 300
                      ? "bg-destructive/10 text-destructive border-destructive/30 animate-pulse"
                      : "bg-muted/40 text-foreground"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Nomor {currentIndex + 1} dari {soalList.length}
              </span>
              <span>
                {answeredCount} dari {soalList.length} soal terjawab ({Math.round((answeredCount / soalList.length) * 100)}%)
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Question Body */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {currentSoal && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary">Soal No. {currentIndex + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {currentSoal.tipe_soal === "PILIHAN_GANDA" ? "Pilihan Ganda" : "Esai"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={`text-xs ${
                      bookmarkedIds.includes(currentSoal.id)
                        ? "text-amber-600 bg-amber-500/10 hover:bg-amber-500/20"
                        : "text-muted-foreground"
                    }`}
                  >
                    {bookmarkedIds.includes(currentSoal.id) ? (
                      <BookmarkCheck className="h-4 w-4 mr-1 text-amber-600" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-1" />
                    )}
                    {bookmarkedIds.includes(currentSoal.id) ? "Ragu-ragu" : "Tandai Ragu-ragu"}
                  </Button>
                </div>

                {/* Question Image if lampiran exists */}
                {currentSoal.lampiran && typeof currentSoal.lampiran === "object" && (currentSoal.lampiran as any).url && (
                  <div className="rounded-lg border p-2 bg-muted/20 max-w-md">
                    <img
                      src={(currentSoal.lampiran as any).url}
                      alt="Lampiran Soal"
                      className="max-h-72 rounded object-contain mx-auto"
                    />
                  </div>
                )}

                {/* Question Text */}
                <div className={`${textSizeClass} leading-relaxed whitespace-pre-wrap select-none font-medium`}>
                  {currentSoal.pertanyaan}
                </div>

                {/* Multiple Choice Options */}
                {currentSoal.tipe_soal === "PILIHAN_GANDA" && currentSoal.options && (
                  <div className="space-y-3 pt-2">
                    {currentSoal.options.map((opt: any, i: number) => {
                      const letter = String.fromCharCode(65 + i)
                      const isSelected = answers.find((a) => a.soal_id === currentSoal.id)?.jawaban === String(opt.id)
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleAnswer(String(opt.id))}
                          className={`w-full flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground shadow-xs"
                              : "border-border hover:border-primary/40 hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors ${
                              isSelected ? "bg-primary text-white" : "bg-muted text-foreground"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className={`${textSizeClass} flex-1 pt-1 text-foreground`}>{opt.teks}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Essay Area */}
                {currentSoal.tipe_soal === "ESAI" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Tuliskan Jawaban Anda:</label>
                    <textarea
                      value={answers.find((a) => a.soal_id === currentSoal.id)?.jawaban ?? ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Ketik uraian jawaban secara lengkap di sini..."
                      className={`w-full p-4 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors min-h-[160px] ${textSizeClass}`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar Navigation */}
          <div className="border-t bg-card p-3 sm:p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Sebelumnya
              </Button>

              <div className="flex gap-2">
                {currentIndex < soalList.length - 1 ? (
                  <Button size="sm" onClick={() => setCurrentIndex((prev) => Math.min(soalList.length - 1, prev + 1))}>
                    Selanjutnya
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setShowFinishDialog(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <Flag className="mr-1.5 h-4 w-4" />
                    Selesai Ujian
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Selesai Ujian dengan Rekapitulasi Lengkap */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 shrink-0">
                <Flag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <DialogTitle>Kumpulkan Jawaban Ujian?</DialogTitle>
                <DialogDescription>
                  Periksa kembali rekapitulasi lembar ujian Anda sebelum mengumpulkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground">Dijawab</p>
                <p className="text-xl font-bold text-green-600">{answeredCount}</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground">Belum Dijawab</p>
                <p className="text-xl font-bold text-destructive">{unansweredCount}</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground">Ragu-ragu</p>
                <p className="text-xl font-bold text-amber-600">{bookmarkedIds.length}</p>
              </div>
            </div>

            {(unansweredCount > 0 || bookmarkedIds.length > 0) && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Masih terdapat <strong>{unansweredCount} soal belum dijawab</strong> atau{" "}
                  <strong>{bookmarkedIds.length} soal bertanda ragu-ragu</strong>. Pastikan Anda telah memeriksa semua nomor.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              Periksa Kembali
            </Button>
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Ya, Kumpulkan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Peringatan Anti-Curang */}
      <Dialog open={showViolationDialog} onOpenChange={setShowViolationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-destructive">Peringatan Anti-Curang!</DialogTitle>
                <DialogDescription>
                  Sistem mendeteksi Anda berpindah tab atau keluar dari mode layar penuh.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-lg border p-4 bg-muted/40 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Setiap kali Anda meninggalkan halaman ujian, sistem mencatatnya sebagai pelanggaran. Ujian akan otomatis dihentikan dan dibekukan jika mencapai 3 kali pelanggaran.
            </p>
            <div className="flex justify-between items-center bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <span className="text-xs font-semibold text-destructive">Total Pelanggaran Anda:</span>
              <span className="text-lg font-extrabold text-destructive">{violationCount} / 3</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setShowViolationDialog(false)
                handleReEnterFullscreen()
              }}
              className="bg-destructive hover:bg-destructive/90 text-white w-full font-bold"
            >
              Saya Mengerti & Kembali ke Layar Penuh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Persistent Fullscreen Barrier Overlay */}
      {isStarted && !isFinished && !isCurang && !isFullscreenActive && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in">
          <div className="max-w-md w-full bg-card border-2 border-primary/40 p-8 rounded-2xl shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Maximize className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Mode Layar Penuh Diperlukan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sesi ujian CBT Anda sedang berlangsung. Untuk menjaga ketertiban dan integritas ujian, Anda wajib berada dalam mode layar penuh (fullscreen).
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleReEnterFullscreen}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-6 rounded-xl shadow-lg shadow-primary/25"
            >
              <Maximize className="mr-2 h-5 w-5" />
              Masuk Layar Penuh & Lanjutkan Ujian
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
