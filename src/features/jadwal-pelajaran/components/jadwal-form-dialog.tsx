import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field-error"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { scheduleSchema, type ScheduleInput } from "@/lib/validations/schedule.schemas"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useCreateSchedule, useUpdateSchedule } from "@/hooks/use-schedules"
import { HARI_OPTIONS } from "@/features/jadwal-pelajaran/constants/jadwal-pelajaran.constants"
import type { JadwalPelajaran } from "../types/jadwal-pelajaran"

interface JadwalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: JadwalPelajaran | null
  onSuccess: () => void
}

export function JadwalFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: JadwalFormDialogProps) {
  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = useMemo(() => classesData?.data ?? [], [classesData])
  const { data: teachers } = useTeachers()
  const { data: subjectsData } = useSubjects({ per_page: 200 })
  const subjects = subjectsData?.data ?? []

  const createMutation = useCreateSchedule()
  const updateMutation = useUpdateSchedule()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      hari: "Senin",
      jam_mulai: "",
      jam_selesai: "",
      kelas_id: 0,
      mata_pelajaran: "",
      guru: "",
      guru_id: 0,
      ruang: "",
    },
  })

  useEffect(() => {
    if (editingItem) {
      const classId = classes.find((c) => c.name === editingItem.kelas)?.id ?? 0
      const guruId = teachers?.find((t) => t.nama_lengkap === editingItem.guru_nama)?.id ?? 0
      
      reset({
        hari: editingItem.hari as ScheduleInput["hari"],
        jam_mulai: editingItem.jam_mulai,
        jam_selesai: editingItem.jam_selesai,
        kelas_id: classId,
        mata_pelajaran: editingItem.mata_pelajaran,
        guru: editingItem.guru_nama,
        guru_id: guruId,
        ruang: editingItem.ruang,
      })
    } else {
      reset({
        hari: "Senin",
        jam_mulai: "",
        jam_selesai: "",
        kelas_id: 0,
        mata_pelajaran: "",
        guru: "",
        guru_id: 0,
        ruang: "",
      })
    }
  }, [editingItem, reset, open, classes, teachers])

  const isLoading = createMutation.isPending || updateMutation.isPending

  async function onSubmit(data: ScheduleInput) {
    const selectedClass = classes.find((c) => c.id === data.kelas_id)
    const selectedTeacher = teachers?.find((t) => t.id === data.guru_id)
    
    const payload = {
      ...data,
      kelas: selectedClass?.name ?? "",
      guru_nama: selectedTeacher?.nama_lengkap ?? "",
      status: "Aktif",
    }

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  const hariValue = watch("hari")
  const kelasIdValue = watch("kelas_id")
  const mataPelajaranValue = watch("mata_pelajaran")
  const guruIdValue = watch("guru_id")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Jadwal Pelajaran" : "Tambah Jadwal Pelajaran"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hari</Label>
              <Select
                value={hariValue}
                onValueChange={(val) => setValue("hari", val as ScheduleInput["hari"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {HARI_OPTIONS.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.hari?.message} />
            </div>
            
            <div className="space-y-2">
              <Label>Ruang (Opsional)</Label>
              <Input placeholder="Misal: R.101" {...register("ruang")} />
              <FieldError message={errors.ruang?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jam Mulai</Label>
              <Input type="time" {...register("jam_mulai")} />
              <FieldError message={errors.jam_mulai?.message} />
            </div>
            
            <div className="space-y-2">
              <Label>Jam Selesai</Label>
              <Input type="time" {...register("jam_selesai")} />
              <FieldError message={errors.jam_selesai?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kelas</Label>
            <Select
              value={kelasIdValue ? String(kelasIdValue) : undefined}
              onValueChange={(val) => setValue("kelas_id", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.kelas_id?.message} />
          </div>

          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Select
              value={mataPelajaranValue}
              onValueChange={(val) => setValue("mata_pelajaran", val ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.mata_pelajaran?.message} />
          </div>

          <div className="space-y-2">
            <Label>Guru</Label>
            <Select
              value={guruIdValue ? String(guruIdValue) : undefined}
              onValueChange={(val) => setValue("guru_id", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih guru" />
              </SelectTrigger>
              <SelectContent>
                {teachers?.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.nama_lengkap}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.guru_id?.message} />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
