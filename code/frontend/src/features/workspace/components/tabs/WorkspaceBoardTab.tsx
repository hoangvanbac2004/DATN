'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckSquare, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  Calendar,
  Layers,
  Paperclip,
  ListChecks,
  GripVertical
} from 'lucide-react';
import type { TaskDto, TaskStatus } from '@/features/task/types';
import { useUpdateTaskStatus } from '@/features/task/hooks/use-task';
import { useAuthStore } from '@/store/auth-store';
import { TaskDetailModal } from '@/features/task/components/task-detail-modal';
import { ConfirmStatusChangeModal } from '@/features/task/components/confirm-status-change-modal';

interface WorkspaceBoardTabProps {
  tasks: TaskDto[];
  isLoading: boolean;
  onOpenCreateTask: () => void;
  onSelectTask?: (task: TaskDto) => void;
}

export function WorkspaceBoardTab({
  tasks,
  isLoading,
  onOpenCreateTask,
  onSelectTask,
}: WorkspaceBoardTabProps) {
  const { t } = useTranslation('workspace');
  const { t: tTask } = useTranslation('task');
  const user = useAuthStore((state) => state.user);
  const updateStatusMutation = useUpdateTaskStatus();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<TaskStatus | null>(null);

  // Status Change Confirmation Modal State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    task: TaskDto;
    newStatus: TaskStatus;
  } | null>(null);

  const canCreateTask = !!user;

  const columns: { 
    id: TaskStatus; 
    title: string; 
    badgeBg: string; 
    badgeText: string; 
    badgeBorder: string; 
    dotBg: string; 
    topBorder: string;
    icon: React.ElementType;
  }[] = [
    { 
      id: 'TODO', 
      title: tTask('statuses.TODO', { defaultValue: 'Cần làm' }), 
      badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
      badgeText: 'text-slate-600 dark:text-slate-300',
      badgeBorder: 'border-slate-500/30',
      dotBg: 'bg-slate-400',
      topBorder: 'border-t-slate-400',
      icon: Clock
    },
    { 
      id: 'IN_PROGRESS', 
      title: tTask('statuses.IN_PROGRESS', { defaultValue: 'Đang làm' }), 
      badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      badgeText: 'text-blue-600 dark:text-blue-400',
      badgeBorder: 'border-blue-500/30',
      dotBg: 'bg-blue-500 animate-pulse',
      topBorder: 'border-t-blue-500',
      icon: PlayCircle
    },
    { 
      id: 'IN_REVIEW', 
      title: tTask('statuses.IN_REVIEW', { defaultValue: 'Đang xem xét' }), 
      badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      badgeText: 'text-amber-600 dark:text-amber-400',
      badgeBorder: 'border-amber-500/30',
      dotBg: 'bg-amber-500',
      topBorder: 'border-t-amber-500',
      icon: AlertCircle
    },
    { 
      id: 'DONE', 
      title: tTask('statuses.DONE', { defaultValue: 'Hoàn thành' }), 
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      badgeBorder: 'border-emerald-500/30',
      dotBg: 'bg-emerald-500',
      topBorder: 'border-t-emerald-500',
      icon: CheckCircle2
    },
  ];

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
  };

  const getPriorityBadge = (priority?: string) => {
    const p = priority?.toUpperCase() || 'MEDIUM';
    switch (p) {
      case 'URGENT':
        return <span className="rounded-md border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-500">Khẩn cấp</span>;
      case 'HIGH':
        return <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500">Cao</span>;
      case 'LOW':
        return <span className="rounded-md border border-slate-500/30 bg-slate-500/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">Thấp</span>;
      default:
        return <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">Trung bình</span>;
    }
  };

  const getSprintBadge = (task: TaskDto) => {
    if (task.status === 'IN_PROGRESS' || task.status === 'IN_REVIEW') {
      return (
        <span className="inline-flex items-center space-x-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">
          <Layers className="h-2.5 w-2.5" />
          <span>Giai đoạn 1</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 rounded-md border border-surface-border bg-surface-alt px-1.5 py-0.5 text-[9px] font-semibold text-text-muted">
        <span>Tồn đọng</span>
      </span>
    );
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = !isAdmin && (user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com');
  const isStaff = !isAdmin && !isManager;

  // Staff chỉ được đổi trạng thái nếu họ là người được giao việc
  const canChangeTaskStatus = (task: TaskDto): boolean => {
    if (!isStaff) return true; // Admin/Manager luôn có quyền
    const assigneeEmail = task.assignee?.email;
    return !!assigneeEmail && assigneeEmail === user?.email;
  };

  const filteredTasks = React.useMemo(() => {
    let list = tasks;
    if (isStaff && user) {
      list = list.filter(
        (t) =>
          t.assignee?.id === user.id ||
          t.assignee?.email === user.email ||
          t.assigneeId === user.id
      );
    }
    return list.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, isStaff, user, searchTerm]);

  const handleRequestStatusChange = (task: TaskDto, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    if (!canChangeTaskStatus(task)) {
      toast.error('Bạn không có quyền thay đổi trạng thái công việc này.');
      return;
    }
    setPendingStatusChange({ task, newStatus });
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;
    updateStatusMutation.mutate(
      {
        taskId: pendingStatusChange.task.id,
        status: pendingStatusChange.newStatus,
      },
      {
        onSuccess: () => {
          setPendingStatusChange(null);
        },
      }
    );
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, task: TaskDto) => {
    if (!canChangeTaskStatus(task)) {
      e.preventDefault();
      toast.error('Bạn không có quyền chuyển trạng thái công việc này.');
      return;
    }
    setDraggedTaskId(task.id);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColId(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent, colId: TaskStatus) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentStatus = task.status || 'TODO';
    if (currentStatus === targetStatus) return;

    if (!canChangeTaskStatus(task)) {
      toast.error('Bạn không có quyền chuyển trạng thái công việc này.');
      return;
    }

    updateStatusMutation.mutate(
      { taskId, status: targetStatus },
      {
        onSuccess: () => {
          const colTitle = columns.find((c) => c.id === targetStatus)?.title || targetStatus;
          toast.success(`Đã chuyển "${task.title}" sang "${colTitle}"!`);
        },
        onError: () => {
          toast.error('Không thể cập nhật trạng thái công việc.');
        },
      }
    );
  };

  return (
    <div className="space-y-5 text-text-primary pb-12">
      {/* Search & Action Bar */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center space-x-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder={t('board.searchBoard', { defaultValue: 'Tìm kiếm công việc trên bảng...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition shadow-xs"
            />
          </div>
          {isStaff && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-500 border border-amber-500/20">
              Chỉ hiển thị công việc được giao cho bạn
            </span>
          )}
        </div>

        {canCreateTask && (
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{isStaff ? 'Yêu cầu công việc' : 'Thêm công việc'}</span>
          </button>
        )}
      </div>

      {/* Kanban Board 4 Columns Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const ColumnIcon = col.icon;
          const colTasks = filteredTasks.filter((t) => {
            const st = t.status || 'TODO';
            if (col.id === 'DONE') return st === 'DONE' || st === 'COMPLETED';
            return st === col.id;
          });

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDragLeave={(e) => handleDragLeaveColumn(e, col.id)}
              onDrop={(e) => handleDropOnColumn(e, col.id)}
              className={`flex flex-col justify-between rounded-2xl border bg-surface-alt/40 p-3.5 min-h-[500px] shadow-xs border-t-4 transition-all duration-200 ${
                col.topBorder
              } ${
                dragOverColId === col.id
                  ? 'border-primary ring-2 ring-primary/40 bg-primary/5 scale-[1.01]'
                  : 'border-surface-border'
              }`}
            >
              <div>
                {/* Column Header */}
                <div className="mb-3.5 flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dotBg}`} />
                    <ColumnIcon className={`h-4 w-4 ${col.badgeText}`} />
                    <span className="text-xs font-bold text-text-primary font-heading">{col.title}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${col.badgeBg} ${col.badgeText} ${col.badgeBorder}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenCreateTask}
                    className="p-1 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
                    title="Thêm công việc mới vào cột này"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Drop Indicator placeholder when dragging over column */}
                {dragOverColId === col.id && (
                  <div className="mb-3 flex items-center justify-center p-2.5 rounded-xl border-2 border-dashed border-primary/50 bg-primary/10 text-primary text-[11px] font-bold animate-pulse">
                    Thả vào đây để chuyển sang "{col.title}"
                  </div>
                )}

                {/* Column Cards Stream */}
                <div className="space-y-3">
                  {colTasks.map((task) => {
                    const key = task.id.substring(0, 6).toUpperCase();
                    const dueDateStr = formatDueDate(task.dueDate);
                    const isCompleted = col.id === 'DONE' || task.status === 'DONE' || task.status === 'COMPLETED';
                    const isDraggable = canChangeTaskStatus(task);

                    return (
                      <div
                        key={task.id}
                        draggable={isDraggable}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          setSelectedTask(task);
                          onSelectTask?.(task);
                        }}
                        className={`group relative rounded-xl border p-3.5 shadow-xs transition duration-150 select-none ${
                          isDraggable ? 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5' : 'cursor-pointer'
                        } ${
                          draggedTaskId === task.id
                            ? 'opacity-40 scale-95 border-dashed border-primary ring-2 ring-primary/20'
                            : isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 hover:shadow-md'
                            : 'border-surface-border bg-surface hover:border-primary/40 hover:shadow-md'
                        }`}
                      >
                        {/* Task Header: Drag Grip, Sprint Badge, Priority Badge & Task Key */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1.5">
                            {isDraggable && (
                              <GripVertical className="h-3.5 w-3.5 text-text-muted/40 group-hover:text-text-muted transition shrink-0" />
                            )}
                            {getSprintBadge(task)}
                            {getPriorityBadge(task.priority)}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-text-muted">#{key}</span>
                        </div>

                        {/* Task Title */}
                        <h4
                          className={`text-xs font-bold font-heading leading-snug line-clamp-2 ${
                            isCompleted
                              ? 'line-through text-text-muted decoration-emerald-500/80 decoration-2'
                              : 'text-text-primary'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="inline-block mr-1 h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                          {task.title}
                        </h4>

                        {/* Due Date & Subtasks Metrics */}
                        <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold text-text-muted">
                          {dueDateStr ? (
                            <div className="flex items-center space-x-1">
                              <span>{tTask('dueDate', { defaultValue: 'Hạn chót' })}:</span>
                              <span className={`flex items-center space-x-1 rounded-md px-1.5 py-0.5 ${
                                isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                                <Calendar className="h-3 w-3" />
                                <span>{dueDateStr}</span>
                              </span>
                            </div>
                          ) : (
                            <span className="italic">Không có hạn chót</span>
                          )}

                          <div className="flex items-center space-x-2 text-text-muted">
                            <span className="flex items-center space-x-0.5" title="Checklist phụ">
                              <ListChecks className="h-3 w-3 text-primary" />
                              <span>2</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Footer: Status Change Selector & Assignee Info */}
                        <div className="mt-3 flex items-center justify-between border-t border-surface-border/60 pt-2.5 text-xs" onClick={(e) => e.stopPropagation()}>
                          {/* Change Status Dropdown (Triggers Confirmation Modal!) */}
                          <select
                            value={task.status || 'TODO'}
                            disabled={!canChangeTaskStatus(task)}
                            onChange={(e) => handleRequestStatusChange(task, e.target.value as TaskStatus)}
                            title={!canChangeTaskStatus(task) ? 'Bạn không có quyền thay đổi trạng thái' : undefined}
                            className={`rounded-lg border border-surface-border bg-surface px-2 py-0.5 text-[10px] font-bold text-text-secondary focus:border-primary focus:outline-none ${
                              canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            <option value="TODO">Cần làm</option>
                            <option value="IN_PROGRESS">Đang làm</option>
                            <option value="IN_REVIEW">Đang xem xét</option>
                            <option value="DONE">Hoàn thành</option>
                          </select>

                          {/* Assignee Information */}
                          <div className="flex items-center space-x-1.5 text-[11px]">
                            {task.assignee ? (
                              <div className="flex items-center space-x-1 rounded-lg bg-surface-alt px-2 py-0.5 border border-surface-border/80" title={task.assignee.fullName || task.assignee.email}>
                                <span className="font-semibold text-text-secondary truncate max-w-[120px]">
                                  {task.assignee.fullName || task.assignee.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-text-muted italic">Chưa phân công</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface/40 p-4 text-center">
                      <p className="text-[11px] text-text-muted italic">Trống</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Confirmation Modal for Task Status Change */}
      <ConfirmStatusChangeModal
        isOpen={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={handleConfirmStatusChange}
        taskTitle={pendingStatusChange?.task.title || ''}
        currentStatus={pendingStatusChange?.task.status || 'TODO'}
        newStatus={pendingStatusChange?.newStatus || 'DONE'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
