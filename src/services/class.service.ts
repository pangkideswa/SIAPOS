import "server-only"
import { type Classroom } from "@/generated/prisma/client"
import { classroomRepository } from "@/repositories/classroom.repository"
import type { SchoolClass, PaginatedResponse } from "@/types"

export type ClassroomCreateInput = Pick<
  SchoolClass,
  "name" | "major" | "grade_level" | "homeroom_teacher_id"
>

export interface ClassroomFilters {
  search?: string
  grade_level?: string
  page?: number
  per_page?: number
}

function toClass(row: Classroom): SchoolClass {
  return {
    id: row.id,
    name: row.name,
    major: row.major ?? "",
    grade_level: row.grade_level ?? "",
    homeroom_teacher_id: row.homeroom_teacher_id,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export const classService = {
  async getAll(
    filters: ClassroomFilters = {}
  ): Promise<PaginatedResponse<SchoolClass>> {
    const per_page = filters.per_page ?? 1000
    const page = filters.page ?? 1

    const where = {
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { major: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(filters.grade_level ? { grade_level: filters.grade_level } : {}),
    }

    const [rows, total] = await Promise.all([
      classroomRepository.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      classroomRepository.count(where),
    ])

    return {
      data: rows.map(toClass),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<SchoolClass | null> {
    const row = await classroomRepository.findById(id)
    return row ? toClass(row) : null
  },

  async create(data: ClassroomCreateInput): Promise<SchoolClass> {
    const row = await classroomRepository.create({
      name: data.name,
      major: data.major ?? null,
      grade_level: data.grade_level ?? null,
      homeroom_teacher_id: data.homeroom_teacher_id ?? null,
    })
    return toClass(row)
  },

  async update(id: number, data: ClassroomCreateInput): Promise<SchoolClass | null> {
    const row = await classroomRepository.update(id, {
      name: data.name,
      major: data.major ?? null,
      grade_level: data.grade_level ?? null,
      homeroom_teacher_id: data.homeroom_teacher_id ?? null,
    })
    return row ? toClass(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await classroomRepository.delete(id)
    return true
  },
}
