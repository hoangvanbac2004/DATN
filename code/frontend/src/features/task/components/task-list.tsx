'use client';

import React, { useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon, CheckSquare, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TaskDto, TaskFilterState } from '../types';
import { useProjectTasks, useWorkspaceTasks } from '../hooks/use-task';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';
import { TaskFormDialog } from './task-form-dialog';
import { TaskDetailModal } from './task-detail-modal';
import { KanbanBoard } from '@/features/board/components/kanban-board';
import { TimelineView } from '@/features/timeline/components/timeline-view';
import { TaskListSkeleton } from '@/components/ui/skeletons/task-list-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

interface TaskListProps {
  projectId?: string;
  workspaceId?: string;
}

export function TaskList({ projectId, workspaceId }: TaskListProps) {
  const { t: tTask } = useTranslation('task');

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline'>('list');
  const [filters, setFilters] = useState<TaskFilterState>({});

  const storageKeyId = workspaceId || projectId || 'default';

  React.useEffect(() => {
    const saved = localStorage.getItem(`taskflow_view_mode_${storageKeyId}`);
    if (saved && (saved === 'list' || saved === 'kanban' || saved === 'timeline')) {
      setViewMode(saved as any);
    }
  }, [storageKeyId]);

  const handleViewModeChange = (mode: 'list' | 'kanban' | 'timeline') => {
    setViewMode(mode);
    localStorage.setItem(`taskflow_view_mode_${storageKeyId}`, mode);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const projectTasksQuery = useProjectTasks(projectId || null, filters);
  const workspaceTasksQuery = useWorkspaceTasks(workspaceId || null, filters);

  const activeQuery = workspaceId ? workspaceTasksQuery : projectTasksQuery;
  const tasks = activeQuery.data || [];
  const isLoading = activeQuery.isLoading;

  const handleCardClick = (task: TaskDto) => {
    setSelectedTask(task);
  };

  const handleEditTask = (task: TaskDto) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCreateOpen = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <TaskFilters filters={filters} onChange={setFilters} />

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center rounded-xl border border-surface-border bg-surface p-1 shadow-xs">
            <button
              onClick={() => handleViewModeChange('list')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
              }`}
              title="Xem dạng Danh sách"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('kanban')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'kanban'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
              }`}
              title="Xem dạng Bảng Kanban"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('timeline')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'timeline'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
              }`}
              title="Xem dạng Tiến độ Timeline"
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleCreateOpen}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{tTask('createTask', { defaultValue: 'Tạo công việc' })}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <TaskListSkeleton count={4} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tTask('noTasksTitle', { defaultValue: 'Chưa có công việc nào trong Workspace này' })}
          description={tTask('noTasksDesc', { defaultValue: 'Tạo công việc đầu tiên để bắt đầu sắp xếp công việc và theo dõi tiến độ.' })}
          actionLabel={tTask('createTask', { defaultValue: 'Tạo công việc' })}
          onAction={handleCreateOpen}
        />
      ) : viewMode === 'list' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={handleCardClick} />
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard projectId={projectId || ''} />
      ) : (
        <TimelineView projectId={projectId || ''} />
      )}

      {/* Dialog Modals */}
      <TaskFormDialog
        projectId={projectId || ''}
        workspaceId={workspaceId || ''}
        task={editingTask}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
      />
    </div>
  );
}
