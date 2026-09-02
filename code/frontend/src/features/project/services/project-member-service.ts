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
export function addMemberToProject(
  projectId: string,
  userIdOrEmail: string
): void {
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
 * Kiểm tra xem một người dùng có thuộc về Dự án hay không:
 * - Admin và Manager mặc định có quyền trên toàn bộ các dự án trong Không gian làm việc.
 * - Nhân viên (Staff / Member): BẮT BUỘC phải được mời / phân công vào dự án đó mới được xem và làm việc.
 */
export function isUserInProject(
  projectId: string,
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): boolean {
  if (!user || !projectId) return false;

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

  const projectMembers = getStoredProjectMemberIds(projectId).map((m) => m.toLowerCase());
  const userEmail = user.email?.toLowerCase();
  const userId = user.id?.toLowerCase();

  return (
    (!!userEmail && projectMembers.includes(userEmail)) ||
    (!!userId && projectMembers.includes(userId))
  );
}

/**
 * Lấy vai trò của người dùng trong Dự án:
 * - Admin: 'ADMIN'
 * - Manager: 'MANAGER' (Luôn có đầy đủ quyền Quản lý dự án, duyệt việc, tạo sprint)
 * - Nhân viên: Nếu thuộc dự án -> 'MEMBER', ngược lại -> 'NONE'
 */
export function getUserProjectRole(
  projectId: string,
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): 'ADMIN' | 'MANAGER' | 'MEMBER' | 'NONE' {
  if (!user || !projectId) return 'NONE';

  const isAdmin =
    user.roles?.includes('ROLE_ADMIN') ||
    user.email === 'admin@gmail.com' ||
    user.role === 'ADMIN' ||
    user.role === 'OWNER';
  if (isAdmin) return 'ADMIN';

  const isManager =
    user.roles?.includes('ROLE_MANAGER') ||
    user.email === 'manager@gmail.com' ||
    user.role === 'MANAGER';
  if (isManager) return 'MANAGER';

  const isMember = isUserInProject(projectId, user);
  if (!isMember) return 'NONE';

  return 'MEMBER';
}

/**
 * Lọc danh sách thành viên có thể được phân công (Assignee) cho một dự án cụ thể:
 * - Admin & Manager luôn sẵn sàng được phân công trên các dự án.
 * - Nhân viên chỉ hiển thị nếu thuộc về Dự án này.
 */
export function filterAssigneesForProject<T extends MemberItemLike>(
  allWorkspaceMembers: T[],
  projectId?: string
): T[] {
  if (!projectId) return allWorkspaceMembers;

  const projectMemberIds = getStoredProjectMemberIds(projectId).map((id) => id.toLowerCase());

  return allWorkspaceMembers.filter((m) => {
    const roleUpper = String(m.role || '').toUpperCase();
    if (
      roleUpper === 'ADMIN' ||
      roleUpper === 'OWNER' ||
      roleUpper === 'MANAGER' ||
      m.email?.toLowerCase() === 'admin@gmail.com' ||
      m.email?.toLowerCase() === 'manager@gmail.com'
    ) {
      return true;
    }

    const mEmail = m.email?.toLowerCase();
    const mUserId = m.userId?.toLowerCase();

    return (
      (!!mEmail && projectMemberIds.includes(mEmail)) ||
      (!!mUserId && projectMemberIds.includes(mUserId))
    );
  });
}

/**
 * Lọc danh sách Dự án hiển thị cho người dùng:
 * - Admin và Manager được xem toàn bộ các dự án để quản lý và điều hành.
 * - Nhân viên chỉ thấy các dự án mà mình được mời tham gia.
 */
export function filterProjectsForUser<T extends { id: string }>(
  projects: T[],
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): T[] {
  if (!user) return projects;

  const isAdmin =
    user.roles?.includes('ROLE_ADMIN') ||
    user.email === 'admin@gmail.com' ||
    user.role === 'ADMIN' ||
    user.role === 'OWNER';
  const isManager =
    user.roles?.includes('ROLE_MANAGER') ||
    user.email === 'manager@gmail.com' ||
    user.role === 'MANAGER';

  if (isAdmin || isManager) return projects;

  return projects.filter((p) => isUserInProject(p.id, user));
}
