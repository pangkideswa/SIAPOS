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
import type { Materi } from "@/features/materi/types/materi"

interface MateriDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Materi | null
  onConfirm: () => void
  isLoading?: boolean
}

export function MateriDeleteDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading = false,
}: MateriDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Materi</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus materi{" "}
            <strong>{item?.judul}</strong>? Tindakan ini tidak dapat dibatalkan.
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
