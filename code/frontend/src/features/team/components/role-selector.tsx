'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WorkspaceRole } from '../types';

interface RoleSelectorProps {
  currentRole: WorkspaceRole;
  onRoleChange: (newRole: WorkspaceRole) => void;
  disabled?: boolean;
  canChangeOwner?: boolean;
}

const ROLES: { role: WorkspaceRole; color: string }[] = [
  {
    role: 'ADMIN',
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  {
    role: 'MANAGER',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    role: 'MEMBER',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
];

export function RoleSelector({
  currentRole,
  onRoleChange,
  disabled = false,
  canChangeOwner = false,
}: RoleSelectorProps) {
  const { t } = useTranslation('team');
  const activeRoleConfig = ROLES.find((r) => r.role === currentRole) || ROLES[2];

  return (
    <div className="relative inline-block">
      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value as WorkspaceRole)}
        disabled={disabled || (currentRole === 'OWNER' && !canChangeOwner)}
        className={`appearance-none rounded-xl border px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-75 ${activeRoleConfig.color}`}
      >
        {ROLES.map((r) => (
          <option
            key={r.role}
            value={r.role}
            disabled={r.role === 'OWNER' && !canChangeOwner}
            className="bg-[#111827] text-white"
          >
            {t(`roles.${r.role}`, { defaultValue: r.role })}
          </option>
        ))}
      </select>
    </div>
  );
}
