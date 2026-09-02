'use client';

import React, { useState } from 'react';
import { Calendar, GripVertical, User, Lock } from 'lucide-react';
import type { TaskDto } from '@/features/task/types';
import { TaskPriorityBadge } from '@/features/task/components/task-priority-badge';

interface KanbanCardProps {
  task: TaskDto;
  onSelect: (task: TaskDto) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isOwned: boolean;
}

export function KanbanCard({ task, onSelect, onDragStart, isOwned }: KanbanCardProps) {
  const [showLockTooltip, setShowLockTooltip] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isOwned) {
      e.preventDefault();
      return;
    }
    onDragStart(e, task.id);
  };

  const handleClick = () => {
    // Anyone can view a task by clicking, but drag/edit is restricted
    onSelect(task);
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
    : null;

  return (
    <div
      draggable={isOwned}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`group relative cursor-pointer rounded-xl border border-white/10 bg-[#1e293b]/80 p-3.5 shadow-md backdrop-blur-md transition-all duration-200 ${isOwned
          ? 'cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-[#1e293b] hover:shadow-indigo-500/10'
          : 'opacity-70 cursor-not-allowed hover:border-red-500/30'
        }`}
    >
      {/* Lock overlay badge for non-owned tasks */}
      {!isOwned && (
        <div
          className="absolute top-2 right-2"
          onMouseEnter={() => setShowLockTooltip(true)}
          onMouseLeave={() => setShowLockTooltip(false)}
        >
          <div className="flex items-center justify-center rounded-full bg-red-950/80 border border-red-500/30 p-1">
            <Lock className="h-3 w-3 text-red-400" />
          </div>
          {showLockTooltip && (
            <div className="absolute right-0 top-6 z-50 w-48 rounded-lg border border-red-500/30 bg-[#1a0a0a]/95 px-3 py-2 text-[11px] text-red-300 shadow-xl backdrop-blur-md">
              Bạn không thể di chuyển hoặc chỉnh sửa công việc này vì nó không được giao cho bạn.
            </div>
          )}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-1 text-gray-500 group-hover:text-gray-400">
          <GripVertical className={`h-3.5 w-3.5 shrink-0 ${isOwned ? '' : 'opacity-30'}`} />
          <h4 className="text-xs font-semibold text-white line-clamp-2">{task.title}</h4>
        </div>
        {isOwned && <TaskPriorityBadge priority={task.priority} />}
      </div>

      {task.description && (
        <p className="mt-2 text-[11px] text-gray-400 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-gray-400">
        {formattedDueDate ? (
          <div className="flex items-center space-x-1 text-indigo-300">
            <Calendar className="h-3 w-3" />
            <span>{formattedDueDate}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignee ? (
          <div className="flex items-center space-x-1">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${isOwned ? 'bg-indigo-600' : 'bg-gray-600'}`}>
              {task.assignee.fullName ? task.assignee.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-gray-500">
            <User className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
