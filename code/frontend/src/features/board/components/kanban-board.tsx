'use client';

import React, { useState } from 'react';
import { Plus, Settings, Loader2, LayoutGrid } from 'lucide-react';
import type { BoardColumnDto } from '../types';
import type { TaskDto } from '@/features/task/types';
import {
  useProjectBoard,
  useCreateColumn,
  useUpdateColumn,
  useDeleteColumn,
  useMoveTask,
  useUpdateBoardSettings,
} from '../hooks/use-board';
import { KanbanColumn } from './kanban-column';
import { AddColumnDialog } from './add-column-dialog';
import { EditColumnDialog } from './edit-column-dialog';
import { BoardSettingsDialog } from './board-settings-dialog';
import { TaskDetailModal } from '@/features/task/components/task-detail-modal';
import { TaskFormDialog } from '@/features/task/components/task-form-dialog';
import { useAuthStore } from '@/store/auth-store';

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: board, isLoading } = useProjectBoard(projectId);
  const currentUser = useAuthStore((state) => state.user);

  const createColumn = useCreateColumn(projectId, board?.id || '');
  const updateColumn = useUpdateColumn(projectId);
  const deleteColumn = useDeleteColumn(projectId);
  const moveTask = useMoveTask(projectId, board?.id || '');
  const updateSettings = useUpdateBoardSettings(projectId, board?.id || '');

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<BoardColumnDto | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
  const [dragErrorMsg, setDragErrorMsg] = useState<string | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const isAdminUser = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.email === 'admin@gmail.com';
  const isManagerUser = !isAdminUser && (currentUser?.roles?.includes('ROLE_MANAGER') || currentUser?.email === 'manager@gmail.com');
  const isStaffUser = !isAdminUser && !isManagerUser;

  // Check if current user is the assignee of a task
  const isMyTask = (task: TaskDto) => {
    if (!isStaffUser) return true; // admin/manager can interact with all tasks
    return (
      task.assignee?.id === currentUser?.id ||
      task.assignee?.email === currentUser?.email
    );
  };

  const handleDragStartTask = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDropTask = (e: React.DragEvent, targetColumnId: string) => {
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId || !board) return;

    // Find the task being dragged across all columns
    let draggedTask: TaskDto | undefined;
    for (const col of board.columns) {
      draggedTask = col.tasks.find((t) => t.id === taskId);
      if (draggedTask) break;
    }

    // Staff can only drag their own tasks
    if (draggedTask && !isMyTask(draggedTask)) {
      setDragErrorMsg(`Bạn không có quyền di chuyển công việc "${draggedTask.title}" vì công việc này không được giao cho bạn.`);
      setTimeout(() => setDragErrorMsg(null), 3500);
      return;
    }

    const targetColumn = board.columns.find((c) => c.id === targetColumnId);
    if (!targetColumn) return;

    const lastTask = targetColumn.tasks[targetColumn.tasks.length - 1];
    const targetPosition = lastTask ? (lastTask.position || 1000.0) + 1000.0 : 1000.0;

    moveTask.mutate({
      taskId,
      targetColumnId,
      targetPosition,
    });
  };

  const handleToggleCollapse = (columnId: string, isCollapsed: boolean) => {
    updateColumn.mutate({ columnId, data: { isCollapsed } });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-8 text-center backdrop-blur-md">
        <LayoutGrid className="h-8 w-8 text-indigo-400" />
        <h3 className="mt-3 text-sm font-semibold text-white font-heading">Chưa khởi tạo bảng công việc</h3>
      </div>
    );
  }

  const visibleColumns = React.useMemo(() => {
    if (!board) return [];
    return board.columns.map((col) => ({
      ...col,
      tasks: isStaffUser && currentUser
        ? col.tasks.filter(
            (t) =>
              t.assignee?.id === currentUser.id ||
              t.assignee?.email === currentUser.email ||
              t.assigneeId === currentUser.id
          )
        : col.tasks,
    }));
  }, [board, isStaffUser, currentUser]);

  return (
    <div className="space-y-4">
      {/* Board Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white font-heading">{board.name}</h2>
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            {board.columns.length} Cột
          </span>
          {isStaffUser && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
              Chỉ hiển thị công việc của bạn
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Cài đặt</span>
          </button>
          <button
            onClick={() => setIsAddColumnOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm cột</span>
          </button>
        </div>
      </div>

      {/* Drag Error Toast */}
      {dragErrorMsg && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center space-x-2.5 rounded-xl border border-red-500/40 bg-red-950/90 px-4 py-3 text-xs font-semibold text-red-300 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-4">
          <span className="text-red-400">⛔</span>
          <span>{dragErrorMsg}</span>
        </div>
      )}

      {/* Horizontal Scrollable Column Grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2">
        {visibleColumns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onSelectTask={setSelectedTask}
            onEditColumn={setEditingColumn}
            onToggleCollapse={handleToggleCollapse}
            onAddTask={() => setIsCreateTaskOpen(true)}
            onDragStartTask={handleDragStartTask}
            onDropTask={handleDropTask}
            currentUser={currentUser}
            isMyTask={isMyTask}
          />
        ))}
      </div>

      {/* Dialog Modals */}
      <AddColumnDialog
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        onSubmit={(payload) => createColumn.mutate(payload)}
        isLoading={createColumn.isPending}
      />

      <EditColumnDialog
        column={editingColumn}
        isOpen={!!editingColumn}
        onClose={() => setEditingColumn(null)}
        onSubmit={(columnId, payload) => updateColumn.mutate({ columnId, data: payload })}
        onDelete={(columnId) => deleteColumn.mutate(columnId)}
        isLoading={updateColumn.isPending}
      />

      <BoardSettingsDialog
        board={board}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={(payload) => updateSettings.mutate(payload)}
        isLoading={updateSettings.isPending}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <TaskFormDialog
        projectId={projectId}
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </div>
  );
}
