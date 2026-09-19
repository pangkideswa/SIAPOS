"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sparkles, Loader2, Bot } from "lucide-react"
import { toast } from "sonner"
import { MATA_PELAJARAN_OPTIONS } from "@/features/bank-soal/constants/bank-soal.constants"

const aiTugasSchema = z.object({
  judul_tugas: z.string().min(3, "Judul tugas minimal 3 karakter"),
  mata_pelajaran: z.string().min(1, "Mapel wajib dipilih"),
  kelas: z.string().min(1, "Kelas wajib diisi"),
  topik: z.string().min(5, "Topik materi minimal 5 karakter"),
  tipe_tugas: z.string().min(1, "Tipe tugas wajib dipilih"),
})

type AITugasValues = z.infer<typeof aiTugasSchema>

interface AITugasGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AITugasGeneratorDialog({ open, onOpenChange, onSuccess }: AITugasGeneratorDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AITugasValues>({
    resolver: zodResolver(aiTugasSchema),
    defaultValues: {
      judul_tugas: "",
      mata_pelajaran: "",
      kelas: "",
      topik: "",
      tipe_tugas: "Essay Singkat",
    },
  })

  const formValues = watch()

  const onSubmit = async (data: AITugasValues) => {
    setIsGenerating(true)
    try {
      // TODO: Panggil API backend untuk men-generate instruksi dan rubrik tugas dengan AI
      await new Promise(resolve => setTimeout(resolve, 3500))
      
      toast.success(`Tugas "${data.judul_tugas}" berhasil dibuat beserta rubrik penilaian!`)
      onSuccess()
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error("Gagal membuat tugas otomatis. Silakan coba lagi.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
              <Bot className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">AI Assignment Generator</DialogTitle>
              <DialogDescription>
                Buat deskripsi tugas dan rubrik penilaian otomatis dengan AI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="judul_tugas">Judul Tugas <span className="text-destructive">*</span></Label>
            <Input
              id="judul_tugas"
              placeholder="Cth: Laporan Penelitian Biologi"
              className={errors.judul_tugas ? "border-destructive" : ""}
              {...register("judul_tugas")}
            />
            {errors.judul_tugas && <p className="text-xs text-destructive">{errors.judul_tugas.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mata_pelajaran">Mata Pelajaran <span className="text-destructive">*</span></Label>
              <Select value={formValues.mata_pelajaran} onValueChange={(v) => setValue("mata_pelajaran", v || "")}>
                <SelectTrigger className={errors.mata_pelajaran ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih mapel..." />
                </SelectTrigger>
                <SelectContent>
                  {MATA_PELAJARAN_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mata_pelajaran && <p className="text-xs text-destructive">{errors.mata_pelajaran.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kelas">Kelas <span className="text-destructive">*</span></Label>
              <Input
                id="kelas"
                placeholder="Cth: Kelas X IPA 1"
                className={errors.kelas ? "border-destructive" : ""}
                {...register("kelas")}
              />
              {errors.kelas && <p className="text-xs text-destructive">{errors.kelas.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipe_tugas">Tipe Tugas <span className="text-destructive">*</span></Label>
            <Select value={formValues.tipe_tugas} onValueChange={(v) => setValue("tipe_tugas", v || "")}>
              <SelectTrigger className={errors.tipe_tugas ? "border-destructive" : ""}>
                <SelectValue placeholder="Pilih tipe tugas..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Essay Singkat">Essay Singkat</SelectItem>
                <SelectItem value="Makalah / Laporan">Makalah / Laporan</SelectItem>
                <SelectItem value="Proyek Kelompok">Proyek Kelompok</SelectItem>
                <SelectItem value="Tugas Praktik">Tugas Praktik</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipe_tugas && <p className="text-xs text-destructive">{errors.tipe_tugas.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="topik">Topik / Materi Pembahasan <span className="text-destructive">*</span></Label>
            <Textarea
              id="topik"
              placeholder="Cth: Dampak Pemanasan Global terhadap Ekosistem Laut..."
              className={`resize-none h-20 ${errors.topik ? "border-destructive" : ""}`}
              {...register("topik")}
            />
            {errors.topik ? (
              <p className="text-xs text-destructive">{errors.topik.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Deskripsikan materi tugas sedetail mungkin agar instruksi yang di-generate lebih relevan.</p>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis Topik...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Buat Tugas Otomatis
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
