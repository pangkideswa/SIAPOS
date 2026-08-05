import { z } from "zod"

export const nilaiScoreSchema = z.object({
  tugas: z
    .number()
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100")
    .nullable()
    .optional(),
  praktik: z
    .number()
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100")
    .nullable()
    .optional(),
  uts: z
    .number()
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100")
    .nullable()
    .optional(),
  uas: z
    .number()
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100")
    .nullable()
    .optional(),
})

export const nilaiUpdateSchema = nilaiScoreSchema.extend({
  semester: z.string({ required_error: "Semester wajib diisi" }),
  tahun_ajaran: z.string().nullable().optional(),
  keterangan: z.string().nullable().optional(),
})

export const nilaiCreateSchema = nilaiUpdateSchema.extend({
  student_id: z
    .number({ required_error: "ID siswa wajib diisi" })
    .int("ID siswa tidak valid")
    .positive("ID siswa tidak valid"),
  teaching_class_id: z
    .number({ required_error: "ID kelas mengajar wajib diisi" })
    .int("ID kelas mengajar tidak valid")
    .positive("ID kelas mengajar tidak valid"),
})
