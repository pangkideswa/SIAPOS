"use client"

import { useState, useRef } from "react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, FileText, CheckCircle2, Eye, EyeOff, X } from "lucide-react"

interface PaketSoalPrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paket: any
  items: any[]
}

export function PaketSoalPrintDialog({
  open,
  onOpenChange,
  paket,
  items,
}: PaketSoalPrintDialogProps) {
  const [includeKey, setIncludeKey] = useState(false)
  const [includeHeader, setIncludeHeader] = useState(true)

  if (!paket) return null

  const guruNama = paket.guru?.nama_lengkap || paket.guru_nama || "Guru Pengampu"
  const totalBobot = items.reduce((sum, it) => sum + (Number(it.bobot) || 0), 0)

  function handlePrint() {
    window.print()
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-4xl max-h-[92vh] flex flex-col">
        <ResponsiveDialogHeader className="print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <ResponsiveDialogTitle className="text-xl flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                Cetak Naskah Soal & Arsip Ujian
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Pratinjau naskah soal dalam format A4 standar penilaian. Siap dicetak fisik atau disimpan sebagai PDF.
              </ResponsiveDialogDescription>
            </div>
          </div>
        </ResponsiveDialogHeader>

        {/* Toolbar Controls (Hidden during printing) */}
        <div className="px-4 py-2.5 bg-muted/50 border-y border-border flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">Mode Tampilan:</span>
            <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
              <button
                type="button"
                onClick={() => setIncludeKey(false)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  !includeKey
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Naskah Siswa (Tanpa Kunci)
              </button>
              <button
                type="button"
                onClick={() => setIncludeKey(true)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  includeKey
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Master Guru (Dengan Kunci & Bobot)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border"
              />
              <span>Sertakan KOP Ujian</span>
            </label>
            <Badge variant="outline" className="font-mono">
              {items.length} Soal • {Math.round(totalBobot)} Poin
            </Badge>
          </div>
        </div>

        {/* Printable Paper Content */}
        <ResponsiveDialogBody className="overflow-y-auto px-4 sm:px-8 py-6 bg-slate-100/60 dark:bg-slate-950/40">
          <div
            id="printable-sheet"
            className="max-w-[780px] mx-auto bg-white dark:bg-card text-black dark:text-foreground p-8 sm:p-12 shadow-md rounded-lg border border-slate-200 dark:border-border text-sm leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none"
          >
            {/* KOP Penilaian Ujian */}
            {includeHeader && (
              <div className="pb-4 mb-6">
                {/* Header with Logo SIAPOS & Formal Institution Info */}
                <div className="flex items-center justify-between gap-4">
                  {/* Left Logo */}
                  <div className="shrink-0 flex items-center justify-center">
                    <img
                      src="/favicon.png"
                      alt="Logo SIAPOS"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm print:drop-shadow-none print:w-20 print:h-20"
                    />
                  </div>

                  {/* Center Text */}
                  <div className="flex-1 text-center space-y-0.5">
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-muted-foreground">
                      SISTEM INFORMASI ADMINISTRASI & PEMBELAJARAN ONLINE SEKOLAH
                    </p>
                    <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-foreground">
                      SIAPOS EDUCATION OPERATING SYSTEM
                    </h2>
                    <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-foreground pt-0.5">
                      Naskah Penilaian / Ujian Berbasis Komputer (CBT)
                    </h1>
                    <p className="text-[11px] text-muted-foreground italic">
                      Platform Asesmen & Arsip Bank Soal Kurikulum Terpadu
                    </p>
                  </div>

                  {/* Right Spacer for balanced centering */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:flex items-center justify-center opacity-0 pointer-events-none print:flex print:w-20 print:h-20"
                    aria-hidden="true"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20" />
                  </div>
                </div>

                {/* Formal Double Border Divider (KOP Resmi Standar Sekolah) */}
                <div className="border-b-[3px] border-double border-slate-900 dark:border-foreground/80 mt-3 mb-4 print:border-black" />

                <div className="grid grid-cols-2 text-left text-xs gap-y-1.5 gap-x-6 p-3 bg-slate-50/80 dark:bg-muted/20 rounded-md border border-slate-200 dark:border-border print:bg-transparent print:border-slate-300">
                  <div>
                    <span className="font-semibold text-muted-foreground">Mata Pelajaran:</span>{" "}
                    <strong className="text-foreground">{paket.mata_pelajaran}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Alokasi Waktu:</span>{" "}
                    <strong className="text-foreground">{paket.durasi_menit || 60} Menit</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Guru Pengampu:</span>{" "}
                    <strong className="text-foreground">{guruNama}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Kode Paket:</span>{" "}
                    <strong className="text-foreground font-mono">{paket.kode_paket}</strong>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-slate-50 dark:bg-muted/30 rounded border border-slate-200 dark:border-border text-left text-[11px] text-muted-foreground space-y-0.5 print:bg-transparent print:border-slate-300">
                  <p className="font-bold text-foreground">PETUNJUK UMUM:</p>
                  <ol className="list-decimal list-inside space-y-0.5 pl-1">
                    <li>Berdoalah sebelum mulai mengerjakan soal.</li>
                    <li>Periksa dan bacalah setiap butir soal dengan teliti sebelum menjawab.</li>
                    <li>
                      Untuk soal Pilihan Ganda, pilihlah satu jawaban yang paling tepat. Untuk soal Esai, jawablah dengan singkat, jelas, dan runtut.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {items.map((it, idx) => {
                const soal = it.bank_soal
                const isPG =
                  soal?.tipe_soal === "PILIHAN_GANDA" ||
                  soal?.tipe_soal === "Pilihan Ganda" ||
                  soal?.tipe_soal === "BENAR_SALAH" ||
                  soal?.tipe_soal === "Benar / Salah"

                let options = soal?.options || []
                if (options.length === 0 && soal?.pilihan) {
                  try {
                    const p = typeof soal.pilihan === "string" ? JSON.parse(soal.pilihan) : soal.pilihan
                    options = Object.entries(p).map(([k, v]) => ({
                      teks: String(v),
                      is_correct: k === soal.jawaban_benar || String(v) === soal.jawaban_benar,
                    }))
                  } catch (e) {}
                }

                const correctIndex = options.findIndex((o: any) => o.is_correct)
                const correctLetter = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : ""
                const correctOpt = correctIndex >= 0 ? options[correctIndex] : null

                return (
                  <div key={it.id || idx} className="space-y-2 page-break-inside-avoid">
                    {/* Question text & weight */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-sm shrink-0 w-6 text-right">
                          {idx + 1}.
                        </span>
                        <div className="flex-1 text-sm font-medium whitespace-pre-wrap leading-relaxed">
                          {soal?.pertanyaan}
                        </div>
                      </div>
                      {includeKey && (
                        <span className="shrink-0 text-[11px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border">
                          [{it.bobot} pt]
                        </span>
                      )}
                    </div>

                    {/* Options if Multiple Choice */}
                    {isPG && options.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                          {options.map((opt: any, optIdx: number) => {
                            const letter = String.fromCharCode(65 + optIdx)
                            const isCorrect = opt.is_correct
                            return (
                              <div
                                key={opt.id || optIdx}
                                className={`flex items-start gap-2 p-1.5 rounded ${
                                  includeKey && isCorrect
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300"
                                    : "text-foreground"
                                }`}
                              >
                                <span className="font-bold w-4">{letter}.</span>
                                <span className="flex-1">{opt.teks}</span>
                                {includeKey && isCorrect && (
                                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                                    ✓ Kunci
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Explicit Master Key line */}
                        {includeKey && (
                          <div className="pl-8 pt-0.5">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 text-xs font-bold border border-emerald-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                              <span>
                                Kunci Jawaban: {correctLetter ? `${correctLetter}. ` : ""}{correctOpt?.teks || soal?.jawaban_benar || "—"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Essay answer sheet lines if Essay mode */}
                    {!isPG && (
                      <div className="pl-8 pt-1">
                        {includeKey ? (
                          <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
                            <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
                              Kunci Jawaban / Rubrik Penilaian:
                            </span>
                            <p className="text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                              {correctOpt?.teks || soal?.pembahasan || soal?.jawaban_benar || "Jawaban sesuai penalaran dan pemahaman konsep siswa."}
                            </p>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 dark:border-border rounded p-3 h-20 text-[11px] text-muted-foreground italic">
                            Lembar jawaban esai siswa...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer Signature Box for Master Document */}
            {includeKey && (
              <div className="mt-12 pt-6 border-t border-slate-300 dark:border-border grid grid-cols-2 text-center text-xs text-muted-foreground page-break-inside-avoid">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold text-foreground mt-0.5">Wakil Kepala Bidang Kurikulum</p>
                  <div className="h-16" />
                  <p className="font-semibold text-foreground underline">( ............................................ )</p>
                </div>
                <div>
                  <p>Disusun oleh,</p>
                  <p className="font-bold text-foreground mt-0.5">Guru Pengampu Mata Pelajaran</p>
                  <div className="h-16" />
                  <p className="font-semibold text-foreground underline">{guruNama}</p>
                </div>
              </div>
            )}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter className="print:hidden px-4 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Tips: Gunakan opsi <strong>"Save as PDF"</strong> di dialog print untuk menyimpan file PDF naskah.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-initial text-xs"
            >
              Tutup
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial text-xs bg-primary text-white gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak / Simpan PDF
            </Button>
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
