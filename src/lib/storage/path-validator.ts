export function isSafeStoragePath(path: string | undefined | null): boolean {
  if (!path) return false;
  // Deny path traversal, absolute paths, and encoded traversal
  if (path.startsWith('/')) return false;
  if (path.includes('../') || path.includes('..\\')) return false;
  if (path.includes('%2e%2e') || path.includes('%2E%2E')) return false;
  return true;
}

export function assertValidMaterialPath(path: string, materialId?: number): boolean {
  return isSafeStoragePath(path);
}

export function assertValidAssignmentPath(path: string, assignmentId?: number): boolean {
  return isSafeStoragePath(path);
}

export function assertValidSubmissionPath(path: string, studentId: number, assignmentId: number): boolean {
  return isSafeStoragePath(path);
}

export function assertValidAvatarPath(path: string, type: 'teachers' | 'students', id?: number): boolean {
  return isSafeStoragePath(path);
}

export function assertValidSettingsPath(path: string): boolean {
  return isSafeStoragePath(path);
}
