"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type Column } from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  RotateCcw,
  Unlock,
  StopCircle,
  Search,
  ShieldAlert,
  KeyRound,
  Copy,
  FileCheck,
  Check,
  X,
  Award,
  Sparkles,
  Loader2,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"

interface CBTDetailPageProps {
  id: string
}

export function CBTDetailPage({ id }: CBTDetailPageProps) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")

  // Token Management
  const [examToken, setExamToken] = useState<string | null>(null)
  const [isTokenLoading, setIsTokenLoading] = useState(false)

  // Action Dialog States
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [actionType, setActionType] = useState<"unlock" | "restart" | "force_submit" | "force_submit_all" | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Essay Grading & Review Dialog States
  const [isGradingOpen, setIsGradingOpen] = useState(false)
  const [isGradingLoading, setIsGradingLoading] = useState(false)
  const [isAiGrading, setIsAiGrading] = useState(false)
  const [aiFeedbacks, setAiFeedbacks] = useState<Record<number, string>>({})
  const [gradingData, setGradingData] = useState<any>(null)
  const [essayGrades, setEssayGrades] = useState<Record<number, number>>({})
  const [catatanGuru, setCatatanGuru] = useState("")
  const [isSavingGrade, setIsSavingGrade] = useState(false)

  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setIsRefreshing(true)
    try {
      const res = await fetch(`/api/exams/${id}/participants`)
      const json = await res.json()
      const payload = json.data || json
      if ((json.success || json.data) && (payload.exam || payload.participants)) {
        setData(payload)
        setExamToken(payload.exam?.token || null)
      } else {
        toast.error(json.error || json.message || "Gagal memuat data peserta")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh interval (every 10 seconds for live proctoring)
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      loadData(true)
    }, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadData])

  // Handle Token Generation & Removal
  async function handleGenerateToken(action: "generate" | "remove") {
    setIsTokenLoading(true)
    try {
      const res = await fetch(`/api/exams/${id}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (json.success || json.data) {
        const token = json.data?.token !== undefined ? json.data.token : (json.token ?? null)
        setExamToken(token)
        toast.success(json.message || "Token berhasil diperbarui")
      } else {
        toast.error(json.error || json.message || "Gagal memperbarui token")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setIsTokenLoading(false)
    }
  }

  function handleCopyToken() {
    if (!examToken) return
    navigator.clipboard.writeText(examToken)
    toast.success(`Token ${examToken} berhasil disalin ke clipboard`)
  }

  // Open Essay Grading / Answer Sheet
  async function openGrading(participantId: number) {
    setIsGradingOpen(true)
    setIsGradingLoading(true)
    setGradingData(null)
    setAiFeedbacks({})

    try {
      const res = await fetch(`/api/exams/${id}/participants/${participantId}`)
      const json = await res.json()
      const payload = json.data || json
      if ((json.success || json.data) && (payload.participant || payload.questions)) {
        setGradingData(payload)
        setCatatanGuru(payload.participant?.catatan_guru || "")

        // Initialize essay grades
        const initialGrades: Record<number, number> = {}
        payload.questions?.forEach((q: any) => {
          if (q.answer && q.answer.id) {
            initialGrades[q.answer.id] = q.answer.nilai !== null ? Number(q.answer.nilai) : 0
          }
        })
        setEssayGrades(initialGrades)
      } else {
        toast.error(json.error || json.message || "Gagal memuat lembar jawaban")
        setIsGradingOpen(false)
      }
    } catch (e) {
      toast.error("Gagal memuat lembar jawaban")
      setIsGradingOpen(false)
    } finally {
      setIsGradingLoading(false)
    }
  }

  // AI-Assisted Essay Grading
  async function handleAiGrade() {
    if (!gradingData?.participant?.id) return
    setIsAiGrading(true)
    try {
      const res = await fetch(`/api/exams/${id}/participants/${gradingData.participant.id}/ai-grade`, {
        method: "POST",
      })
      const json = await res.json()
      if (json.success && json.data) {
        const results = json.data.results || []
        if (results.length === 0) {
          toast.info(json.data.message || "Tidak ada soal esai untuk dikoreksi")
          return
        }

        const newGrades = { ...essayGrades }
        const newFeedbacks: Record<number, string> = {}
        let feedbackSummary = ""

        results.forEach((r: any) => {
          if (r.answer_id) {
            newGrades[r.answer_id] = r.skor
            newFeedbacks[r.answer_id] = r.alasan
            feedbackSummary += `• Soal (Bobot ${r.bobot}): Skor ${r.skor}/${r.bobot} — ${r.alasan}\n`
          }
        })

        setEssayGrades(newGrades)
        setAiFeedbacks(newFeedbacks)
        if (feedbackSummary && !catatanGuru) {
          setCatatanGuru(`[Evaluasi Koreksi AI]:\n${feedbackSummary}`)
        }
        toast.success(json.data.summary || "Rekomendasi skor AI berhasil dimuat!")
      } else {
        toast.error(json.error || "Gagal melakukan penilaian AI")
      }
    } catch (e) {
      toast.error("Terjadi gangguan koneksi ke layanan AI")
    } finally {
      setIsAiGrading(false)
    }
  }

  // Save Essay Grades
  async function handleSaveGrades() {
    if (!gradingData?.participant?.id) return
    setIsSavingGrade(true)

    try {
      const gradesPayload = Object.entries(essayGrades).map(([answerId, nilai]) => ({
        answer_id: Number(answerId),
        nilai: Number(nilai),
      }))

      const res = await fetch(`/api/exams/${id}/participants/${gradingData.participant.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grades: gradesPayload,
          catatan_guru: catatanGuru,
        }),
      })
      const json = await res.json()

      if (json.success) {
        toast.success("Penilaian berhasil disimpan & nilai akhir diperbarui!")
        setIsGradingOpen(false)
        await loadData(true)
      } else {
        toast.error(json.error || "Gagal menyimpan penilaian")
      }
    } catch (e) {
      toast.error("Terjadi gangguan koneksi")
    } finally {
      setIsSavingGrade(false)
    }
  }

  // Execute Proctor Actions
  async function handleExecuteAction() {
    if (!actionType) return
    setIsActionLoading(true)

    try {
      let payload: any = {}

      if (actionType === "force_submit_all") {
        payload = { action: "force_submit_all" }
      } else if (actionType === "force_submit") {
        payload = { action: "force_submit", participant_id: selectedParticipant?.id }
      } else if (actionType === "unlock") {
        payload = { action: "reset", participant_id: selectedParticipant?.id, type: "unlock" }
      } else if (actionType === "restart") {
        payload = { action: "reset", participant_id: selectedParticipant?.id, type: "restart" }
      }

      const res = await fetch(`/api/exams/${id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        toast.success(json.message || "Aksi berhasil dieksekusi")
        setActionType(null)
        setSelectedParticipant(null)
        await loadData(true)
      } else {
        toast.error(json.error || "Gagal mengeksekusi aksi")
      }
    } catch (error) {
      toast.error("Gagal menghubungi server")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Export CSV
  function handleExportCSV() {
    if (!data || !data.participants || data.participants.length === 0) {
      toast.error("Tidak ada data untuk diekspor")
      return
    }

    const exam = data.exam
    const totalSoal = data.total_soal || exam.paket_soal?._count?.items || 0
    const kkm = exam.kkm || 75

    const headers = [
      "No",
      "Nama Siswa",
      "NISN",
      "Kelas",
      "Status Ujian",
      "Soal Terjawab",
      "Benar",
      "Salah",
      "Nilai Akhir",
      "KKM",
      "Keterangan",
      "Jumlah Pelanggaran",
    ]

    const rows = filteredParticipants.map((p: any, idx: number) => {
      const studentName = p.student?.nama_lengkap || p.student?.user?.name || "Unknown"
      const nisn = p.student?.nisn || p.student?.nis || "-"
      const kelas = p.student?.kelas || exam.kelas || "-"
      const status = p.status
      const totalAnswers = p.answers?.length || 0
      const benar = p.answers?.filter((a: any) => a.is_correct).length || 0
      const salah = p.answers?.filter((a: any) => !a.is_correct && a.selected_option_id).length || 0
      const nilai = p.nilai_akhir !== null ? Math.round(Number(p.nilai_akhir)) : "-"
      const keterangan = p.nilai_akhir !== null ? (p.nilai_akhir >= kkm ? "LULUS" : "REMEDIAL") : "-"
      const violations = p.violation_count || 0

      return [
        idx + 1,
        `"${studentName.replace(/"/g, '""')}"`,
        `"${nisn}"`,
        `"${kelas}"`,
        `"${status}"`,
        `"${totalAnswers}/${totalSoal}"`,
        benar,
        salah,
        nilai,
        kkm,
        `"${keterangan}"`,
        violations,
      ].join(",")
    })

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `Rekap_Nilai_${exam.judul.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Rekap nilai berhasil diunduh (CSV)")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">Memuat Lembar Pengawasan CBT...</p>
      </div>
    )
  }

  if (!data || !data.exam) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail CBT" description="Ujian CBT tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/guru/cbt")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke CBT
        </Button>
      </div>
    )
  }

  const { exam, participants, total_soal } = data

  const totalSiswa = participants.length
  const belumMulaiCount = participants.filter((r: any) => r.status === "BELUM_MULAI").length
  const mengerjakanCount = participants.filter((r: any) => r.status === "MENGERJAKAN").length
  const selesaiCount = participants.filter((r: any) => r.status === "SELESAI").length
  const curangCount = participants.filter((r: any) => r.status === "CURANG").length

  const selesaiWithNilai = participants.filter((r: any) => r.nilai_akhir !== null)
  const rataNilai =
    selesaiWithNilai.length > 0
      ? selesaiWithNilai.reduce((acc: number, r: any) => acc + (r.nilai_akhir ?? 0), 0) / selesaiWithNilai.length
      : 0
  const lulusCount = selesaiWithNilai.filter((r: any) => r.nilai_akhir >= (exam.kkm || 75)).length
  const lulusPersen = selesaiWithNilai.length > 0 ? Math.round((lulusCount / selesaiWithNilai.length) * 100) : 0

  // Filter participants
  const filteredParticipants = participants.filter((p: any) => {
    const studentName = (p.student?.nama_lengkap || p.student?.user?.name || "").toLowerCase()
    const nisn = (p.student?.nisn || p.student?.nis || "").toLowerCase()
    const matchesSearch = !search || studentName.includes(search.toLowerCase()) || nisn.includes(search.toLowerCase())
    const matchesStatus = statusFilter === "semua" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const participantColumns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Siswa",
      render: (item: any) => {
        const studentName = item.student?.nama_lengkap || item.student?.user?.name || "Unknown"
        const nisn = item.student?.nisn || item.student?.nis || "—"
        const initials = String(studentName)
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        return (
          <div
            className={`flex items-center gap-3 ${item.id ? "cursor-pointer group" : ""}`}
            onClick={() => item.id && openGrading(item.id)}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                {studentName}
                {item.id && <FileCheck className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
              </p>
              <p className="text-xs text-muted-foreground">NISN: {nisn}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => {
        const statusMap: any = {
          BELUM_MULAI: { label: "Belum Mulai", color: "bg-muted text-muted-foreground" },
          MENGERJAKAN: { label: "Mengerjakan", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300" },
          SELESAI: { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300" },
          CURANG: { label: "Pelanggaran", color: "bg-destructive/15 text-destructive font-bold" },
        }
        const s = statusMap[item.status] || statusMap["BELUM_MULAI"]
        return <Badge className={`${s.color} text-xs font-medium`}>{s.label}</Badge>
      },
    },
    {
      key: "progres",
      header: "Progres Soal",
      render: (item: any) => {
        const answered = item.answers?.length || 0
        const total = total_soal || exam.paket_soal?._count?.items || 0
        const percent = total > 0 ? Math.round((answered / total) * 100) : 0
        return (
          <div className="space-y-1">
            <span className="text-xs font-semibold">
              {answered} / {total}
            </span>
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )
      },
    },
    {
      key: "benar_salah",
      header: "Benar / Salah",
      render: (item: any) => {
        if (item.status !== "SELESAI" && item.status !== "CURANG") {
          return <span className="text-xs text-muted-foreground">—</span>
        }
        const benar = item.answers?.filter((a: any) => a.is_correct).length || 0
        const salah = item.answers?.filter((a: any) => !a.is_correct && a.selected_option_id).length || 0
        return (
          <span className="text-xs font-medium">
            <span className="text-green-600 font-bold">{benar}</span> /{" "}
            <span className="text-red-500 font-bold">{salah}</span>
          </span>
        )
      },
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item: any) => {
        if (item.nilai_akhir === null) return <span className="text-muted-foreground text-xs">—</span>
        const nilai = Math.round(Number(item.nilai_akhir))
        const lulus = nilai >= (exam.kkm || 75)
        return (
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-extrabold ${lulus ? "text-green-600" : "text-destructive"}`}>
              {nilai}
            </span>
          </div>
        )
      },
    },
    {
      key: "pelanggaran",
      header: "Pelanggaran",
      render: (item: any) => {
        const count = item.violation_count || 0
        if (count === 0) return <span className="text-xs text-muted-foreground">0</span>
        return (
          <Badge className="bg-destructive/15 text-destructive font-bold text-xs">
            <ShieldAlert className="mr-1 h-3 w-3" />
            {count}x
          </Badge>
        )
      },
    },
    {
      key: "waktu",
      header: "Waktu",
      render: (item: any) => {
        if (!item.waktu_mulai) return <span className="text-muted-foreground text-xs">—</span>
        const start = new Date(item.waktu_mulai).getTime()
        const end = item.waktu_selesai ? new Date(item.waktu_selesai).getTime() : Date.now()
        const mins = Math.max(1, Math.round((end - start) / 60000))
        return <span className="text-xs text-muted-foreground">{mins} mnt</span>
      },
    },
    {
      key: "aksi",
      header: "Aksi Pengawas",
      render: (item: any) => {
        if (!item.id) {
          return <span className="text-xs text-muted-foreground italic">Belum login</span>
        }
        return (
          <div className="flex items-center gap-1.5">
            {item.status === "CURANG" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-semibold px-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                onClick={() => {
                  setSelectedParticipant(item)
                  setActionType("unlock")
                }}
                title="Buka kunci ujian siswa"
              >
                <Unlock className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                Buka Kunci
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Koreksi & Detail Lembar Jawaban */}
                <DropdownMenuItem onClick={() => openGrading(item.id)}>
                  <FileCheck className="mr-2 h-4 w-4 text-primary" />
                  Koreksi & Lembar Jawaban
                </DropdownMenuItem>

                {/* Unlock / Continue */}
                {(item.status === "CURANG" || item.status === "MENGERJAKAN") && (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedParticipant(item)
                      setActionType("unlock")
                    }}
                  >
                    <Unlock className="mr-2 h-4 w-4 text-emerald-600" />
                    Buka Kunci / Lanjutkan
                  </DropdownMenuItem>
                )}

                {/* Force Submit */}
                {item.status === "MENGERJAKAN" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedParticipant(item)
                      setActionType("force_submit")
                    }}
                  >
                    <StopCircle className="mr-2 h-4 w-4 text-amber-600" />
                    Paksa Selesai (Submit)
                  </DropdownMenuItem>
                )}

                {/* Complete Restart */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    setSelectedParticipant(item)
                    setActionType("restart")
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4 text-destructive" />
                  Reset Ulang Ujian
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={exam.judul}
        description={`Pengawasan & Evaluasi Ujian — Kelas ${exam.kelas || "Semua Kelas"}${
          exam.teaching_class?.guru_nama || exam.teaching_class?.teacher?.nama_lengkap || exam.paket_soal?.guru?.nama_lengkap
            ? ` • Guru: ${exam.teaching_class?.guru_nama || exam.teaching_class?.teacher?.nama_lengkap || exam.paket_soal?.guru?.nama_lengkap}`
            : ""
        }${exam.paket_soal?.mata_pelajaran ? ` • Mapel: ${exam.paket_soal.mata_pelajaran}` : ""}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/guru/cbt")}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Kembali
            </Button>
            {exam.paket_soal_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/guru/paket-soal/${exam.paket_soal_id}`)}
                className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-medium"
                title="Buka halaman paket soal untuk melihat dan mengubah bobot butir soal"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Atur Bobot Soal Paket</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "border-green-500 text-green-600 bg-green-500/10" : ""}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-muted"}`}
              />
              {autoRefresh ? "Live Monitor Aktif" : "Aktifkan Live Monitor"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadData()} disabled={isRefreshing}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {mengerjakanCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setActionType("force_submit_all")}
              >
                <StopCircle className="mr-1.5 h-4 w-4" />
                Selesaikan Semua ({mengerjakanCount})
              </Button>
            )}
            <Button size="sm" onClick={handleExportCSV} className="bg-primary text-white">
              <Download className="mr-1.5 h-4 w-4" />
              Export Rekap (CSV)
            </Button>
          </div>
        }
      />

      {/* Prominent Quick Token Bar */}
      <Card
        className={`border-2 transition-all ${
          examToken
            ? "border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm"
            : "border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background shadow-sm"
        }`}
      >
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                examToken ? "bg-primary text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"
              }`}
            >
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Token Ujian CBT:
                </span>
                {examToken ? (
                  <Badge className="bg-primary text-white font-mono text-base tracking-widest font-black px-3 py-0.5 shadow-sm">
                    {examToken}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-amber-700 dark:text-amber-300 border-amber-500/50 bg-amber-500/10 font-bold text-xs"
                  >
                    Belum Dirilis (Siswa Masuk Bebas)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {examToken
                  ? "Berikan token di atas kepada siswa di ruang ujian untuk mengonfirmasi dan membuka soal ujian CBT."
                  : "Token belum aktif. Siswa dapat langsung memulai ujian tanpa verifikasi token guru."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {examToken ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={handleCopyToken}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Salin Token
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => handleGenerateToken("generate")}
                  disabled={isTokenLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isTokenLoading ? "animate-spin" : ""}`} />
                  Ganti Token Baru
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleGenerateToken("remove")}
                  disabled={isTokenLoading}
                >
                  Nonaktifkan
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="h-8 text-xs font-bold gap-1.5 bg-primary text-white shadow-sm"
                onClick={() => handleGenerateToken("generate")}
                disabled={isTokenLoading}
              >
                <KeyRound className="h-3.5 w-3.5" />
                {isTokenLoading ? "Merilis Token..." : "Rilis Token Ujian Sekarang"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Proctoring Summary Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Total Siswa</p>
          <p className="text-2xl font-bold mt-1">{totalSiswa}</p>
        </Card>
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Belum Mulai</p>
          <p className="text-2xl font-bold mt-1 text-muted-foreground">{belumMulaiCount}</p>
        </Card>
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Sedang Ujian</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{mengerjakanCount}</p>
        </Card>
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Selesai</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{selesaiCount}</p>
        </Card>
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Pelanggaran</p>
          <p className="text-2xl font-bold mt-1 text-destructive">{curangCount}</p>
        </Card>
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Rata-rata Nilai</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-primary">{rataNilai.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({lulusPersen}% Lulus)</span>
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Table & Monitoring Area */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Daftar Pengawasan Peserta ({filteredParticipants.length})
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cari siswa atau NISN..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 h-8 text-xs"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 px-2.5 text-xs rounded-lg border bg-background text-foreground outline-none"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="BELUM_MULAI">Belum Mulai</option>
                    <option value="MENGERJAKAN">Sedang Mengerjakan</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="CURANG">Pelanggaran</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredParticipants as unknown as Record<string, unknown>[]}
                columns={participantColumns}
                emptyMessage="Tidak ada data peserta yang cocok dengan filter pencarian"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info, Token Management & Exam Rules */}
        <div className="space-y-4">
          {/* Token Ujian Management Card */}
          <Card className="border-primary/30 bg-primary/5 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Token Ujian Ruangan
                </CardTitle>
                {examToken ? (
                  <Badge className="bg-primary text-white text-[10px] font-mono">AKTIF</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">NONAKTIF</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {examToken ? (
                <div className="space-y-2 text-center">
                  <div className="p-3 rounded-lg border-2 border-primary/40 bg-card font-mono text-3xl font-black tracking-widest text-primary select-all shadow-xs">
                    {examToken}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={handleCopyToken}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Salin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => handleGenerateToken("generate")}
                      disabled={isTokenLoading}
                    >
                      <RefreshCw className={`mr-1 h-3 w-3 ${isTokenLoading ? "animate-spin" : ""}`} />
                      Ganti
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                      onClick={() => handleGenerateToken("remove")}
                      disabled={isTokenLoading}
                    >
                      Nonaktifkan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center py-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Token belum dirilis. Siswa dapat langsung mulai tanpa memasukkan token.
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-white text-xs font-semibold"
                    onClick={() => handleGenerateToken("generate")}
                    disabled={isTokenLoading}
                  >
                    <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                    {isTokenLoading ? "Merilis..." : "Rilis Token Ujian Sekarang"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Informasi Ujian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground">Paket Soal</p>
                <p className="font-semibold text-sm mt-0.5">{exam.paket_soal?.judul ?? "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Kelas</p>
                <p className="font-semibold text-sm mt-0.5">{exam.kelas || "Semua Kelas"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Durasi Pengerjaan</p>
                  <p className="font-semibold">{exam.durasi_menit || 60} Menit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Jadwal Pelaksanaan</p>
                  <p className="font-semibold">
                    {exam.waktu_mulai ? new Date(exam.waktu_mulai).toLocaleDateString("id-ID") : "—"} s/d{" "}
                    {exam.waktu_selesai ? new Date(exam.waktu_selesai).toLocaleDateString("id-ID") : "—"}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nilai KKM:</span>
                  <span className="font-bold">{exam.kkm || 75}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={exam.status === "PUBLISH" ? "bg-green-100 text-green-800" : "bg-muted"}>
                    {exam.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Aturan CBT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Acak Soal</span>
                <Badge variant={exam.acak_urutan_soal ? "default" : "outline"}>
                  {exam.acak_urutan_soal ? "Aktif" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Acak Pilihan Jawaban</span>
                <Badge variant={exam.acak_urutan_jawaban ? "default" : "outline"}>
                  {exam.acak_urutan_jawaban ? "Aktif" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tampilkan Nilai Langsung</span>
                <Badge variant={exam.tampilkan_nilai ? "default" : "outline"}>
                  {exam.tampilkan_nilai ? "Ya" : "Rahasia"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs for Proctor Actions */}
      <Dialog open={actionType !== null} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>
                  {actionType === "force_submit_all"
                    ? "Selesaikan Ujian Semua Siswa?"
                    : actionType === "force_submit"
                    ? "Paksa Selesai Ujian Siswa?"
                    : actionType === "unlock"
                    ? "Buka Kunci Ujian Siswa?"
                    : "Reset Ulang Ujian Siswa?"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "force_submit_all"
                    ? `Seluruh ${mengerjakanCount} siswa yang masih berstatus mengerjakan akan otomatis dikumpulkan dan dinilai sekarang.`
                    : actionType === "force_submit"
                    ? `Jawaban ${selectedParticipant?.student?.nama_lengkap || "siswa"} akan otomatis dikumpulkan dan dinilai saat ini.`
                    : actionType === "unlock"
                    ? `Pelanggaran akan dinolkan dan ${selectedParticipant?.student?.nama_lengkap || "siswa"} dapat langsung melanjutkan ujian.`
                    : `PERINGATAN: Seluruh jawaban yang telah diisi oleh ${selectedParticipant?.student?.nama_lengkap || "siswa"} akan dihapus total dan siswa memulai dari nomor 1.`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setActionType(null)} disabled={isActionLoading}>
              Batal
            </Button>
            <Button
              onClick={handleExecuteAction}
              disabled={isActionLoading}
              className={actionType === "restart" ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-primary text-white"}
            >
              {isActionLoading ? "Memproses..." : "Ya, Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Koreksi Manual Esai & Review Lembar Jawaban Siswa */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Lembar Jawaban: {gradingData?.participant?.nama_lengkap || "Siswa"}
                </DialogTitle>
                <DialogDescription className="text-xs mt-1">
                  NISN: {gradingData?.participant?.nisn || "—"} | Kelas: {gradingData?.participant?.kelas || "—"} | Status:{" "}
                  <span className="font-semibold">{gradingData?.participant?.status}</span>
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                {gradingData?.questions?.some((q: any) => q.tipe_soal === "ESAI") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAiGrade}
                    disabled={isAiGrading || isGradingLoading}
                    className="h-8 text-xs gap-1.5 border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300 font-semibold"
                  >
                    {isAiGrading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600" />
                        <span>Menganalisis Jawaban...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Koreksi Esai dengan AI</span>
                      </>
                    )}
                  </Button>
                )}
                {gradingData?.participant?.nilai_akhir !== null && (
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Nilai Akhir</span>
                    <span className="text-2xl font-black text-primary">
                      {Math.round(gradingData?.participant?.nilai_akhir)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Question & Answer List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isGradingLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs">Memuat lembar jawaban siswa...</p>
              </div>
            ) : gradingData?.questions?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Belum ada lembar jawaban yang diisi.
              </div>
            ) : (
              gradingData?.questions?.map((q: any) => {
                const isEssay = q.tipe_soal === "ESAI"
                const ans = q.answer
                const currentScore = ans?.id ? essayGrades[ans.id] ?? ans.nilai ?? 0 : 0

                return (
                  <div key={q.bank_soal_id} className="rounded-xl border p-5 bg-card space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary">Soal No. {q.number}</span>
                        <Badge variant="outline" className="text-xs">
                          {isEssay ? "Esai / Uraian" : "Pilihan Ganda"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-mono">
                          Bobot: {q.bobot} Poin
                        </Badge>
                      </div>

                      {/* Score Indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">Skor:</span>
                        <span className="text-sm font-bold text-foreground">
                          {currentScore} / {q.bobot}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{q.pertanyaan}</p>

                    {/* Answer Area */}
                    {isEssay ? (
                      <div className="space-y-3 pt-1">
                        <div className="p-3.5 rounded-lg border bg-muted/30 space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground block uppercase">
                            Jawaban Siswa:
                          </span>
                          <p className="text-sm font-normal text-foreground whitespace-pre-wrap">
                            {ans?.jawaban_esai || <span className="text-muted-foreground italic">Tidak dijawab</span>}
                          </p>
                        </div>

                        {/* Grading Controls for Essay */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border bg-primary/5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary">Beri Nilai Esai:</span>
                            <Input
                              type="number"
                              min={0}
                              max={q.bobot}
                              value={ans?.id ? essayGrades[ans.id] ?? 0 : 0}
                              onChange={(e) => {
                                if (ans?.id) {
                                  const val = Math.min(q.bobot, Math.max(0, Number(e.target.value)))
                                  setEssayGrades((prev) => ({ ...prev, [ans.id]: val }))
                                }
                              }}
                              className="w-20 h-8 text-center font-bold text-sm bg-background"
                            />
                            <span className="text-xs text-muted-foreground">/ {q.bobot}</span>
                          </div>

                          {/* Quick Score Buttons */}
                          {ans?.id && (
                            <div className="flex gap-1.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setEssayGrades((prev) => ({ ...prev, [ans.id]: q.bobot }))}
                              >
                                Penuh ({q.bobot})
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() =>
                                  setEssayGrades((prev) => ({ ...prev, [ans.id]: Math.round(q.bobot / 2) }))
                                }
                              >
                                Setengah ({Math.round(q.bobot / 2)})
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setEssayGrades((prev) => ({ ...prev, [ans.id]: 0 }))}
                              >
                                Nol (0)
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* AI Feedback Analysis Badge */}
                        {ans?.id && aiFeedbacks[ans.id] && (
                          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-purple-50/70 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200">
                            <Sparkles className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-[11px] text-purple-800 dark:text-purple-300">
                                Rekomendasi & Analisis Koreksi AI:
                              </span>
                              <p className="leading-relaxed">{aiFeedbacks[ans.id]}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Multiple Choice Review */
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg border bg-muted/30">
                            <span className="text-[10px] text-muted-foreground block font-bold uppercase">
                              Jawaban Siswa:
                            </span>
                            <span
                              className={`font-semibold flex items-center gap-1.5 mt-0.5 ${
                                ans?.is_correct ? "text-green-600 font-bold" : "text-destructive font-bold"
                              }`}
                            >
                              {ans?.is_correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                              {ans?.selected_option_teks || <span className="italic font-normal">Tidak dijawab</span>}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200">
                            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-bold uppercase">
                              Kunci Jawaban:
                            </span>
                            <span className="font-bold flex items-center gap-1.5 mt-0.5 text-emerald-700 dark:text-emerald-300">
                              <Check className="h-3.5 w-3.5" />
                              {q.correct_option?.teks || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}

            {/* Teacher Notes Area */}
            {gradingData && (
              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-bold text-foreground">Catatan / Evaluasi Guru untuk Siswa:</label>
                <textarea
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  placeholder="Tambahkan catatan atau masukan untuk siswa ini (opsional)..."
                  className="w-full p-3 rounded-lg border text-xs min-h-[70px] outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20 gap-2">
            <Button variant="outline" onClick={() => setIsGradingOpen(false)} disabled={isSavingGrade}>
              Tutup
            </Button>
            <Button
              onClick={handleSaveGrades}
              disabled={isSavingGrade || isGradingLoading}
              className="bg-primary text-white font-semibold"
            >
              <Award className="mr-1.5 h-4 w-4" />
              {isSavingGrade ? "Menyimpan..." : "Simpan Penilaian & Nilai Akhir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
