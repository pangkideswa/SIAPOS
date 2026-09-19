"use client"

import { useState, useRef } from "react"
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, UploadCloud, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImportAIDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ImportAIDialog({ open, onOpenChange, onSuccess }: ImportAIDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Only accept PDF and DOCX for now
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error("Format file tidak didukung. Harap unggah PDF atau DOCX.")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.")
      return
    }
    
    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    try {
      // Simulate file upload
      await new Promise(r => setTimeout(r, 1000))
      setIsUploading(false)
      
      // Simulate AI Processing
      setIsProcessing(true)
      await new Promise(r => setTimeout(r, 3500))
      
      toast.success("Dokumen berhasil di-parsing oleh AI. 25 soal ditambahkan!")
      
      // Clean up
      setSelectedFile(null)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses dokumen.")
    } finally {
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const resetState = () => {
    if (!isProcessing && !isUploading) {
      setSelectedFile(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Import Dokumen Soal</DialogTitle>
              <DialogDescription>
                Unggah PDF atau Word (DOCX). AI akan mengekstrak soal otomatis.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!selectedFile && !isProcessing ? (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center p-8 mt-2 border-2 border-dashed rounded-xl transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleChange}
              />
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                <UploadCloud className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Klik atau seret file ke sini</h3>
              <p className="text-xs text-muted-foreground text-center max-w-[250px]">
                Mendukung dokumen PDF dan DOCX (Maks. 10MB)
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-6"
                onClick={() => inputRef.current?.click()}
              >
                Pilih File
              </Button>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <svg className="absolute inset-0 w-16 h-16 animate-spin" viewBox="0 0 100 100">
                  <circle
                    className="opacity-100 stroke-blue-600"
                    strokeWidth="8"
                    strokeDasharray="100"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    fill="none"
                    cx="50"
                    cy="50"
                    r="40"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold animate-pulse text-blue-600">AI Sedang Membaca Dokumen...</h3>
                <p className="text-xs text-muted-foreground mt-1">Mengekstrak pertanyaan dan pilihan jawaban</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center p-4 border rounded-xl bg-card">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile?.size || 0) / 1024 / 1024 < 1 
                    ? Math.round((selectedFile?.size || 0) / 1024) + " KB" 
                    : ((selectedFile?.size || 0) / 1024 / 1024).toFixed(2) + " MB"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          {!isProcessing && (
            <>
              <Button variant="outline" onClick={resetState} disabled={isUploading}>
                Batal
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedFile || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mulai Ekstrak
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
