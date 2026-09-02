'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Plus, AlertCircle } from 'lucide-react';
import type { BoardColumnDto } from '../types';
import type { TaskDto } from '@/features/task/types';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  column: BoardColumnDto;
  onSelectTask: (task: TaskDto) => void;
  onEditColumn: (column: BoardColumnDto) => void;
  onToggleCollapse: (columnId: string, isCollapsed: boolean) => void;
  onAddTask: (columnId: string) => void;
  onDragStartTask: (e: React.DragEvent, taskId: string) => void;
  onDropTask: (e: React.DragEvent, targetColumnId: string) => void;
  currentUser?: { id?: string; email?: string } | null;
  isMyTask: (task: TaskDto) => boolean;
}

export function KanbanColumn({
  column,
  onSelectTask,
  onEditColumn,
  onToggleCollapse,
  onAddTask,
  onDragStartTask,
  onDropTask,
  currentUser,
  isMyTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(e, column.id);
  };

  const taskCount = column.tasks.length;
  const isWipExceeded = column.wipLimit > 0 && taskCount > column.wipLimit;

  if (column.isCollapsed) {
    return (
      <div className="flex h-full w-12 shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-[#111827]/70 py-4 backdrop-blur-md">
        <button
          onClick={() => onToggleCollapse(column.id, false)}
          className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          title="Mở rộng cột"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div
          className="mt-4 flex flex-1 items-center justify-center [writing-mode:vertical-lr] text-xs font-bold uppercase tracking-wider text-gray-300"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />
          {column.name} ({taskCount})
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl border bg-[#111827]/70 p-4 backdrop-blur-md transition-all duration-200 shrink-0 snap-center w-[85vw] sm:w-72 md:w-80 ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
          : isWipExceeded
          ? 'border-red-500/40 bg-red-950/10'
          : 'border-white/10'
      }`}
      style={{ width: 290 }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: column.color || '#64748b' }} />
          <h3 className="text-xs font-bold text-white font-heading truncate max-w-[130px]">{column.name}</h3>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
            {taskCount}
            {column.wipLimit > 0 && `/${column.wipLimit}`}
          </span>
          {isWipExceeded && (
            <span title="Vượt giới hạn công việc (WIP)">
              <AlertCircle className="h-3.5 w-3.5 text-red-400" />
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEditColumn(column)}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
            title="Cài đặt cột"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onToggleCollapse(column.id, true)}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
            title="Thu gọn cột"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto pr-1">
        {column.tasks.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-4 text-center">
            <span className="text-[11px] text-gray-500">Chưa có công việc nào</span>
          </div>
        ) : (
          column.tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onSelect={onSelectTask}
              onDragStart={onDragStartTask}
              isOwned={isMyTask(task)}
            />
          ))
        )}
      </div>

      {/* Footer Add Task Action */}
      <button
        onClick={() => onAddTask(column.id)}
        className="mt-3 flex items-center justify-center space-x-1.5 rounded-xl border border-dashed border-white/10 bg-white/5 py-2 text-xs font-semibold text-gray-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Thêm công việc</span>
      </button>
    </div>
  );
}
