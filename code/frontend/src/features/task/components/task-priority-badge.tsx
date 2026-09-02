'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskPriority } from '../types';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

const PRIORITY_CLASSNAME: Record<TaskPriority, string> = {
  LOW: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  URGENT: 'bg-red-500/20 text-red-400 border-red-500/30 font-bold animate-pulse',
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const { t } = useTranslation('task');
  const className = PRIORITY_CLASSNAME[priority] || PRIORITY_CLASSNAME.MEDIUM;
  const label = t(`priorities.${priority}`, { defaultValue: priority });

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}
