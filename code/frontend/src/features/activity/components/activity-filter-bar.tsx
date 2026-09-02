'use client';

import React from 'react';
import { Check } from 'lucide-react';

export type FeedScope = 'workspace' | 'project' | 'user';

const ENTITY_FILTERS = [
  { value: '',            label: 'All Activity' },
  { value: 'TASK',        label: 'Tasks' },
  { value: 'PROJECT',     label: 'Projects' },
  { value: 'COMMENT',     label: 'Comments' },
  { value: 'MEMBER',      label: 'Members' },
  { value: 'WIKI',        label: 'Wiki' },
  { value: 'WHITEBOARD',  label: 'Whiteboard' },
];

interface ActivityFilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ActivityFilterBar({ activeFilter, onFilterChange }: ActivityFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {ENTITY_FILTERS.map((f) => {
        const isActive = activeFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200 shadow shadow-indigo-500/20'
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isActive && <Check className="h-3 w-3" />}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
