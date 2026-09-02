'use client';

import React, { useState } from 'react';
import { X, Tag, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWorkspaceTags, useCreateTag, useUpdateTag, useDeleteTag } from '../hooks/use-tag';
import type { TagDto } from '../types';

const COLOR_PALETTE = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
];

interface TagManagerDialogProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TagManagerDialog({ workspaceId, isOpen, onClose }: TagManagerDialogProps) {
  const { t } = useTranslation('task');
  const { t: tCommon } = useTranslation('common');
  const { data: tags = [], isLoading } = useWorkspaceTags(workspaceId);
  const createTag = useCreateTag(workspaceId);
  const updateTag = useUpdateTag(workspaceId);
  const deleteTag = useDeleteTag(workspaceId);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [editingTag, setEditingTag] = useState<TagDto | null>(null);

  if (!isOpen) return null;

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTag) {
      updateTag.mutate(
        { tagId: editingTag.id, data: { name: name.trim(), color } },
        {
          onSuccess: () => {
            setName('');
            setEditingTag(null);
          },
        }
      );
    } else {
      createTag.mutate(
        { name: name.trim(), color },
        {
          onSuccess: () => {
            setName('');
          },
        }
      );
    }
  };

  const handleEditClick = (tag: TagDto) => {
    setEditingTag(tag);
    setName(tag.name);
    setColor(tag.color);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setName('');
    setColor('#6366F1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-heading">{t('fields.tags')}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Create/Edit Form */}
        <form onSubmit={handleCreateOrUpdate} className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={editingTag ? tCommon('actions.edit') : tCommon('actions.add')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-gray-900 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!name.trim() || createTag.isPending || updateTag.isPending}
              className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              {editingTag ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{editingTag ? tCommon('actions.update') : tCommon('actions.add')}</span>
            </button>
            {editingTag && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 hover:text-white"
              >
                {tCommon('actions.cancel')}
              </button>
            )}
          </div>

          {/* Color Palette Selector */}
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-[11px] text-gray-400 font-medium">Color:</span>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-5 w-5 rounded-full transition transform hover:scale-110 ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </form>

        {/* Existing Tags List */}
        <div className="space-y-2 border-t border-white/10 pt-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('fields.tags')} ({tags.length})</span>
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-lg bg-gray-900" />
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {tags.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-gray-900/40 px-3 py-2 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="font-medium text-white">{t.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditClick(t)}
                      className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteTag.mutate(t.id)}
                      className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-center py-3 text-xs text-gray-500 italic">{tCommon('emptyState.description')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
