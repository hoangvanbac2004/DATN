'use client';

import React from 'react';
import { Filter, Check, RotateCcw } from 'lucide-react';
import type { AdvancedSearchFilter } from '../types';

interface FilterBuilderProps {
  filter: AdvancedSearchFilter;
  onChangeFilter: (updated: AdvancedSearchFilter) => void;
  onReset: () => void;
}

export function FilterBuilder({ filter, onChangeFilter, onReset }: FilterBuilderProps) {
  const statuses = [
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'IN_REVIEW', label: 'In Review' },
    { id: 'DONE', label: 'Done' },
  ];

  const priorities = [
    { id: 'LOW', label: 'Low' },
    { id: 'MEDIUM', label: 'Medium' },
    { id: 'HIGH', label: 'High' },
    { id: 'URGENT', label: 'Urgent' },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
            Filter Builder
          </h4>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div>
        <label className="text-[11px] font-semibold text-gray-400 block mb-1.5">Task Status</label>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => {
            const isSelected = filter.status === s.id;
            return (
              <button
                key={s.id}
                onClick={() =>
                  onChangeFilter({ ...filter, status: isSelected ? undefined : s.id })
                }
                className={`flex items-center space-x-1 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-white/10 bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Filter Pills */}
      <div>
        <label className="text-[11px] font-semibold text-gray-400 block mb-1.5">Priority</label>
        <div className="flex flex-wrap gap-1.5">
          {priorities.map((p) => {
            const isSelected = filter.priority === p.id;
            return (
              <button
                key={p.id}
                onClick={() =>
                  onChangeFilter({ ...filter, priority: isSelected ? undefined : p.id })
                }
                className={`flex items-center space-x-1 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-white/10 bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
