import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRemoveSchedule } from "@/hooks/use-schedules"
import type { JadwalPelajaran } from "../types/jadwal-pelajaran"

interface JadwalDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: JadwalPelajaran | null
  onSuccess: () => void
}

export function JadwalDeleteDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: JadwalDeleteDialogProps) {
  const removeMutation = useRemoveSchedule()

  async function onConfirm() {
    if (!item) return
    try {
      await removeMutation.mutateAsync(item.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Jadwal?"
      description={`Apakah Anda yakin ingin menghapus jadwal ${item?.mata_pelajaran} untuk kelas ${item?.kelas}? Tindakan ini tidak dapat dibatalkan.`}
      onConfirm={onConfirm}
      isLoading={removeMutation.isPending}
    />
  )
}
