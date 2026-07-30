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
import type { Guru } from "@/features/guru/types/guru"

interface GuruDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guru: Guru | null
  onConfirm: () => void
  isLoading?: boolean
}

export function GuruDeleteDialog({
  open,
  onOpenChange,
  guru,
  onConfirm,
  isLoading = false,
}: GuruDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Data Guru</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data guru{" "}
            <strong>{guru?.nama_lengkap}</strong> (NIP: {guru?.nip})?
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
