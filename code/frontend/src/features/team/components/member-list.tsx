'use client';

import React from 'react';
import { Trash2, UserCheck, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WorkspaceMemberDto, WorkspaceRole } from '../types';
import { RoleSelector } from './role-selector';

interface MemberListProps {
  members: WorkspaceMemberDto[];
  currentUserId?: string;
  onUpdateRole: (memberId: string, role: WorkspaceRole) => void;
  onRemoveMember: (memberId: string) => void;
  isUpdating?: boolean;
}

export function MemberList({
  members,
  currentUserId,
  onUpdateRole,
  onRemoveMember,
  isUpdating,
}: MemberListProps) {
  const { t } = useTranslation('team');
  const { t: tCommon } = useTranslation('common');

  if (members.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-surface-border bg-surface p-4 text-center shadow-xs">
        <UserCheck className="h-6 w-6 text-text-muted" />
        <p className="mt-2 text-xs text-text-muted">{tCommon('emptyState.description', { defaultValue: 'Chưa có thành viên nào' })}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-border rounded-xl border border-surface-border bg-surface overflow-hidden shadow-xs">
      {members.map((member) => {
        const name = member.fullName || member.user?.fullName || member.email || 'Thành viên';
        const initials = name.slice(0, 2).toUpperCase();
        const isOwner = member.role === 'OWNER';

        return (
          <div
            key={member.id}
            className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center justify-between hover:bg-surface-alt transition"
          >
            {/* Member Info */}
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-sm font-heading">
                {initials}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-text-primary font-heading">{name}</h4>
                  {member.userId === currentUserId && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                      Bạn
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Mail className="h-3 w-3 text-text-muted" />
                  <span className="text-[11px] text-text-secondary">{member.email || member.user?.email || 'Chưa có email'}</span>
                </div>
              </div>
            </div>

            {/* Role & Remove Actions */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <RoleSelector
                currentRole={member.role}
                onRoleChange={(newRole) => onUpdateRole(member.id, newRole)}
                disabled={isUpdating}
              />

              {!isOwner && (
                <button
                  type="button"
                  onClick={() => onRemoveMember(member.id)}
                  disabled={isUpdating}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-status-error/10 hover:text-status-error transition"
                  title={t('actions.removeMember', { defaultValue: 'Xóa thành viên' })}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
