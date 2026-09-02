'use client';

import React, { useState } from 'react';
import { Tag as TagIcon, Plus, Search, Settings, Check } from 'lucide-react';
import { useTaskTags, useWorkspaceTags, useAssignTag, useRemoveTag } from '../hooks/use-tag';
import { TagBadge } from './tag-badge';
import { TagManagerDialog } from './tag-manager-dialog';

interface TagSelectorProps {
  taskId: string;
  workspaceId: string;
}

export function TagSelector({ taskId, workspaceId }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const { data: assignedTags = [] } = useTaskTags(taskId);
  const { data: workspaceTags = [] } = useWorkspaceTags(workspaceId, search);

  const assignTag = useAssignTag(taskId);
  const removeTag = useRemoveTag(taskId);

  const assignedTagIds = new Set(assignedTags.map((t) => t.id));

  const handleToggleTag = (tagId: string) => {
    if (assignedTagIds.has(tagId)) {
      removeTag.mutate(tagId);
    } else {
      assignTag.mutate(tagId);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</span>
        <button
          type="button"
          onClick={() => setIsManagerOpen(true)}
          className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-indigo-400"
        >
          <Settings className="h-3 w-3" />
          <span>Manage Tags</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {assignedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={(id) => removeTag.mutate(id)}
          />
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 rounded-full border border-dashed border-white/20 bg-gray-900/60 px-2.5 py-0.5 text-[11px] font-medium text-gray-300 hover:border-indigo-400 hover:text-white transition"
          >
            <Plus className="h-3 w-3" />
            <span>Add Tag</span>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 z-50 w-56 rounded-xl border border-white/10 bg-[#111827] p-2.5 shadow-2xl space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-gray-900 pl-8 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {workspaceTags.map((tag) => {
                  const isAssigned = assignedTagIds.has(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition ${
                        isAssigned
                          ? 'bg-indigo-600/20 text-white font-semibold'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                        <span className="truncate">{tag.name}</span>
                      </div>
                      {isAssigned && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                    </button>
                  );
                })}

                {workspaceTags.length === 0 && (
                  <p className="text-center py-2 text-[11px] text-gray-500 italic">No tags found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <TagManagerDialog
        workspaceId={workspaceId}
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </div>
  );
}
