'use client';

import React from 'react';

interface ActivityFilterProps {
  selectedType?: string;
  onSelectType: (type?: string) => void;
}

export function ActivityFilter({ selectedType, onSelectType }: ActivityFilterProps) {
  const filters = [
    { label: 'All', value: undefined },
    { label: 'Tasks', value: 'TASK' },
    { label: 'Projects', value: 'PROJECT' },
    { label: 'Workspaces', value: 'WORKSPACE' },
  ];

  return (
    <div className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-gray-950/60 p-1">
      {filters.map((f) => (
        <button
          key={f.label}
          type="button"
          onClick={() => onSelectType(f.value)}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            selectedType === f.value
              ? 'bg-indigo-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
