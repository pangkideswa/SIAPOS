import "server-only"
import { type Subject } from "@/generated/prisma/client"
import { subjectRepository } from "@/repositories/subject.repository"
import type { Subject as SubjectType, PaginatedResponse } from "@/types"

export interface SubjectCreateInput {
  name: string
  description?: string | null
  is_active?: boolean
}

export interface SubjectFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

function toSubject(row: Subject): SubjectType {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export const subjectService = {
  async getAll(
    filters: SubjectFilters = {}
  ): Promise<PaginatedResponse<SubjectType>> {
    const per_page = filters.per_page ?? 1000
    const page = filters.page ?? 1

    const where = {
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { description: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(filters.is_active !== undefined
        ? { is_active: filters.is_active }
        : {}),
    }

    const [rows, total] = await Promise.all([
      subjectRepository.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      subjectRepository.count(where),
    ])

    return {
      data: rows.map(toSubject),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<SubjectType | null> {
    const row = await subjectRepository.findById(id)
    return row ? toSubject(row) : null
  },

  async create(data: SubjectCreateInput): Promise<SubjectType> {
    const row = await subjectRepository.create({
      name: data.name,
      description: data.description ?? null,
      is_active: data.is_active ?? true,
    })
    return toSubject(row)
  },

  async update(id: number, data: SubjectCreateInput): Promise<SubjectType | null> {
    const row = await subjectRepository.update(id, {
      name: data.name,
      description: data.description ?? null,
      is_active: data.is_active ?? true,
    })
    return row ? toSubject(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await subjectRepository.delete(id)
    return true
  },
}
