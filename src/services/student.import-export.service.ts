import "server-only"
import * as XLSX from "xlsx"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { studentService, type StudentFilters } from "./student.service"
import type { Prisma } from "@/generated/prisma/client"
import { AppError } from "@/lib/api-utils"

const importRowSchema = z.object({
  NIS: z.string().min(1, "NIS wajib diisi"),
  NISN: z.string().min(10, "NISN harus 10 digit").max(10),
  "Nama Lengkap": z.string().min(2, "Nama wajib diisi"),
  "Jenis Kelamin": z.enum(["Laki-laki", "Perempuan"]),
  "Tempat Lahir": z.string().optional(),
  "Tanggal Lahir": z.string().optional(), // YYYY-MM-DD
  Agama: z.string().optional(),
  Alamat: z.string().optional(),
  Jurusan: z.string().optional(),
  Kelas: z.string().optional(),
  "Tahun Masuk": z.string().optional(),
  "Tahun Ajaran": z.string().optional(),
  Status: z.enum(["Aktif", "Alumni", "Pindah", "Keluar"]).optional().default("Aktif"),
  "Nama Ayah": z.string().optional(),
  "Nama Ibu": z.string().optional(),
  "No HP Ortu": z.string().optional(),
  "Alamat Ortu": z.string().optional(),
})

export type ImportRow = z.infer<typeof importRowSchema>

export interface ImportValidationResult {
  total: number
  validCount: number
  errorCount: number
  rows: {
    rowIndex: number
    data: ImportRow | null
    errors: string[]
  }[]
}

export const studentImportExportService = {
  generateTemplate(): Buffer {
    const wb = XLSX.utils.book_new()

    // Sheet 1: DATA SISWA
    const headers = [
      "NIS",
      "NISN",
      "Nama Lengkap",
      "Jenis Kelamin",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Alamat",
      "Jurusan",
      "Kelas",
      "Tahun Masuk",
      "Tahun Ajaran",
      "Status",
      "Nama Ayah",
      "Nama Ibu",
      "No HP Ortu",
      "Alamat Ortu",
    ]

    const wsData = XLSX.utils.aoa_to_sheet([headers])
    XLSX.utils.book_append_sheet(wb, wsData, "DATA SISWA")

    // Sheet 2: PETUNJUK
    const wsPetunjuk = XLSX.utils.aoa_to_sheet([
      ["KOLOM", "WAJIB", "KETERANGAN", "CONTOH"],
      ["NIS", "Ya", "Nomor Induk Siswa", "10293"],
      ["NISN", "Ya", "Nomor Induk Siswa Nasional (10 digit)", "0012345678"],
      ["Nama Lengkap", "Ya", "Nama lengkap siswa", "Budi Santoso"],
      ["Jenis Kelamin", "Ya", "Laki-laki / Perempuan", "Laki-laki"],
      ["Tempat Lahir", "Tidak", "Kota tempat lahir", "Jakarta"],
      ["Tanggal Lahir", "Tidak", "Format: YYYY-MM-DD", "2006-05-14"],
      ["Agama", "Tidak", "Agama siswa", "Islam"],
      ["Alamat", "Tidak", "Alamat tempat tinggal", "Jl. Merdeka No.1"],
      ["Jurusan", "Tidak", "Kode jurusan (harus ada di master)", "TKJ"],
      ["Kelas", "Tidak", "Nama kelas (harus ada di master)", "X TKJ 1"],
      ["Tahun Masuk", "Tidak", "Tahun masuk siswa", "2023"],
      ["Tahun Ajaran", "Tidak", "Tahun ajaran masuk", "2023/2024"],
      ["Status", "Tidak", "Aktif / Alumni / Pindah / Keluar (Default: Aktif)", "Aktif"],
      ["Nama Ayah", "Tidak", "Nama ayah kandung", "Joko"],
      ["Nama Ibu", "Tidak", "Nama ibu kandung", "Siti"],
      ["No HP Ortu", "Tidak", "Nomor handphone orang tua", "081234567890"],
      ["Alamat Ortu", "Tidak", "Alamat orang tua", "Jl. Merdeka No.1"],
    ])
    // Set column widths
    wsPetunjuk["!cols"] = [{ wch: 15 }, { wch: 10 }, { wch: 45 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, wsPetunjuk, "PETUNJUK")

    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  },

  async exportToExcel(filters: StudentFilters): Promise<Buffer> {
    const data = await studentService.getAllPaginated({
      ...filters,
      page: 1,
      per_page: 100000, // all data
    })

    const headers = [
      "NIS",
      "NISN",
      "Nama Lengkap",
      "Jenis Kelamin",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Alamat",
      "Jurusan",
      "Kelas",
      "Tahun Masuk",
      "Tahun Ajaran",
      "Status",
      "Nama Ayah",
      "Nama Ibu",
      "No HP Ortu",
      "Alamat Ortu",
    ]

    const rows = data.data.map((s) => [
      s.nis,
      s.nisn,
      s.nama_lengkap,
      s.jenis_kelamin,
      s.tempat_lahir ?? "",
      s.tanggal_lahir ? s.tanggal_lahir.split("T")[0] : "",
      s.agama ?? "",
      s.alamat ?? "",
      s.jurusan_nama ?? "",
      s.kelas ?? "",
      s.tahun_masuk ?? "",
      s.tahun_ajaran ?? "",
      s.status,
      s.nama_ayah ?? "",
      s.nama_ibu ?? "",
      s.no_hp_ortu ?? "",
      s.alamat_ortu ?? "",
    ])

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    XLSX.utils.book_append_sheet(wb, ws, "DATA SISWA")

    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  },

  async validateImport(buffer: Buffer): Promise<ImportValidationResult> {
    const wb = XLSX.read(buffer, { type: "buffer" })
    const ws = wb.Sheets["DATA SISWA"]
    
    if (!ws) {
      throw new AppError("Sheet 'DATA SISWA' tidak ditemukan dalam file", 400)
    }

    const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" }) as Record<string, string>[]

    const result: ImportValidationResult = {
      total: rawData.length,
      validCount: 0,
      errorCount: 0,
      rows: [],
    }

    if (rawData.length === 0) {
      return result
    }

    // Ambil referensi dari DB sekali (bulk)
    const jurusans = await prisma.jurusan.findMany({ select: { id: true, code: true, name: true } })
    const classrooms = await prisma.classroom.findMany({ select: { id: true, name: true, major: true } })
    
    // Ambil data unique NIS dan NISN dari DB
    const extractCol = (col: string) => rawData.map(r => String(r[col] || "")).filter(Boolean)
    const nisList = extractCol("NIS")
    const nisnList = extractCol("NISN")

    const existingNis = await prisma.student.findMany({
      where: { nis: { in: nisList } },
      select: { nis: true },
    })
    const existingNisn = await prisma.student.findMany({
      where: { nisn: { in: nisnList } },
      select: { nisn: true },
    })

    const nisDbSet = new Set(existingNis.map((s) => s.nis))
    const nisnDbSet = new Set(existingNisn.map((s) => s.nisn))
    const nisFileSet = new Set<string>()
    const nisnFileSet = new Set<string>()

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      const rowIndex = i + 2 // Karena baris 1 adalah header di Excel
      const errors: string[] = []

      // Parsing dan cast to string
      const parsedData: Record<string, string> = {}
      for (const key in row) {
        parsedData[key] = String(row[key] || "").trim()
      }

      const validation = importRowSchema.safeParse(parsedData)
      
      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          errors.push(issue.message)
        })
      } else {
        const data = validation.data
        const nis = data.NIS
        const nisn = data.NISN
        
        // Cek duplicate NIS di DB
        if (nisDbSet.has(nis)) {
          errors.push(`NIS ${nis} sudah terdaftar di database`)
        }
        // Cek duplicate NIS di file yang sama
        if (nisFileSet.has(nis)) {
          errors.push(`NIS ${nis} duplikat dalam file`)
        }
        nisFileSet.add(nis)

        // Cek duplicate NISN di DB
        if (nisnDbSet.has(nisn)) {
          errors.push(`NISN ${nisn} sudah terdaftar di database`)
        }
        // Cek duplicate NISN di file yang sama
        if (nisnFileSet.has(nisn)) {
          errors.push(`NISN ${nisn} duplikat dalam file`)
        }
        nisnFileSet.add(nisn)

        // Cek referensi Jurusan
        if (data.Jurusan) {
          const matchedMajor = jurusans.find((j) => j.code.toLowerCase() === data.Jurusan?.toLowerCase())
          if (!matchedMajor) {
            errors.push(`Jurusan "${data.Jurusan}" tidak ditemukan`)
          }
        }

        // Cek referensi Kelas
        if (data.Kelas) {
          const matchedClass = classrooms.find((c) => c.name.toLowerCase() === data.Kelas?.toLowerCase())
          if (!matchedClass) {
            errors.push(`Kelas "${data.Kelas}" tidak ditemukan`)
          } else {
            // Jika jurusan juga diisi, pastikan jurusan dan kelas nyambung
            if (data.Jurusan) {
              const matchedMajor = jurusans.find((j) => j.code.toLowerCase() === data.Jurusan?.toLowerCase())
              if (matchedMajor && matchedClass.major && matchedClass.major.toLowerCase() !== matchedMajor.code.toLowerCase() && matchedClass.major.toLowerCase() !== matchedMajor.name.toLowerCase()) {
                errors.push(`Kelas "${data.Kelas}" memiliki jurusan "${matchedClass.major}" yang tidak sesuai dengan Jurusan "${data.Jurusan}"`)
              }
            }
          }
        }
        
        // Cek tanggal
        if (data["Tanggal Lahir"]) {
           if (isNaN(Date.parse(data["Tanggal Lahir"]))) {
              errors.push("Format Tanggal Lahir tidak valid (YYYY-MM-DD)")
           }
        }
      }

      if (errors.length > 0) {
        result.errorCount++
        result.rows.push({
          rowIndex,
          data: validation.success ? validation.data : null,
          errors,
        })
      } else {
        result.validCount++
        result.rows.push({
          rowIndex,
          data: validation.data as ImportRow,
          errors: [],
        })
      }
    }

    return result
  },

  async executeImport(validData: ImportRow[]): Promise<number> {
    const jurusans = await prisma.jurusan.findMany({ select: { id: true, code: true } })
    const classrooms = await prisma.classroom.findMany({ select: { id: true, name: true } })

    const insertData: Prisma.StudentCreateManyInput[] = validData.map((data) => {
      let jurusan_id: number | null = null
      if (data.Jurusan) {
        const j = jurusans.find((x) => x.code.toLowerCase() === data.Jurusan?.toLowerCase())
        if (j) jurusan_id = j.id
      }

      let classroom_id: number | null = null
      if (data.Kelas) {
        const c = classrooms.find((x) => x.name.toLowerCase() === data.Kelas?.toLowerCase())
        if (c) classroom_id = c.id
      }

      return {
        nis: data.NIS,
        nisn: data.NISN,
        nama_lengkap: data["Nama Lengkap"],
        jenis_kelamin: data["Jenis Kelamin"],
        tempat_lahir: data["Tempat Lahir"] || null,
        tanggal_lahir: data["Tanggal Lahir"] ? new Date(data["Tanggal Lahir"]) : null,
        agama: data.Agama || null,
        alamat: data.Alamat || null,
        jurusan_id,
        kelas: data.Kelas || null,
        classroom_id,
        tahun_masuk: data["Tahun Masuk"] || null,
        tahun_ajaran: data["Tahun Ajaran"] || null,
        status: data.Status || "Aktif",
        nama_ayah: data["Nama Ayah"] || null,
        nama_ibu: data["Nama Ibu"] || null,
        no_hp_ortu: data["No HP Ortu"] || null,
        alamat_ortu: data["Alamat Ortu"] || null,
      }
    })

    const created = await prisma.student.createMany({
      data: insertData,
      skipDuplicates: false,
    })

    return created.count
  },
}
