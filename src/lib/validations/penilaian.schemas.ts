import { z } from "zod"

export const penilaianStatusSchema = z.enum(
  ["Belum Dinilai", "Sudah Dinilai", "Revisi"],
  { errorMap: () => ({ message: "Status penilaian tidak valid" }) }
)

export const penilaianUpdateSchema = z.object({
  nilai: z
    .number({ required_error: "Nilai wajib diisi" })
    .min(0, "Nilai minimal 0")
    .max(1000, "Nilai maksimal 1000")
    .nullable()
    .optional(),
  feedback: z
    .string()
    .max(2000, "Feedback maksimal 2000 karakter")
    .nullable()
    .optional(),
  status_penilaian: penilaianStatusSchema.default("Belum Dinilai"),
})
