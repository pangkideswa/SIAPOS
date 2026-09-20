import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser("super_admin", "admin")
    const body = await request.json()
    const eventId = Number(id)
    
    const updatedEvent = await prisma.kalenderEvent.update({
      where: { id: eventId },
      data: {
        nama_event: body.nama_event,
        deskripsi: body.deskripsi,
        kategori: body.kategori,
        tanggal_mulai: new Date(body.tanggal_mulai),
        tanggal_selesai: new Date(body.tanggal_selesai),
        tahun_ajaran: body.tahun_ajaran,
        semester: body.semester,
        status: body.status
      }
    })

    return ok({
      ...updatedEvent,
      tanggal_mulai: updatedEvent.tanggal_mulai.toISOString().split("T")[0],
      tanggal_selesai: updatedEvent.tanggal_selesai.toISOString().split("T")[0],
    }, "Event berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser("super_admin", "admin")
    const eventId = Number(id)
    
    await prisma.kalenderEvent.delete({
      where: { id: eventId }
    })

    return ok({ success: true }, "Event berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
