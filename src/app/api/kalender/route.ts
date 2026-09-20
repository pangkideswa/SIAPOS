import "server-only"
import { NextRequest } from "next/server"
import { ok, created, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru", "siswa", "wali")
    const events = await prisma.kalenderEvent.findMany({
      orderBy: { tanggal_mulai: "asc" }
    })
    
    // Map to format expected by UI
    const mapped = events.map(e => ({
      id: e.id,
      nama_event: e.nama_event,
      deskripsi: e.deskripsi || "",
      kategori: e.kategori,
      tanggal_mulai: e.tanggal_mulai.toISOString().split("T")[0],
      tanggal_selesai: e.tanggal_selesai.toISOString().split("T")[0],
      tahun_ajaran: e.tahun_ajaran || "",
      semester: e.semester || "",
      status: e.status,
      created_at: e.created_at.toISOString(),
      updated_at: e.updated_at.toISOString()
    }))

    return ok(mapped)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin")
    const body = await request.json()
    
    const newEvent = await prisma.kalenderEvent.create({
      data: {
        nama_event: body.nama_event,
        deskripsi: body.deskripsi,
        kategori: body.kategori,
        tanggal_mulai: new Date(body.tanggal_mulai),
        tanggal_selesai: new Date(body.tanggal_selesai),
        tahun_ajaran: body.tahun_ajaran,
        semester: body.semester,
        status: body.status || "Aktif"
      }
    })

    return created({
      ...newEvent,
      tanggal_mulai: newEvent.tanggal_mulai.toISOString().split("T")[0],
      tanggal_selesai: newEvent.tanggal_selesai.toISOString().split("T")[0],
    }, "Event berhasil dibuat")
  } catch (error) {
    return apiError(error)
  }
}
