"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileDown, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ImportValidationResult, ImportRow } from "@/services/student.import-export.service"

interface SiswaImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SiswaImportDialog({ open, onOpenChange }: SiswaImportDialogProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null)

  const handleDownloadTemplate = () => {
    window.location.href = "/api/students/template"
  }

  const resetState = () => {
    setValidationResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const res = await axios.post("/api/students/import/validate", formData)
      return res.data as ImportValidationResult
    },
    onSuccess: (data) => {
      setValidationResult(data)
      toast.success("Validasi selesai")
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Gagal memvalidasi file"
      toast.error(msg)
      resetState()
    },
  })

  const executeMutation = useMutation({
    mutationFn: async (validData: ImportRow[]) => {
      const res = await axios.post("/api/students/import/execute", validData)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message || "Import berhasil")
      queryClient.invalidateQueries({ queryKey: ["students"] })
      onOpenChange(false)
      resetState()
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Gagal mengimpor data"
      toast.error(msg)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateMutation.mutate(selectedFile)
    }
  }

  const handleConfirm = () => {
    if (!validationResult) return
    if (validationResult.errorCount > 0) {
      toast.error("Tidak dapat import. Harap perbaiki baris yang error.")
      return
    }
    const validData = validationResult.rows.map(r => r.data).filter(Boolean) as ImportRow[]
    executeMutation.mutate(validData)
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      resetState()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Data Siswa</DialogTitle>
          <DialogDescription>
            Upload file Excel (.xlsx) sesuai dengan template yang disediakan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {!validationResult && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50 gap-4">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Pilih file Excel untuk diupload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hanya menerima file .xlsx
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
                disabled={validateMutation.isPending}
              />
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadTemplate}
                  disabled={validateMutation.isPending}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={validateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {validateMutation.isPending ? "Memvalidasi..." : "Pilih File"}
                </Button>
              </div>
            </div>
          )}

          {validationResult && (
            <div className="flex flex-col h-full gap-4 overflow-hidden">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-card">
                  <p className="text-sm text-muted-foreground">Total Baris</p>
                  <p className="text-2xl font-bold">{validationResult.total}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                  <p className="text-sm text-green-600 dark:text-green-400">Data Valid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {validationResult.validCount}
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                  <p className="text-sm text-destructive">Data Error</p>
                  <p className="text-2xl font-bold text-destructive">
                    {validationResult.errorCount}
                  </p>
                </div>
              </div>

              {validationResult.errorCount > 0 && (
                <div className="p-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-md flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>
                    Terdapat {validationResult.errorCount} baris yang memiliki error. 
                    Anda harus memperbaiki file Excel terlebih dahulu dan upload ulang, 
                    atau semua data harus valid sebelum di-import.
                  </p>
                </div>
              )}

              <div className="flex-1 border rounded-md overflow-auto max-h-[400px]">
                <div className="p-4 space-y-4">
                  {validationResult.rows.map((row, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 border rounded-md flex items-start gap-3 ${
                        row.errors.length > 0 ? "bg-destructive/5 border-destructive/20" : "bg-card"
                      }`}
                    >
                      <div className="mt-0.5">
                        {row.errors.length > 0 ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">
                            Baris {row.rowIndex}: {row.data?.["Nama Lengkap"] || row.data?.NIS || "Data tidak lengkap"}
                          </p>
                        </div>
                        {row.errors.length > 0 ? (
                          <ul className="text-sm text-destructive list-disc list-inside space-y-0.5">
                            {row.errors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Valid</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => handleClose(false)}
            disabled={executeMutation.isPending}
          >
            Batal
          </Button>
          {validationResult && (
            <Button
              variant="outline"
              onClick={resetState}
              disabled={executeMutation.isPending}
            >
              Upload Ulang
            </Button>
          )}
          <Button 
            onClick={handleConfirm}
            disabled={
              !validationResult || 
              validationResult.errorCount > 0 || 
              validationResult.total === 0 ||
              executeMutation.isPending
            }
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {executeMutation.isPending ? "Menyimpan..." : "Konfirmasi Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
