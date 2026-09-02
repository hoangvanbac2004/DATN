const STORAGE_PREFIX = 'taskflow_project_members_';

export interface MemberItemLike {
  userId?: string;
  email?: string;
  role?: string;
  fullName?: string;
  [key: string]: any;
}

/**
 * Lấy danh sách ID hoặc Email của các thành viên được gán vào Dự án cụ thể.
 */
export function getStoredProjectMemberIds(projectId: string): string[] {
  if (typeof window === 'undefined' || !projectId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse project members from localStorage:', e);
  }
  return [];
}

/**
 * Lưu danh sách thành viên của Dự án vào localStorage và bắn sự kiện cập nhật.
 */
export function saveStoredProjectMemberIds(projectId: string, memberIds: string[]): void {
  if (typeof window === 'undefined' || !projectId) return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, JSON.stringify(memberIds));
    window.dispatchEvent(new CustomEvent('project_members_updated', { detail: { projectId, memberIds } }));
  } catch (e) {
    console.error('Failed to save project members to localStorage:', e);
  }
}

/**
 * Thêm một thành viên (theo userId hoặc email) vào Dự án.
 */
export function addMemberToProject(projectId: string, userIdOrEmail: string): void {
  if (!projectId || !userIdOrEmail) return;
  const current = getStoredProjectMemberIds(projectId);
  const normalized = userIdOrEmail.trim().toLowerCase();
  
  const alreadyExists = current.some((id) => id.toLowerCase() === normalized);
  if (!alreadyExists) {
    const updated = [...current, userIdOrEmail.trim()];
    saveStoredProjectMemberIds(projectId, updated);
  }
}

/**
 * Xóa một thành viên khỏi Dự án.
 */
export function removeMemberFromProject(projectId: string, userIdOrEmail: string): void {
  if (!projectId || !userIdOrEmail) return;
  const current = getStoredProjectMemberIds(projectId);
  const normalized = userIdOrEmail.trim().toLowerCase();
  const updated = current.filter((id) => id.toLowerCase() !== normalized);
  saveStoredProjectMemberIds(projectId, updated);
}

/**
 * Kiểm tra xem một người dùng có thuộc về Dự án hay không.
 * - Admin và Manager mặc định có quyền trên toàn bộ các dự án.
 * - Nhân viên (Staff / Member) CHỈ có quyền nếu được mời / gán trực tiếp vào dự án đó.
 */
export function isUserInProject(
  projectId: string,
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): boolean {
  if (!user || !projectId) return false;

  // Admin và Manager có quyền giám sát tất cả dự án
  const isAdmin =
    user.roles?.includes('ROLE_ADMIN') ||
    user.email === 'admin@gmail.com' ||
    user.role === 'ADMIN' ||
    user.role === 'OWNER';
  const isManager =
    user.roles?.includes('ROLE_MANAGER') ||
    user.email === 'manager@gmail.com' ||
    user.role === 'MANAGER';

  if (isAdmin || isManager) return true;

  // Đối với Nhân viên thông thường: BẮT BUỘC phải có trong danh sách thành viên dự án
  const projectMembers = getStoredProjectMemberIds(projectId).map((m) => m.toLowerCase());
  const userEmail = user.email?.toLowerCase();
  const userId = user.id?.toLowerCase();

  return (
    (!!userEmail && projectMembers.includes(userEmail)) ||
    (!!userId && projectMembers.includes(userId))
  );
}

/**
 * Lọc danh sách thành viên có thể được phân công (Assignee) cho một dự án cụ thể:
 * - Giữ lại Admin & Manager (có thể nhận việc hoặc điều hành).
 * - Nhân viên chỉ hiển thị nếu thuộc về Dự án này.
 * - Nhân viên của Dự án khác sẽ bị LOẠI BỎ hoàn toàn khỏi danh sách lựa chọn!
 */
export function filterAssigneesForProject<T extends MemberItemLike>(
  allWorkspaceMembers: T[],
  projectId?: string
): T[] {
  if (!projectId) return allWorkspaceMembers;

  const projectMemberIds = getStoredProjectMemberIds(projectId).map((id) => id.toLowerCase());

  return allWorkspaceMembers.filter((m) => {
    const roleUpper = String(m.role || '').toUpperCase();
    // Admin & Manager được phép phân công trong mọi dự án
    if (
      roleUpper === 'ADMIN' ||
      roleUpper === 'OWNER' ||
      roleUpper === 'MANAGER' ||
      m.email?.toLowerCase() === 'admin@gmail.com' ||
      m.email?.toLowerCase() === 'manager@gmail.com'
    ) {
      return true;
    }

    // Nhân viên thông thường: Chỉ hiển thị nếu đã được mời vào dự án này
    const mEmail = m.email?.toLowerCase();
    const mUserId = m.userId?.toLowerCase();

    const isAssignedToThisProject =
      (!!mEmail && projectMemberIds.includes(mEmail)) ||
      (!!mUserId && projectMemberIds.includes(mUserId));

    return isAssignedToThisProject;
  });
}
