"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Siswa } from "@/features/siswa/types/siswa"

interface SiswaDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  siswa: Siswa | null
  onConfirm: () => void
  isLoading?: boolean
}

export function SiswaDeleteDialog({
  open,
  onOpenChange,
  siswa,
  onConfirm,
  isLoading = false,
}: SiswaDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Data Siswa</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data siswa{" "}
            <strong>{siswa?.nama_lengkap}</strong> (NIS: {siswa?.nis})?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
