import { z } from "zod"

export const scheduleDaySchema = z.enum(
  ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
  { errorMap: () => ({ message: "Hari tidak valid" }) }
)

export const scheduleSchema = z.object({
  hari: scheduleDaySchema,
  jam_mulai: z
    .string({ required_error: "Jam mulai wajib diisi" })
    .regex(/^\d{2}:\d{2}$/, "Format jam mulai harus HH:mm"),
  jam_selesai: z
    .string({ required_error: "Jam selesai wajib diisi" })
    .regex(/^\d{2}:\d{2}$/, "Format jam selesai harus HH:mm"),
  kelas_id: z.number().int("Kelas tidak valid").positive("Kelas tidak valid"),
  mata_pelajaran: z
    .string({ required_error: "Mata pelajaran wajib diisi" })
    .min(1, "Mata pelajaran wajib diisi")
    .max(255, "Mata pelajaran maksimal 255 karakter"),
  guru: z
    .string()
    .max(255, "Nama guru maksimal 255 karakter")
    .nullable()
    .optional(),
  guru_id: z.number().int("Guru tidak valid").nullable().optional(),
  ruang: z.string().max(50, "Ruang maksimal 50 karakter").nullable().optional(),
})
export type ScheduleInput = z.infer<typeof scheduleSchema>
