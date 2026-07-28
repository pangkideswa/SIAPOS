"use client"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import type { CBTExam } from "../types/cbt"

interface CBTDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: CBTExam | null
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function CBTDeleteDialog({
  open, onOpenChange, item, onConfirm, isLoading = false,
}: CBTDeleteDialogProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Hapus CBT</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus ujian CBT ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm font-medium">{item.nama_ujian}</p>
          <p className="text-xs text-muted-foreground mt-1">{item.kelas} — {item.durasi} menit</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Batal</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
