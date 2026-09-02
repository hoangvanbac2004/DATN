'use client';

import React from 'react';
import { Calendar, CheckCircle2, Circle, Archive } from 'lucide-react';
import type { TaskDto } from '../types';
import { TaskStatusBadge } from './task-status-badge';
import { TaskPriorityBadge } from './task-priority-badge';
import { useUpdateTaskStatus } from '../hooks/use-task';

import { useTaskTags } from '@/features/tag/hooks/use-tag';
import { TagBadge } from '@/features/tag/components/tag-badge';

interface TaskCardProps {
  task: TaskDto;
  onSelect: (task: TaskDto) => void;
}

export function TaskCard({ task, onSelect }: TaskCardProps) {
  const updateStatus = useUpdateTaskStatus();
  const { data: tags = [] } = useTaskTags(task.id);
  const isCompleted = task.status === 'COMPLETED';

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'TODO' : 'COMPLETED';
    updateStatus.mutate({ taskId: task.id, status: nextStatus });
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 cursor-pointer shadow-xs ${
        isCompleted
          ? 'border-surface-border bg-surface-alt/50 opacity-75'
          : 'border-surface-border bg-surface hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 truncate">
            <button
              onClick={handleToggleComplete}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              className="mt-0.5 text-text-muted hover:text-status-success transition shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-status-success" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="truncate">
              <h4
                className={`text-sm font-semibold transition ${
                  isCompleted ? 'line-through text-text-muted' : 'text-text-primary group-hover:text-primary'
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <TaskPriorityBadge priority={task.priority} />
        </div>

        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tags.map((t) => (
              <TagBadge key={t.id} tag={t} size="sm" />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3 text-xs text-text-secondary">
        <div className="flex items-center space-x-3">
          <TaskStatusBadge status={task.status} />

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-[11px] text-text-muted">
              <Calendar className="h-3.5 w-3.5 text-text-muted" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.isArchived && (
            <span className="flex items-center text-[10px] text-status-warning">
              <Archive className="mr-1 h-3 w-3" /> Đã lưu trữ
            </span>
          )}
        </div>

        {task.assignee && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs"
            title={task.assignee.fullName}
          >
            {task.assignee.fullName?.substring(0, 1).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
