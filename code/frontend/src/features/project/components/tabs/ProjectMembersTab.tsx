'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, UserPlus, Search, Shield } from 'lucide-react';
import { useWorkspaceMembers } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/store/auth-store';
import {
  getStoredProjectMemberIds,
  getStoredProjectMemberRoles,
  addMemberToProject,
  removeMemberFromProject,
  updateMemberProjectRole,
  getUserProjectRole,
  ProjectRole,
} from '@/features/project/services/project-member-service';
import type { WorkspaceMemberDto } from '@/features/workspace/types';
import type { WorkspaceRole } from '@/features/team/types';
import { useInviteMember } from '@/features/team/hooks/use-team';

interface ProjectMembersTabProps {
  projectId: string;
  workspaceId?: string;
  projectName?: string;
}

export function ProjectMembersTab({ projectId, workspaceId, projectName }: ProjectMembersTabProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { data: workspaceMembers = [] } = useWorkspaceMembers(workspaceId || null);
  const inviteMutation = useInviteMember(workspaceId || '');

  const [projectMemberIds, setProjectMemberIds] = useState<string[]>([]);
  const [projectRoles, setProjectRoles] = useState<Record<string, ProjectRole>>({});
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Member Modal State
  const [selectedWsMemberId, setSelectedWsMemberId] = useState('');
  const [selectedProjectRole, setSelectedProjectRole] = useState<ProjectRole>('MEMBER');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('MEMBER');
  const [addMode, setAddMode] = useState<'EXISTING' | 'NEW'>('EXISTING');

  // Determine current user's effective role in THIS project
  const userProjectRole = getUserProjectRole(projectId, currentUser);
  const isAdmin = userProjectRole === 'ADMIN';
  const isManager = userProjectRole === 'MANAGER';
  const canManage = isAdmin || isManager;

  // Sync project members and roles from storage and events
  useEffect(() => {
    const update = () => {
      setProjectMemberIds(getStoredProjectMemberIds(projectId));
      setProjectRoles(getStoredProjectMemberRoles(projectId));
    };
    update();
    window.addEventListener('project_members_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('project_members_updated', update);
      window.removeEventListener('storage', update);
    };
  }, [projectId]);

  // Combine System Admins and explicitly assigned project members
  const assignedMembers: WorkspaceMemberDto[] = React.useMemo(() => {
    const lowerIds = projectMemberIds.map((id) => id.toLowerCase());

    return workspaceMembers.filter((m) => {
      const roleUpper = String(m.role || '').toUpperCase();
      // System Admin belongs to all projects
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
        (!!mEmail && lowerIds.includes(mEmail)) ||
        (!!mUserId && lowerIds.includes(mUserId))
      );
    });
  }, [workspaceMembers, projectMemberIds]);

  // Workspace members that are NOT yet in this project
  const availableWsMembers = React.useMemo(() => {
    const assignedUserIds = assignedMembers.map((m) => m.userId);
    return workspaceMembers.filter((m) => !assignedUserIds.includes(m.userId));
  }, [workspaceMembers, assignedMembers]);

  const filteredMembers = assignedMembers.filter((m) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    const name = (m.fullName || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const handleAddExistingMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWsMemberId) {
      toast.error('Vui lòng chọn thành viên để thêm vào dự án.');
      return;
    }
    const member = workspaceMembers.find((m) => m.userId === selectedWsMemberId);
    if (member) {
      addMemberToProject(projectId, member.userId, selectedProjectRole);
      if (member.email) {
        addMemberToProject(projectId, member.email, selectedProjectRole);
      }
      toast.success(
        `Đã thêm ${member.fullName || member.email} vào Dự án với quyền ${
          selectedProjectRole === 'MANAGER' ? 'Quản lý' : 'Nhân viên'
        }!`
      );
      setSelectedWsMemberId('');
      setSelectedProjectRole('MEMBER');
      setIsAddModalOpen(false);
    }
  };

  const handleInviteNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = inviteEmail.trim();
    if (!emailTrimmed) {
      toast.error('Vui lòng nhập email hợp lệ.');
      return;
    }

    const projRole: ProjectRole = inviteRole === 'MANAGER' ? 'MANAGER' : 'MEMBER';
    addMemberToProject(projectId, emailTrimmed, projRole);

    inviteMutation.mutate(
      { email: emailTrimmed, role: inviteRole },
      {
        onSuccess: () => {
          toast.success(
            `Đã gửi lời mời và gán ${emailTrimmed} vào Dự án với quyền ${
              projRole === 'MANAGER' ? 'Quản lý' : 'Nhân viên'
            } thành công!`
          );
          setInviteEmail('');
          setIsAddModalOpen(false);
        },
        onError: () => {
          toast.success(
            `Đã gán ${emailTrimmed} vào Dự án này với quyền ${
              projRole === 'MANAGER' ? 'Quản lý' : 'Nhân viên'
            }!`
          );
          setInviteEmail('');
          setIsAddModalOpen(false);
        },
      }
    );
  };

  const handleRoleChange = (m: WorkspaceMemberDto, newRole: ProjectRole) => {
    if (m.userId) updateMemberProjectRole(projectId, m.userId, newRole);
    if (m.email) updateMemberProjectRole(projectId, m.email, newRole);
    toast.success(
      `Đã cập nhật quyền của ${m.fullName || m.email} thành "${
        newRole === 'MANAGER' ? 'Quản lý dự án' : 'Nhân viên dự án'
      }"`
    );
  };

  const handleRemoveMember = (m: WorkspaceMemberDto) => {
    const roleUpper = String(m.role || '').toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper === 'OWNER' || m.email === 'admin@gmail.com') {
      toast.error('Không thể xóa Quản trị viên hệ thống khỏi dự án.');
      return;
    }

    if (
      confirm(
        `Bạn có chắc muốn xóa "${m.fullName || m.email}" khỏi dự án này? Thành viên này sẽ không còn quyền làm việc trong dự án.`
      )
    ) {
      if (m.userId) removeMemberFromProject(projectId, m.userId);
      if (m.email) removeMemberFromProject(projectId, m.email);
      toast.success(`Đã xóa "${m.fullName || m.email}" khỏi dự án.`);
    }
  };

  return (
    <div className="space-y-6 text-text-primary pb-16">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h2 className="text-base font-bold text-text-primary font-heading flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Thành viên Dự án ({assignedMembers.length})</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Chỉ những thành viên trong danh sách này mới được phép nhận công việc và thao tác trong Dự án{' '}
            <strong>{projectName || ''}</strong>.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition active:scale-95 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Thêm thành viên vào Dự án</span>
          </button>
        )}
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email thành viên..."
          className="w-full rounded-xl border border-surface-border bg-surface pl-9 pr-3.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition shadow-xs"
        />
      </div>

      {/* Members Directory Table */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-surface-border bg-surface-alt/60 font-semibold text-text-secondary uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3">Thành viên</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Vai trò trong Dự án</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                  Không tìm thấy thành viên nào trong dự án này.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const memberProjectRole = getUserProjectRole(projectId, {
                  id: m.userId,
                  email: m.email,
                  role: m.role,
                });
                const isSystemAdmin = memberProjectRole === 'ADMIN';

                return (
                  <tr key={m.userId || m.email} className="hover:bg-surface-alt/40 transition">
                    <td className="px-5 py-3.5 font-medium text-text-primary flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                        {(m.fullName || m.email || 'U').substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{m.fullName || 'Thành viên'}</p>
                        <p className="text-[10px] text-text-muted">ID: {m.userId?.substring(0, 8) || 'N/A'}</p>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-text-secondary">
                      {m.email}
                    </td>

                    <td className="px-5 py-3.5">
                      {isSystemAdmin ? (
                        <span className="inline-flex items-center space-x-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                          <Shield className="h-3 w-3" />
                          <span>Quản trị viên</span>
                        </span>
                      ) : canManage ? (
                        <select
                          value={memberProjectRole === 'MANAGER' ? 'MANAGER' : 'MEMBER'}
                          onChange={(e) => handleRoleChange(m, e.target.value as ProjectRole)}
                          className="rounded-lg border border-surface-border bg-surface-alt px-2.5 py-1 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                        >
                          <option value="MEMBER">Nhân viên (MEMBER)</option>
                          <option value="MANAGER">Quản lý (MANAGER)</option>
                        </select>
                      ) : memberProjectRole === 'MANAGER' ? (
                        <span className="inline-flex items-center space-x-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                          <Shield className="h-3 w-3" />
                          <span>Quản lý dự án</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                          <span>Nhân viên dự án</span>
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {canManage && !isSystemAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m)}
                          className="rounded-xl border border-surface-border bg-surface-alt hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-text-muted transition active:scale-95 cursor-pointer"
                          title="Xóa khỏi dự án này"
                        >
                          Xóa khỏi dự án
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 text-text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-text-primary font-heading flex items-center space-x-2">
                <UserPlus className="h-4 w-4 text-primary" />
                <span>Thêm thành viên vào Dự án</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-text-muted hover:text-text-primary text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-alt border border-surface-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAddMode('EXISTING')}
                className={`py-1.5 rounded-lg transition ${
                  addMode === 'EXISTING'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Từ Workspace ({availableWsMembers.length})
              </button>
              <button
                type="button"
                onClick={() => setAddMode('NEW')}
                className={`py-1.5 rounded-lg transition ${
                  addMode === 'NEW'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Mời bằng Email
              </button>
            </div>

            {addMode === 'EXISTING' ? (
              <form onSubmit={handleAddExistingMember} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">
                    Chọn nhân sự từ Không gian làm việc
                  </label>
                  {availableWsMembers.length === 0 ? (
                    <p className="text-xs text-text-muted italic p-3 rounded-xl border border-surface-border bg-surface-alt">
                      Tất cả thành viên trong Workspace đã được thêm vào dự án này!
                    </p>
                  ) : (
                    <select
                      value={selectedWsMemberId}
                      onChange={(e) => setSelectedWsMemberId(e.target.value)}
                      required
                      className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Chọn thành viên --</option>
                      {availableWsMembers.map((m) => (
                        <option key={m.userId} value={m.userId}>
                          {m.fullName || m.email} ({m.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Specific Role in this Project */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">
                    Vai trò trong Dự án này
                  </label>
                  <select
                    value={selectedProjectRole}
                    onChange={(e) => setSelectedProjectRole(e.target.value as ProjectRole)}
                    className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="MEMBER">Nhân viên (MEMBER) - Chỉ làm công việc được giao</option>
                    <option value="MANAGER">Quản lý (MANAGER) - Quản lý dự án, sprint và duyệt việc</option>
                  </select>
                  <p className="text-[11px] text-text-muted">
                    Dù là Manager ở ngoài, nếu chọn &quot;Nhân viên&quot; thì trong dự án này người đó chỉ có quyền Nhân viên.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={availableWsMembers.length === 0 || !selectedWsMemberId}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    Thêm vào dự án
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleInviteNewMember} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">
                    Địa chỉ Email nhân viên
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    placeholder="nhanvien@congty.com"
                    className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">
                    Vai trò trong Dự án này
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                    className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="MEMBER">Nhân viên (MEMBER) - Chỉ làm công việc được giao</option>
                    <option value="MANAGER">Quản lý (MANAGER) - Quản lý dự án, sprint và duyệt việc</option>
                  </select>
                  <p className="text-[11px] text-text-muted">
                    Người này sẽ chỉ được làm việc trong dự án này với vai trò tương ứng đã chọn.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!inviteEmail.trim() || inviteMutation.isPending}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    Mời & Gán vào dự án
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
