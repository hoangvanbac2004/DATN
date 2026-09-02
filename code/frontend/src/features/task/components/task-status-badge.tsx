'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskStatus } from '../types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const STATUS_CLASSNAME: Record<TaskStatus, string> = {
  TODO: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  IN_PROGRESS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  IN_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const { t } = useTranslation('task');
  const className = STATUS_CLASSNAME[status] || STATUS_CLASSNAME.TODO;
  const label = t(`statuses.${status}`, { defaultValue: status });

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${className}`}
    >
      {label}
    </span>
  );
}
