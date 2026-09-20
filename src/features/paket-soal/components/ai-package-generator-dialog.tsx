"use client"

import { useState, useEffect } from "react"
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


const aiPackageSchema = z.object({
  nama_paket: z.string().min(3, "Nama paket minimal 3 karakter"),
  mata_pelajaran: z.string().min(1, "Mapel wajib dipilih"),
  tingkat: z.string().min(1, "Kelas/tingkat wajib diisi"),
  kurikulum: z.string().min(1, "Kurikulum wajib dipilih"),
  topik: z.string().min(5, "Topik materi minimal 5 karakter"),
  jumlah_soal: z.number().min(1).max(20, "Maksimal 20 soal"),
  tipe_soal: z.string().min(1, "Tipe soal wajib dipilih"),
})

type AIPackageValues = z.infer<typeof aiPackageSchema>

interface AIPackageGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AIPackageGeneratorDialog({ open, onOpenChange, onSuccess }: AIPackageGeneratorDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [subjects, setSubjects] = useState<{id: number, name: string}[]>([])
  const [classes, setClasses] = useState<{id: number, name: string}[]>([])

  useEffect(() => {
    async function fetchMasterData() {
      try {
        const [resSubjects, resClasses] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/classes")
        ])
        
        const [dataSubjects, dataClasses] = await Promise.all([
          resSubjects.json(),
          resClasses.json()
        ])

        if (dataSubjects.data) {
          const items = dataSubjects.data.data ? dataSubjects.data.data : dataSubjects.data
          setSubjects(items)
        }
        if (dataClasses.data) {
          const items = dataClasses.data.data ? dataClasses.data.data : dataClasses.data
          setClasses(items)
        }
      } catch (error) {
        console.error("Gagal memuat data master", error)
      }
    }
    fetchMasterData()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AIPackageValues>({
    resolver: zodResolver(aiPackageSchema),
    defaultValues: {
      nama_paket: "",
      mata_pelajaran: "",
      tingkat: "",
      kurikulum: "Kurikulum Merdeka",
      topik: "",
      jumlah_soal: 10,
      tipe_soal: "Pilihan Ganda",
    },
  })

  const formValues = watch()

  const onSubmit = async (data: AIPackageValues) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/exams/packages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat paket soal otomatis")
      }
      
      toast.success(result.message || `Paket soal "${data.nama_paket}" berhasil dibuat dengan ${data.jumlah_soal} soal!`)
      onSuccess()
      reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat paket soal otomatis. Silakan coba lagi.")
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
              <DialogTitle className="text-xl">AI Package Generator</DialogTitle>
              <DialogDescription>
                Buat paket soal ujian instan dengan bantuan AI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nama_paket">Nama Paket Soal <span className="text-destructive">*</span></Label>
            <Input
              id="nama_paket"
              placeholder="Cth: UTS Matematika Semester Ganjil"
              className={errors.nama_paket ? "border-destructive" : ""}
              {...register("nama_paket")}
            />
            {errors.nama_paket && <p className="text-xs text-destructive">{errors.nama_paket.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mata_pelajaran">Mata Pelajaran <span className="text-destructive">*</span></Label>
              <Select value={formValues.mata_pelajaran} onValueChange={(v) => setValue("mata_pelajaran", v || "")}>
                <SelectTrigger className={errors.mata_pelajaran ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih mapel..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length > 0 ? subjects.map((m) => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Memuat mapel...</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.mata_pelajaran && <p className="text-xs text-destructive">{errors.mata_pelajaran.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tingkat">Kelas / Tingkat <span className="text-destructive">*</span></Label>
              <Select value={formValues.tingkat} onValueChange={(v) => setValue("tingkat", v || "")}>
                <SelectTrigger className={errors.tingkat ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih kelas..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.length > 0 ? classes.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Memuat kelas...</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.tingkat && <p className="text-xs text-destructive">{errors.tingkat.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kurikulum">Kurikulum <span className="text-destructive">*</span></Label>
              <Select value={formValues.kurikulum} onValueChange={(v) => setValue("kurikulum", v || "")}>
                <SelectTrigger className={errors.kurikulum ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih kurikulum..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kurikulum Merdeka">Kurikulum Merdeka</SelectItem>
                  <SelectItem value="Kurikulum 2013">Kurikulum 2013</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              {errors.kurikulum && <p className="text-xs text-destructive">{errors.kurikulum.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipe_soal">Tipe Soal <span className="text-destructive">*</span></Label>
              <Select value={formValues.tipe_soal} onValueChange={(v) => setValue("tipe_soal", v || "")}>
                <SelectTrigger className={errors.tipe_soal ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih tipe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pilihan Ganda">Pilihan Ganda</SelectItem>
                  <SelectItem value="Isian Singkat">Isian Singkat</SelectItem>
                  <SelectItem value="Benar / Salah">Benar / Salah</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipe_soal && <p className="text-xs text-destructive">{errors.tipe_soal.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topik">Topik / Materi Pembahasan <span className="text-destructive">*</span></Label>
            <Textarea
              id="topik"
              placeholder="Cth: Aljabar Linier dan Persamaan Kuadrat..."
              className={`resize-none h-16 ${errors.topik ? "border-destructive" : ""}`}
              {...register("topik")}
            />
            {errors.topik && <p className="text-xs text-destructive">{errors.topik.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jumlah_soal">Jumlah Soal <span className="text-destructive">*</span></Label>
              <span className="text-sm font-medium">{formValues.jumlah_soal} Soal</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-600"
              {...register("jumlah_soal", { valueAsNumber: true })}
            />
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
                  Merakit Paket...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Buat Paket Otomatis
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
