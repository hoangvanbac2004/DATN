'use client';

import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import type { SavedSearchFilterDto, AdvancedSearchFilter } from '../types';

interface SavedSearchesListProps {
  savedFilters: SavedSearchFilterDto[];
  onApplyFilter: (filter: AdvancedSearchFilter) => void;
  onDeleteFilter: (filterId: string) => void;
}

export function SavedSearchesList({
  savedFilters,
  onApplyFilter,
  onDeleteFilter,
}: SavedSearchesListProps) {
  if (savedFilters.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur-md space-y-3">
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <Bookmark className="h-4 w-4 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
          Saved Search Presets
        </h4>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {savedFilters.map((f) => (
          <div
            key={f.id}
            onClick={() => {
              try {
                const parsed = JSON.parse(f.filterConfigJson);
                onApplyFilter({ query: f.query, ...parsed });
              } catch {
                onApplyFilter({ query: f.query });
              }
            }}
            className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <span className="font-semibold truncate">{f.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFilter(f.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition"
              title="Delete Preset"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
