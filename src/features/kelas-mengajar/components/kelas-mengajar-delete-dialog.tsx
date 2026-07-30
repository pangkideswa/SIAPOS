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
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasMengajarDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: KelasMengajar | null
  onConfirm: () => void
  isLoading?: boolean
}

export function KelasMengajarDeleteDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading = false,
}: KelasMengajarDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Kelas Mengajar</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus kelas mengajar{" "}
            <strong>{item?.mata_pelajaran}</strong> untuk kelas{" "}
            <strong>{item?.kelas}</strong>? Tindakan ini tidak dapat dibatalkan.
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
