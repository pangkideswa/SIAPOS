export function isSafeStoragePath(path: string | undefined | null): boolean {
  if (!path) return false;
  // Deny path traversal, absolute paths, and encoded traversal
  if (path.startsWith('/')) return false;
  if (path.includes('../') || path.includes('..\\')) return false;
  if (path.includes('%2e%2e') || path.includes('%2E%2E')) return false;
  return true;
}

export function assertValidMaterialPath(path: string, materialId?: number): boolean {
  if (!isSafeStoragePath(path)) return false;
  
  if (materialId) {
    if (path.startsWith(`materials/${materialId}/`)) return true;
    if (path.startsWith(`materials/temp-`)) return true; // allow new temp uploads during update
    return false;
  }
  
  return path.startsWith(`materials/temp-`);
}

export function assertValidAssignmentPath(path: string, assignmentId?: number): boolean {
  if (!isSafeStoragePath(path)) return false;
  
  if (assignmentId) {
    if (path.startsWith(`assignments/${assignmentId}/`)) return true;
    if (path.startsWith(`assignments/temp-`)) return true;
    return false;
  }
  
  return path.startsWith(`assignments/temp-`);
}

export function assertValidSubmissionPath(path: string, studentId: number, assignmentId: number): boolean {
  if (!isSafeStoragePath(path)) return false;
  return path.startsWith(`submissions/${studentId}/${assignmentId}/`);
}

export function assertValidAvatarPath(path: string, role: 'teachers' | 'students', entityId?: number): boolean {
  if (!isSafeStoragePath(path)) return false;
  
  if (entityId) {
    return path.startsWith(`${role}/${entityId}/`) || path.startsWith(`${role}/temp-`);
  }
  return path.startsWith(`${role}/temp-`);
}

export function assertValidSettingsPath(path: string): boolean {
  if (!isSafeStoragePath(path)) return false;
  return path.startsWith(`settings/`);
}
