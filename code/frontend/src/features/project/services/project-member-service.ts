const STORAGE_PREFIX = 'taskflow_project_members_';
const ROLES_PREFIX = 'taskflow_project_roles_';

export type ProjectRole = 'MANAGER' | 'MEMBER';

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
 * Lấy bảng phân vai trò (Roles) trong Dự án cụ thể: { [userIdOrEmail]: 'MANAGER' | 'MEMBER' }
 */
export function getStoredProjectMemberRoles(projectId: string): Record<string, ProjectRole> {
  if (typeof window === 'undefined' || !projectId) return {};
  try {
    const raw = localStorage.getItem(`${ROLES_PREFIX}${projectId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse project member roles from localStorage:', e);
  }
  return {};
}

/**
 * Lưu bảng phân vai trò trong Dự án.
 */
export function saveStoredProjectMemberRoles(projectId: string, roles: Record<string, ProjectRole>): void {
  if (typeof window === 'undefined' || !projectId) return;
  try {
    localStorage.setItem(`${ROLES_PREFIX}${projectId}`, JSON.stringify(roles));
    window.dispatchEvent(new CustomEvent('project_members_updated', { detail: { projectId } }));
  } catch (e) {
    console.error('Failed to save project member roles to localStorage:', e);
  }
}

/**
 * Thêm một thành viên (theo userId hoặc email) vào Dự án với vai trò cụ thể.
 * Mặc định vai trò là 'MEMBER' (Nhân viên).
 */
export function addMemberToProject(
  projectId: string,
  userIdOrEmail: string,
  projectRole: ProjectRole = 'MEMBER'
): void {
  if (!projectId || !userIdOrEmail) return;
  const current = getStoredProjectMemberIds(projectId);
  const normalized = userIdOrEmail.trim().toLowerCase();

  const alreadyExists = current.some((id) => id.toLowerCase() === normalized);
  if (!alreadyExists) {
    const updated = [...current, userIdOrEmail.trim()];
    saveStoredProjectMemberIds(projectId, updated);
  }

  // Cập nhật vai trò trong dự án
  const roles = getStoredProjectMemberRoles(projectId);
  roles[normalized] = projectRole;
  saveStoredProjectMemberRoles(projectId, roles);
}

/**
 * Cập nhật vai trò của một thành viên trong Dự án.
 */
export function updateMemberProjectRole(
  projectId: string,
  userIdOrEmail: string,
  newRole: ProjectRole
): void {
  if (!projectId || !userIdOrEmail) return;
  const normalized = userIdOrEmail.trim().toLowerCase();
  const roles = getStoredProjectMemberRoles(projectId);
  roles[normalized] = newRole;
  saveStoredProjectMemberRoles(projectId, roles);
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

  const roles = getStoredProjectMemberRoles(projectId);
  delete roles[normalized];
  saveStoredProjectMemberRoles(projectId, roles);
}

/**
 * Lấy vai trò cụ thể của một người dùng trong Dự án:
 * - 'ADMIN': Quản trị viên hệ thống (Superadmin).
 * - 'MANAGER': Quản lý của Dự án này (Có quyền quản lý sprint, duyệt việc, quản lý thành viên).
 * - 'MEMBER': Nhân viên của Dự án này (Chỉ làm việc được giao, không có quyền quản lý).
 * - 'NONE': Không thuộc dự án này (Không có quyền xem hay làm việc).
 */
export function getUserProjectRole(
  projectId: string,
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): 'ADMIN' | 'MANAGER' | 'MEMBER' | 'NONE' {
  if (!user || !projectId) return 'NONE';

  // 1. Quản trị viên hệ thống luôn có quyền ADMIN cao nhất
  const isSystemAdmin =
    user.roles?.includes('ROLE_ADMIN') ||
    user.email === 'admin@gmail.com' ||
    user.role === 'ADMIN';
  if (isSystemAdmin) return 'ADMIN';

  // 2. Kiểm tra xem người dùng có được gán vào dự án hay không
  const projectMembers = getStoredProjectMemberIds(projectId).map((m) => m.toLowerCase());
  const userEmail = user.email?.toLowerCase();
  const userId = user.id?.toLowerCase();

  const isAssigned =
    (!!userEmail && projectMembers.includes(userEmail)) ||
    (!!userId && projectMembers.includes(userId));

  if (!isAssigned) {
    return 'NONE';
  }

  // 3. Nếu đã được gán vào dự án, kiểm tra chính xác vai trò đã được thiết lập trong dự án
  const roles = getStoredProjectMemberRoles(projectId);
  const explicitRole =
    (userEmail && roles[userEmail]) ||
    (userId && roles[userId]);

  if (explicitRole) {
    // Nếu được mời/gán là MEMBER thì DÙ tài khoản có là manager ở workspace thì trong dự án này VẪN LÀ MEMBER!
    return explicitRole;
  }

  // Nếu trong dữ liệu cũ chưa có vai trò chi tiết:
  const isGlobalManager =
    user.roles?.includes('ROLE_MANAGER') ||
    user.email === 'manager@gmail.com' ||
    user.role === 'MANAGER';
  if (isGlobalManager) return 'MANAGER';

  return 'MEMBER';
}

/**
 * Kiểm tra xem một người dùng có thuộc về Dự án hay không.
 */
export function isUserInProject(
  projectId: string,
  user: { id?: string; email?: string; roles?: string[]; role?: string } | null
): boolean {
  return getUserProjectRole(projectId, user) !== 'NONE';
}

/**
 * Lọc danh sách thành viên có thể được phân công (Assignee) cho một dự án cụ thể:
 * - Giữ lại Admin hệ thống.
 * - Các thành viên khác chỉ hiển thị nếu thuộc về Dự án này.
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
      m.email?.toLowerCase() === 'admin@gmail.com'
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
 * - Admin hệ thống được xem toàn bộ dự án.
 * - Các người dùng khác (kể cả Manager hay Staff) chỉ nhìn thấy dự án mà mình tham gia!
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

  if (isAdmin) return projects;

  // Chỉ giữ lại các dự án mà người dùng tham gia (getUserProjectRole !== 'NONE')
  return projects.filter((p) => getUserProjectRole(p.id, user) !== 'NONE');
}
