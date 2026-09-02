'use client';

import React, { useState } from 'react';
import { Check, Trash2, ArrowUp, ArrowDown, Edit2, X } from 'lucide-react';
import type { ChecklistDto } from '../types';

interface ChecklistItemProps {
  item: ChecklistDto;
  isFirst: boolean;
  isLast: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ChecklistItem({
  item,
  isFirst,
  isLast,
  onToggle,
  onUpdateTitle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== item.title) {
      onUpdateTitle(item.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditTitle(item.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex items-center justify-between rounded-lg border border-white/5 bg-gray-900/40 px-3 py-2 text-xs transition hover:border-white/10 hover:bg-gray-900/70">
      <div className="flex items-center space-x-2.5 flex-1 min-w-0 mr-2">
        <button
          type="button"
          onClick={() => onToggle(item.id, !item.completed)}
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
            item.completed
              ? 'border-indigo-500 bg-indigo-600 text-white'
              : 'border-gray-600 hover:border-indigo-400 bg-gray-800'
          }`}
        >
          {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        {isEditing ? (
          <div className="flex items-center space-x-1.5 flex-1">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded border border-indigo-500 bg-gray-950 px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSave}
              className="rounded p-1 text-emerald-400 hover:bg-white/10"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditTitle(item.title);
                setIsEditing(false);
              }}
              className="rounded p-1 text-gray-400 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer truncate transition select-none ${
              item.completed ? 'text-gray-500 line-through' : 'text-gray-200 hover:text-white'
            }`}
          >
            {item.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move up"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move down"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400"
            title="Edit item"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
            title="Delete item"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
