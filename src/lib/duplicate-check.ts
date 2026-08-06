import "server-only"
import { AppError } from "@/lib/api-utils"

type DuplicateLookup = (value: string) => Promise<{ id: number } | null>

/**
 * Ensures a field value (email, username, NIP, NISN, code, ...) is unique.
 * Skips when the value is empty or when the only match is `excludeId`
 * (used on update so the record can keep its own value).
 */
export async function assertUniqueField(
  lookup: DuplicateLookup,
  value: string | null | undefined,
  label: string,
  excludeId?: number
): Promise<void> {
  if (value === null || value === undefined || value === "") return
  const existing = await lookup(value)
  if (existing && existing.id !== excludeId) {
    throw new AppError(`${label} sudah digunakan`, 409)
  }
}
