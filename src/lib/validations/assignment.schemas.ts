import { z } from "zod"

export const assignmentStatusSchema = z.enum(
  ["Draft", "Dipublikasikan", "Ditutup"],
  { errorMap: () => ({ message: "Status tugas tidak valid" }) }
)

const datetimeString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Format tanggal tidak valid",
  })

export const assignmentSchema = z.object({
  judul: z
    .string({ required_error: "Judul tugas wajib diisi" })
    .min(2, "Judul tugas minimal 2 karakter")
    .max(255, "Judul tugas maksimal 255 karakter"),
  deskripsi: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  kelas_mengajar_id: z.number().int("Kelas mengajar tidak valid").optional(),
  guru_nama: z.string().max(255, "Nama guru maksimal 255 karakter").optional(),
  mata_pelajaran: z
    .string()
    .max(255, "Mata pelajaran maksimal 255 karakter")
    .optional(),
  kelas: z.string().max(50, "Kelas maksimal 50 karakter").optional(),
  lampiran: z.array(z.record(z.string(), z.unknown())).default([]),
  tanggal_dibuka: datetimeString.optional(),
  tenggat_waktu: datetimeString.optional(),
  tenggat_jam: z.string().max(5, "Jam maksimal 5 karakter").nullable().optional(),
  nilai_maksimal: z
    .number({ required_error: "Nilai maksimal wajib diisi" })
    .int("Nilai maksimal harus bilangan bulat")
    .min(1, "Nilai maksimal minimal 1")
    .max(1000, "Nilai maksimal maksimal 1000"),
  status: assignmentStatusSchema,
})
export type AssignmentInput = z.infer<typeof assignmentSchema>

export const assignmentStatusUpdateSchema = z.object({
  status: assignmentStatusSchema,
})
