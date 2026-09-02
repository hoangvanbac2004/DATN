'use client';

import React from 'react';
import type { ChecklistProgressDto } from '../types';

interface ChecklistProgressProps {
  progress?: ChecklistProgressDto;
  isLoading?: boolean;
}

export function ChecklistProgress({ progress, isLoading }: ChecklistProgressProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-1.5 animate-pulse">
        <div className="h-3.5 bg-gray-800 rounded w-1/4"></div>
        <div className="h-2 bg-gray-800 rounded-full w-full"></div>
      </div>
    );
  }

  const total = progress?.totalItems || 0;
  const completed = progress?.completedItems || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-300">
          Checklist ({completed}/{total})
        </span>
        <span className="font-medium text-indigo-400">{percentage}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
