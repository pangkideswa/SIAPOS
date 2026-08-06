import { z } from "zod"

export const statusKehadiranSchema = z.enum(
  ["Hadir", "Izin", "Sakit", "Alpha", "Terlambat"],
  { errorMap: () => ({ message: "Status kehadiran tidak valid" }) }
)

export const statusSesiSchema = z.enum(
  ["Selesai", "Berlangsung", "Belum"],
  { errorMap: () => ({ message: "Status sesi tidak valid" }) }
)

export const attendanceSessionCreateSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jam_mulai: z.string().nullable().optional(),
  jam_selesai: z.string().nullable().optional(),
  mata_pelajaran: z.string().nullable().optional(),
  guru_nama: z.string().nullable().optional(),
  kelas: z.string().nullable().optional(),
  tahun_ajaran: z.string().nullable().optional(),
  semester: z.string().nullable().optional(),
  status: statusSesiSchema.default("Belum"),
})

export const attendanceSessionUpdateSchema =
  attendanceSessionCreateSchema.partial()

export const attendanceRecordItemSchema = z.object({
  student_id: z.number({ required_error: "Siswa wajib diisi" }),
  status: statusKehadiranSchema,
  keterangan: z.string().nullable().optional(),
})

export const attendanceBulkSaveSchema = z.object({
  records: z
    .array(attendanceRecordItemSchema)
    .min(1, "Minimal satu record absensi"),
})
