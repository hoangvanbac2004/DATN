'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  GripVertical,
  Flame,
  ArrowUpCircle,
  CircleDot,
  ArrowRight,
  TrendingUp,
  Filter,
} from 'lucide-react';
import type { TaskDto, TaskPriority, TaskStatus } from '@/features/task/types';
import { useUpdateTaskStatus } from '@/features/task/hooks/use-task';
import { useAuthStore } from '@/store/auth-store';
import { TaskDetailModal } from '@/features/task/components/task-detail-modal';
import { ConfirmStatusChangeModal } from '@/features/task/components/confirm-status-change-modal';
import {
  SprintItem,
  getStoredSprints,
  getStoredTaskSprintMapping,
  saveStoredTaskSprintMapping,
} from '@/features/project/services/sprint-service';

interface WorkspaceBoardTabProps {
  tasks: TaskDto[];
  isLoading: boolean;
  projectId?: string;
  initialSprintFilter?: string;
  onOpenCreateTask: () => void;
  onSelectTask?: (task: TaskDto) => void;
  onNavigateToBacklog?: () => void;
}

export function WorkspaceBoardTab({
  tasks,
  isLoading,
  projectId,
  initialSprintFilter,
  onOpenCreateTask,
  onSelectTask,
  onNavigateToBacklog,
}: WorkspaceBoardTabProps) {
  const { t } = useTranslation('workspace');
  const { t: tTask } = useTranslation('task');
  const user = useAuthStore((state) => state.user);
  const updateStatusMutation = useUpdateTaskStatus();

  // Sprints & Mapping State
  const [sprints, setSprints] = useState<SprintItem[]>([]);
  const [taskSprintMapping, setTaskSprintMapping] = useState<Record<string, string>>({});
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<string>(
    initialSprintFilter || 'ACTIVE_SPRINT'
  );

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<TaskStatus | null>(null);

  // Status Change Confirmation Modal State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    task: TaskDto;
    newStatus: TaskStatus;
  } | null>(null);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = !isAdmin && (user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com');
  const isStaff = !isAdmin && !isManager;
  const canManage = isAdmin || isManager;
  const canCreateTask = !!user;

  // Load Sprints & Mapping
  useEffect(() => {
    const update = () => {
      const loadedSprints = getStoredSprints(projectId);
      const loadedMapping = getStoredTaskSprintMapping(projectId);
      setSprints(loadedSprints);
      setTaskSprintMapping(loadedMapping);
    };
    update();
    window.addEventListener('sprints_updated', update);
    window.addEventListener('task_sprint_mapping_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('sprints_updated', update);
      window.removeEventListener('task_sprint_mapping_updated', update);
      window.removeEventListener('storage', update);
    };
  }, [projectId]);

  useEffect(() => {
    if (initialSprintFilter) {
      setSelectedSprintFilter(initialSprintFilter);
    }
  }, [initialSprintFilter]);

  const activeSprint = sprints.find((s) => s.status === 'ACTIVE');
  const currentFilteredSprint = useMemo(() => {
    if (selectedSprintFilter === 'ACTIVE_SPRINT') return activeSprint;
    if (selectedSprintFilter === 'ALL' || selectedSprintFilter === 'BACKLOG') return null;
    return sprints.find((s) => s.id === selectedSprintFilter) || null;
  }, [selectedSprintFilter, activeSprint, sprints]);

  // Check if user has permission to change task status
  const canChangeTaskStatus = (task: TaskDto): boolean => {
    if (!isStaff) return true;
    const assigneeEmail = task.assignee?.email;
    return !!assigneeEmail && assigneeEmail === user?.email;
  };

  // Move task to a different Sprint directly from Kanban card
  const handleAssignTaskToSprint = (taskId: string, targetSprintId: string) => {
    const updated = { ...taskSprintMapping };
    if (targetSprintId === 'backlog') {
      delete updated[taskId];
    } else {
      updated[taskId] = targetSprintId;
    }
    setTaskSprintMapping(updated);
    saveStoredTaskSprintMapping(updated, projectId);
    const sprintObj = sprints.find((s) => s.id === targetSprintId);
    toast.success(
      targetSprintId === 'backlog'
        ? 'Đã chuyển công việc về danh sách Backlog'
        : `Đã gán công việc vào ${sprintObj?.name || 'Sprint'}!`
    );
  };

  // Filter Tasks by Sprint, Role, Search and Priority
  const filteredTasks = useMemo(() => {
    let list = tasks;

    // Filter by Staff assignment
    if (isStaff && user) {
      list = list.filter(
        (t) =>
          t.assignee?.id === user.id ||
          t.assignee?.email === user.email ||
          t.assigneeId === user.id
      );
    }

    // Filter by Sprint
    if (selectedSprintFilter !== 'ALL') {
      list = list.filter((t) => {
        const assigned = taskSprintMapping[t.id];
        if (selectedSprintFilter === 'ACTIVE_SPRINT') {
          if (activeSprint) {
            if (assigned === activeSprint.id) return true;
            // Default if in progress and not mapped
            if (!assigned && (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW')) return true;
            return false;
          }
          return true;
        }
        if (selectedSprintFilter === 'BACKLOG') {
          const isDone = t.status === 'DONE' || t.status === 'COMPLETED';
          const isAssigned =
            assigned && sprints.some((s) => s.id === assigned && s.status !== 'COMPLETED');
          return !isDone && !isAssigned;
        }
        return assigned === selectedSprintFilter;
      });
    }

    // Search filter
    if (searchTerm.trim()) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    return list;
  }, [
    tasks,
    isStaff,
    user,
    selectedSprintFilter,
    taskSprintMapping,
    activeSprint,
    sprints,
    searchTerm,
    priorityFilter,
  ]);

  // Sprint Progress stats
  const sprintStats = useMemo(() => {
    if (!currentFilteredSprint) return null;
    const sTasks = tasks.filter((t) => {
      const assigned = taskSprintMapping[t.id];
      if (assigned === currentFilteredSprint.id) return true;
      if (
        !assigned &&
        currentFilteredSprint.status === 'ACTIVE' &&
        (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW')
      ) {
        return true;
      }
      return false;
    });
    const done = sTasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length;
    const total = sTasks.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percent };
  }, [currentFilteredSprint, tasks, taskSprintMapping]);

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
      icon: Clock,
    },
    {
      id: 'IN_PROGRESS',
      title: tTask('statuses.IN_PROGRESS', { defaultValue: 'Đang làm' }),
      badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      badgeText: 'text-blue-600 dark:text-blue-400',
      badgeBorder: 'border-blue-500/30',
      dotBg: 'bg-blue-500 animate-pulse',
      topBorder: 'border-t-blue-500',
      icon: PlayCircle,
    },
    {
      id: 'IN_REVIEW',
      title: tTask('statuses.IN_REVIEW', { defaultValue: 'Đang xem xét' }),
      badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      badgeText: 'text-amber-600 dark:text-amber-400',
      badgeBorder: 'border-amber-500/30',
      dotBg: 'bg-amber-500',
      topBorder: 'border-t-amber-500',
      icon: AlertCircle,
    },
    {
      id: 'DONE',
      title: tTask('statuses.DONE', { defaultValue: 'Hoàn thành' }),
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      badgeBorder: 'border-emerald-500/30',
      dotBg: 'bg-emerald-500',
      topBorder: 'border-t-emerald-500',
      icon: CheckCircle2,
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
        return (
          <span className="rounded-md border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-500">
            Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500">
            Cao
          </span>
        );
      case 'LOW':
        return (
          <span className="rounded-md border border-slate-500/30 bg-slate-500/10 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
            Thấp
          </span>
        );
      default:
        return (
          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-500">
            Trung bình
          </span>
        );
    }
  };

  const getSprintBadge = (task: TaskDto) => {
    const assigned = taskSprintMapping[task.id];
    if (assigned) {
      const sprint = sprints.find((s) => s.id === assigned);
      if (sprint) {
        return (
          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">
            {sprint.name}
          </span>
        );
      }
    }
    if (activeSprint && (task.status === 'IN_PROGRESS' || task.status === 'IN_REVIEW')) {
      return (
        <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">
          {activeSprint.name}
        </span>
      );
    }
    return (
      <span className="rounded-md border border-surface-border bg-surface-alt px-1.5 py-0.5 text-[9px] font-medium text-text-muted">
        Backlog
      </span>
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
    <div className="space-y-5 text-text-primary pb-16">
      {/* 1. SPRINT CONTEXT BANNER (Active Sprint Scrum Header) */}
      {currentFilteredSprint ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-blue-500/30 bg-surface p-4.5 shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <PlayCircle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-extrabold text-text-primary font-heading">
                  {currentFilteredSprint.name}
                </h3>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">
                  {currentFilteredSprint.status === 'ACTIVE' ? 'Sprint đang chạy' : 'Sprint dự kiến'}
                </span>
                <span className="text-xs text-text-muted">
                  ({currentFilteredSprint.startDate} – {currentFilteredSprint.endDate})
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                {currentFilteredSprint.goal || 'Mục tiêu hoàn thiện các tính năng cốt lõi'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {sprintStats && (
              <div className="flex items-center space-x-3 rounded-xl border border-surface-border bg-surface-alt px-3.5 py-1.5 text-xs font-semibold">
                <div className="flex items-center space-x-1 text-emerald-500 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{sprintStats.done}/{sprintStats.total} việc</span>
                </div>
                <span className="text-text-muted">({sprintStats.percent}%)</span>
                <div className="h-1.5 w-16 rounded-full bg-surface-border overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${sprintStats.percent}%` }}
                  />
                </div>
              </div>
            )}

            {onNavigateToBacklog && (
              <button
                type="button"
                onClick={onNavigateToBacklog}
                className="flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary hover:text-white px-3 py-1.5 text-xs font-bold text-primary transition active:scale-95 shadow-xs cursor-pointer"
                title="Mở tab Sprint & Backlog để điều chuyển hoặc thêm công việc vào chu kỳ"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Lập kế hoạch Sprint ➔</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        selectedSprintFilter === 'BACKLOG' && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Đang xem: Danh Sách Công Việc Tồn Đọng (Backlog Pool)
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Các công việc chưa được đưa vào chu kỳ Sprint nào
                </p>
              </div>
            </div>
            {onNavigateToBacklog && (
              <button
                type="button"
                onClick={onNavigateToBacklog}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                Đưa vào Sprint ➔
              </button>
            )}
          </div>
        )
      )}

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Sprint Filter Picker */}
          <div className="flex items-center space-x-1.5 rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-xs">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <select
              value={selectedSprintFilter}
              onChange={(e) => setSelectedSprintFilter(e.target.value)}
              className="bg-transparent font-bold text-text-primary focus:outline-none cursor-pointer"
            >
              {activeSprint && (
                <option value="ACTIVE_SPRINT" className="bg-surface text-blue-500 font-bold">
                  {activeSprint.name} (Đang chạy)
                </option>
              )}
              <option value="ALL" className="bg-surface text-text-primary">
                Tất cả công việc
              </option>
              {sprints
                .filter((s) => s.status !== 'ACTIVE' && s.status !== 'COMPLETED')
                .map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface text-amber-500">
                    {s.name} (Dự kiến)
                  </option>
                ))}
              <option value="BACKLOG" className="bg-surface text-slate-400">
                Kho Tồn đọng (Backlog)
              </option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-64 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder={t('board.searchBoard', { defaultValue: 'Tìm kiếm công việc trên bảng...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition shadow-xs"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="ALL">Mọi độ ưu tiên</option>
            <option value="URGENT">Khẩn cấp</option>
            <option value="HIGH">Cao</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="LOW">Thấp</option>
          </select>

          {isStaff && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-500 border border-amber-500/20">
              Chỉ việc của bạn
            </span>
          )}
        </div>

        {canCreateTask && (
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isStaff ? 'Yêu cầu công việc' : 'Thêm công việc'}</span>
          </button>
        )}
      </div>

      {/* 3. KANBAN 4-COLUMN GRID */}
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
              className={`flex flex-col justify-between rounded-2xl border bg-surface-alt/40 p-3.5 min-h-[520px] shadow-xs border-t-4 transition-all duration-200 ${
                col.topBorder
              } ${
                dragOverColId === col.id
                  ? 'border-primary ring-2 ring-primary/40 bg-primary/5 scale-[1.01]'
                  : 'border-surface-border'
              }`}
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 pb-1 border-b border-surface-border/40">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dotBg}`} />
                    <span className="text-xs font-bold text-text-primary font-heading">
                      {col.title}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${col.badgeBg} ${col.badgeText} ${col.badgeBorder}`}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  {canCreateTask && (
                    <button
                      type="button"
                      onClick={onOpenCreateTask}
                      className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text-primary transition cursor-pointer"
                      title="Thêm công việc vào cột này"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Task Cards List */}
                <div className="space-y-2.5">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border/60 p-6 text-center text-text-muted">
                      <p className="text-xs font-medium">Chưa có công việc</p>
                      <p className="text-[10px] mt-0.5">Kéo thả công việc vào đây</p>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const isDraggable = canChangeTaskStatus(task);
                      const key = task.id.substring(0, 6).toUpperCase();
                      const dueDateFormatted = formatDueDate(task.dueDate);

                      return (
                        <div
                          key={task.id}
                          draggable={isDraggable}
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onSelectTask?.(task)}
                          className={`group relative rounded-xl border border-surface-border bg-surface p-3 shadow-xs transition hover:border-primary/50 hover:shadow-md cursor-pointer ${
                            draggedTaskId === task.id ? 'opacity-40 scale-95' : ''
                          }`}
                        >
                          {/* Top Badges (Sprint + Priority + Issue Key) */}
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              {getSprintBadge(task)}
                              {getPriorityBadge(task.priority)}
                            </div>
                            <span className="font-mono text-[10px] font-bold text-text-muted shrink-0">
                              #{key}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-semibold text-text-primary leading-snug group-hover:text-primary transition line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Task Description Preview */}
                          {task.description && (
                            <p className="text-[11px] text-text-muted mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}

                          {/* Footer: Due Date, Assignee, Drag Grip */}
                          <div className="mt-3 flex items-center justify-between border-t border-surface-border/50 pt-2 text-[11px]">
                            <div className="flex items-center space-x-2 text-text-muted">
                              {dueDateFormatted ? (
                                <span className="text-[10px] font-medium text-text-secondary">
                                  {dueDateFormatted}
                                </span>
                              ) : (
                                <span className="text-[10px] text-text-muted italic">Không có hạn</span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1.5">
                              {task.assignee ? (
                                <div
                                  className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-xs"
                                  title={task.assignee.fullName || task.assignee.email}
                                >
                                  {(
                                    task.assignee.fullName || task.assignee.email
                                  )
                                    .substring(0, 1)
                                    .toUpperCase()}
                                </div>
                              ) : (
                                <div
                                  className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-text-muted text-[9px] text-text-muted"
                                  title="Chưa phân công"
                                >
                                  ?
                                </div>
                              )}

                              {isDraggable && (
                                <div
                                  className="text-text-muted/40 group-hover:text-text-muted transition cursor-grab"
                                  title="Kéo thả sang cột trạng thái khác"
                                >
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
