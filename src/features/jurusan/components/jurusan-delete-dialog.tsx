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
import type { Jurusan } from "@/features/jurusan/types/jurusan"

interface JurusanDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jurusan: Jurusan | null
  onConfirm: () => void
  isLoading?: boolean
}

export function JurusanDeleteDialog({
  open,
  onOpenChange,
  jurusan,
  onConfirm,
  isLoading = false,
}: JurusanDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Jurusan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus jurusan{" "}
            <strong>{jurusan?.name}</strong> ({jurusan?.code})? Tindakan ini
            tidak dapat dibatalkan.
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
