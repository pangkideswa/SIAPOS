import * as XLSX from "xlsx"

export async function exportAbsensiToExcel(filters: {
  kelas?: string
  mata_pelajaran?: string
  tanggal_mulai?: string
  tanggal_selesai?: string
}, filename: string = "Rekap_Absensi") {
  try {
    const params = new URLSearchParams()
    if (filters.kelas && filters.kelas !== "all") params.append("kelas", filters.kelas)
    if (filters.mata_pelajaran && filters.mata_pelajaran !== "all") params.append("mata_pelajaran", filters.mata_pelajaran)
    if (filters.tanggal_mulai) params.append("tanggal_mulai", filters.tanggal_mulai)
    if (filters.tanggal_selesai) params.append("tanggal_selesai", filters.tanggal_selesai)

    const response = await fetch(`/api/attendance/export?${params.toString()}`)
    const { data } = await response.json()

    if (!data || data.length === 0) {
      throw new Error("Tidak ada data untuk diexport")
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi")

    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`)
    return true
  } catch (error) {
    console.error("Export failed:", error)
    throw error
  }
}
