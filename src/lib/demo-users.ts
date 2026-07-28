import type { User } from "@/types/auth"

export interface DemoAccount extends User {
  password: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 1,
    name: "Administrator SIAPOS",
    email: "admin@siapos.id",
    password: "Admin123!",
    role: "admin",
    username: "admin",
    nip: "198501012010011001",
    created_at: "2026-01-15T08:00:00.000Z",
    updated_at: "2026-07-01T10:30:00.000Z",
  },
  {
    id: 2,
    name: "Siti Nurhaliza, S.Pd.",
    email: "guru@siapos.id",
    password: "Guru123!",
    role: "guru",
    username: "guru",
    nip: "199005152015022001",
    created_at: "2026-01-15T08:00:00.000Z",
    updated_at: "2026-07-01T10:30:00.000Z",
  },
  {
    id: 3,
    name: "Ahmad Rizki Pratama",
    email: "siswa@siapos.id",
    password: "Siswa123!",
    role: "siswa",
    username: "siswa",
    nisn: "0081234567",
    created_at: "2026-01-15T08:00:00.000Z",
    updated_at: "2026-07-01T10:30:00.000Z",
  },
]

export function findDemoUser(identifier: string, password: string): User | null {
  const account = DEMO_ACCOUNTS.find(
    (a) =>
      (a.email.toLowerCase() === identifier.toLowerCase() ||
        a.username?.toLowerCase() === identifier.toLowerCase()) &&
      a.password === password
  )
  if (!account) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = account
  return user
}

export function findDemoUserByEmail(email: string): User | null {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  )
  if (!account) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = account
  return user
}
