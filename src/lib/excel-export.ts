import * as XLSX from "xlsx"

export function exportToExcel<T>(data: T[], fileName: string, sheetName: string = "Sheet1") {
  if (!data || data.length === 0) {
    throw new Error("Tidak ada data untuk diekspor")
  }

  // Membuat lembar kerja (worksheet) baru dari array of objects JSON
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Membuat buku kerja (workbook) baru
  const workbook = XLSX.utils.book_new()

  // Memasukkan lembar kerja ke buku kerja
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Mengunduh file
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
