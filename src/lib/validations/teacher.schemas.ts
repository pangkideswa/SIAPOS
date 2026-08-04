import { z } from "zod"

export const teacherSchema = z.object({
  foto: z.string().nullable().optional(),
  nama_lengkap: z
    .string({ required_error: "Nama lengkap wajib diisi" })
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(255, "Nama lengkap maksimal 255 karakter"),
  nip: z
    .string({ required_error: "NIP wajib diisi" })
    .min(3, "NIP minimal 3 karakter")
    .max(18, "NIP maksimal 18 karakter"),
  nuptk: z
    .string()
    .max(16, "NUPTK maksimal 16 karakter")
    .nullable()
    .optional(),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    errorMap: () => ({ message: "Jenis kelamin tidak valid" }),
  }),
  tempat_lahir: z
    .string()
    .max(255, "Tempat lahir maksimal 255 karakter")
    .nullable()
    .optional(),
  tanggal_lahir: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Format tanggal lahir tidak valid",
    })
    .nullable()
    .optional(),
  no_hp: z
    .string()
    .max(15, "No. HP maksimal 15 karakter")
    .nullable()
    .optional(),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  alamat: z.string().max(500, "Alamat maksimal 500 karakter").nullable().optional(),
  pendidikan_terakhir: z
    .string()
    .max(50, "Pendidikan terakhir maksimal 50 karakter")
    .nullable()
    .optional(),
  status_kepegawaian: z.enum(["PNS", "PPPK", "Honorer"], {
    errorMap: () => ({ message: "Status kepegawaian tidak valid" }),
  }),
  mata_pelajaran: z
    .array(z.string().min(1, "Nama mata pelajaran tidak boleh kosong"))
    .max(20, "Maksimal 20 mata pelajaran")
    .default([]),
})
export type TeacherInput = z.infer<typeof teacherSchema>
