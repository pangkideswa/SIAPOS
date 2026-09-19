import "server-only"
import { NextRequest } from "next/server"
import { materialService } from "@/services/material.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { materialSchema } from "@/lib/validations/material.schemas"
import {
  allowedTeachingClassIdsFor,
  assertTeachingClassAccess,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { MateriFormData } from "@/features/materi/types/materi"
import { assertValidMaterialPath } from "@/lib/storage/path-validator"
import { deleteMaterialFileIfStorage } from "@/lib/storage/material-helper"

export async function GET() {
  try {
    const user = await requireApiUser()
    const materials = await materialService.getAll()
const allowedIds = await allowedTeachingClassIdsFor(user)

const scoped = materials
  .filter(
    (item) =>
      item.kelas_mengajar_id &&
      allowedIds.has(item.kelas_mengajar_id)
  )
  .filter(
    (item) =>
      user.role !== "siswa" || item.status === "Publish"
  )
    let finalMaterials = isAdmin(user) ? materials : scoped

    if (user.role === "siswa") {
      const student = await import("@/lib/prisma").then(m => m.prisma.student.findUnique({
        where: { user_id: user.id },
      }))
      
      if (student) {
        const reads = await import("@/lib/prisma").then(m => m.prisma.materialRead.findMany({
          where: { student_id: student.id },
          select: { material_id: true }
        }))
        const readIds = new Set(reads.map(r => r.material_id))
        
        finalMaterials = finalMaterials.map(m => ({
          ...m,
          is_read: readIds.has(m.id)
        }))
      }
    }

    return ok(finalMaterials)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(materialSchema, await request.json()) as unknown as MateriFormData
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    
    // Validate storage paths if provided
    
    if (body.thumbnail_url && !body.thumbnail_url.startsWith('http')) {
       if (!assertValidMaterialPath(body.thumbnail_url)) {
          return apiError(new Error("Invalid thumbnail storage path"), 400)
       }
    }
    
    if (body.lampiran && Array.isArray(body.lampiran)) {
       for (const lamp of body.lampiran) {
          if (lamp.storage_path && !assertValidMaterialPath(lamp.storage_path)) {
             return apiError(new Error(`Invalid storage path for ${lamp.nama}`), 400)
          }
       }
    }

    try {
      const material = await materialService.create(body)
      return created(material, "Materi berhasil ditambahkan")
    } catch (dbError) {
      // Orphan cleanup on DB failure
      if (body.thumbnail_url && !body.thumbnail_url.startsWith('http')) {
         await deleteMaterialFileIfStorage(body.thumbnail_url)
      }
      if (body.lampiran && Array.isArray(body.lampiran)) {
         for (const lamp of body.lampiran) {
            if (lamp.storage_path) {
               await deleteMaterialFileIfStorage(lamp.storage_path)
            }
         }
      }
      throw dbError; // Rethrow to outer catch
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memproses materi"
    return apiError(msg ? new Error(msg) : error, 422)
  }
}

