import { z } from "zod"

export const notifikasiTipeSchema = z.enum(
  ["materi", "tugas", "penilaian", "pengumuman", "sistem"],
  { errorMap: () => ({ message: "Tipe notifikasi tidak valid" }) }
)

export const notifikasiSchema = z.object({
  tipe: notifikasiTipeSchema,
  judul: z
    .string({ required_error: "Judul notifikasi wajib diisi" })
    .min(1, "Judul notifikasi wajib diisi")
    .max(255, "Judul notifikasi maksimal 255 karakter"),
  pesan: z
    .string({ required_error: "Pesan notifikasi wajib diisi" })
    .min(1, "Pesan notifikasi wajib diisi")
    .max(1000, "Pesan notifikasi maksimal 1000 karakter"),
  href: z.string().max(255, "Tautan maksimal 255 karakter").optional(),
  target_roles: z
    .array(
      z.enum(["super_admin", "admin", "guru", "siswa", "wali"], {
        errorMap: () => ({ message: "Target role tidak valid" }),
      })
    )
    .min(1, "Minimal satu target role"),
})

export const notifikasiReadAllSchema = z.object({
  ids: z.array(z.number().int().positive()).optional(),
})

export type NotifikasiInput = z.infer<typeof notifikasiSchema>
