import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  TeachingClass,
  User,
  Teacher,
  Subject,
  Classroom,
  Prisma,
} from "@/generated/prisma/client"

export type TeachingClassCreateData = Prisma.TeachingClassUncheckedCreateInput
export type TeachingClassUpdateData = Prisma.TeachingClassUncheckedUpdateInput
export type TeachingClassWhere = Prisma.TeachingClassWhereInput
export type TeachingClassFindManyArgs = Prisma.TeachingClassFindManyArgs

const ASSIGNMENT_INCLUDE = {
  teacher: {
    select: { id: true, nama_lengkap: true, email: true, nip: true },
  },
  subject: {
    select: { id: true, name: true, description: true, is_active: true },
  },
  classroom: {
    select: { id: true, name: true, major: true, grade_level: true },
  },
} as const

export const teachingClassRepository = {
  async findAll(): Promise<TeachingClass[]> {
    return prisma.teachingClass.findMany({
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<TeachingClass | null> {
    return prisma.teachingClass.findUnique({ where: { id } })
  },

  async findMany(args: TeachingClassFindManyArgs): Promise<TeachingClass[]> {
    return prisma.teachingClass.findMany(args)
  },

  async findWithRelations(
    args: TeachingClassFindManyArgs = {}
  ): Promise<TeachingClass[]> {
    return prisma.teachingClass.findMany({
      ...args,
      include: ASSIGNMENT_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async create(data: TeachingClassCreateData): Promise<TeachingClass> {
    return prisma.teachingClass.create({ data })
  },

  async createWithRelations(data: TeachingClassCreateData): Promise<TeachingClass> {
    return prisma.teachingClass.create({
      data,
      include: ASSIGNMENT_INCLUDE,
    })
  },

  async update(
    id: number,
    data: TeachingClassUpdateData
  ): Promise<TeachingClass | null> {
    return prisma.teachingClass.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.teachingClass.delete({ where: { id } })
  },
}

export interface TeachingClassAssignmentContext {
  user: User | null
  teacher: Teacher | null
  subject: Subject | null
  classroom: Classroom | null
}

export const teachingClassAssignmentRepository = {
  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  async getTeacherByUserId(userId: number): Promise<Teacher | null> {
    return prisma.teacher.findFirst({ where: { user_id: userId } })
  },

  async getSubjectById(id: number): Promise<Subject | null> {
    return prisma.subject.findUnique({ where: { id } })
  },

  async getClassroomById(id: number): Promise<Classroom | null> {
    return prisma.classroom.findUnique({ where: { id } })
  },
}
