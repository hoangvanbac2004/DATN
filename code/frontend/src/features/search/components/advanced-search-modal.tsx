'use client';

import React, { useState } from 'react';
import { Search, X, Loader2, CheckSquare, Folder, BookmarkPlus } from 'lucide-react';
import {
  useAdvancedSearch,
  useSavedSearchFilters,
  useSearchHistory,
  useCreateSavedFilter,
  useDeleteSavedFilter,
} from '../hooks/use-search';
import type { AdvancedSearchFilter } from '../types';
import { FilterBuilder } from './filter-builder';
import { SavedSearchesList } from './saved-searches-list';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
}

export function AdvancedSearchModal({ isOpen, onClose, workspaceId }: AdvancedSearchModalProps) {
  const [filter, setFilter] = useState<AdvancedSearchFilter>({ workspaceId });
  const [activeTab, setActiveTab] = useState<'all' | 'tasks' | 'projects'>('all');
  const [presetName, setPresetName] = useState('');
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const { data: searchResult, isLoading } = useAdvancedSearch(filter, isOpen);
  const { data: savedFilters = [] } = useSavedSearchFilters(workspaceId);
  const { data: searchHistory = [] } = useSearchHistory();

  const createSavedFilterMutation = useCreateSavedFilter(workspaceId);
  const deleteSavedFilterMutation = useDeleteSavedFilter(workspaceId);

  if (!isOpen) return null;

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    createSavedFilterMutation.mutate({
      name: presetName.trim(),
      query: filter.query,
      filterConfigJson: JSON.stringify({ status: filter.status, priority: filter.priority }),
      workspaceId,
    });
    setPresetName('');
    setIsSavingPreset(false);
  };

  const tasks = searchResult?.tasks || [];
  const projects = searchResult?.projects || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md pt-16 p-4">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Search Input Bar */}
        <div className="flex items-center space-x-3 border-b border-white/10 bg-[#111827] px-6 py-4">
          <Search className="h-5 w-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={filter.query || ''}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            placeholder="Search tasks, projects, wiki docs, or tags... (Press Cmd/Ctrl + K)"
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSavingPreset(!isSavingPreset)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            title="Save Filter Preset"
          >
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Save Form (if open) */}
        {isSavingPreset && (
          <div className="flex items-center space-x-2 border-b border-white/10 bg-indigo-950/40 px-6 py-3">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset Name (e.g. High Priority In Progress)"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              Save Preset
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Filter & Presets Sidebar */}
          <div className="w-72 border-r border-white/10 bg-[#111827]/60 p-4 space-y-4 overflow-y-auto shrink-0">
            <FilterBuilder
              filter={filter}
              onChangeFilter={setFilter}
              onReset={() => setFilter({ workspaceId })}
            />

            <SavedSearchesList
              savedFilters={savedFilters}
              onApplyFilter={setFilter}
              onDeleteFilter={(id) => deleteSavedFilterMutation.mutate(id)}
            />
          </div>

          {/* Right Results Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : tasks.length === 0 && projects.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-gray-400">
                <Search className="h-8 w-8 text-gray-600 mb-2" />
                <p className="text-xs">No matching results found</p>
                <p className="text-[11px] text-gray-500 mt-1">Try adjusting your query or filter parameters</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tasks Section */}
                {tasks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Tasks ({tasks.length})
                    </h4>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 transition"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckSquare className="h-4 w-4 text-indigo-400 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white">{task.title}</p>
                              <p className="text-[10px] text-gray-400 line-clamp-1">{task.description || 'No description'}</p>
                            </div>
                          </div>
                          <span className="rounded-lg bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Projects ({projects.length})
                    </h4>
                    <div className="space-y-2">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 transition"
                        >
                          <div className="flex items-center space-x-3">
                            <Folder className="h-4 w-4 text-emerald-400 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white">{proj.name}</p>
                              <p className="text-[10px] text-gray-400 line-clamp-1">{proj.description || 'No description'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
