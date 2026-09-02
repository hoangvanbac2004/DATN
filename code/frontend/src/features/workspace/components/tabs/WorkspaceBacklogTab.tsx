'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Plus,
  PlayCircle,
  CheckCircle,
  Clock,
  CircleDot,
  Calendar,
  MoveRight,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronRight,
  Archive,
  Flame,
  ArrowUpCircle,
  Inbox,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Check,
  Flag,
} from 'lucide-react';
import type { TaskDto, TaskPriority, TaskStatus } from '@/features/task/types';
import { useUpdateTaskStatus } from '@/features/task/hooks/use-task';
import { useAuthStore } from '@/store/auth-store';
import { ConfirmStatusChangeModal } from '@/features/task/components/confirm-status-change-modal';
import { useWorkspaceMembers } from '@/features/workspace/hooks/use-workspace';
import { apiClient } from '@/lib/api-client';
import {
  getStoredTaskRequests,
  setStoredTaskRequests,
  type TaskRequestItem,
} from '@/features/task/components/pending-task-requests-section';
import {
  SprintItem,
  getStoredSprints,
  saveStoredSprints,
  getStoredTaskSprintMapping,
  saveStoredTaskSprintMapping,
} from '@/features/project/services/sprint-service';

interface WorkspaceBacklogTabProps {
  tasks: TaskDto[];
  isLoading: boolean;
  projectId?: string;
  workspaceId?: string;
  onOpenCreateTask: () => void;
  onSelectTask?: (task: TaskDto) => void;
}

export function WorkspaceBacklogTab({
  tasks,
  isLoading,
  projectId,
  workspaceId,
  onOpenCreateTask,
  onSelectTask,
}: WorkspaceBacklogTabProps) {
  const { t: tTask } = useTranslation('task');
  const user = useAuthStore((state) => state.user);
  const updateStatusMutation = useUpdateTaskStatus();

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com';
  const isStaff = !isAdmin && !isManager;
  const canManageSprint = isAdmin || isManager;
  const canCreateTask = !!user;

  // Sprints & Mapping State
  const [sprints, setSprints] = useState<SprintItem[]>([]);
  const [taskSprintMapping, setTaskSprintMapping] = useState<Record<string, string>>({});

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Collapse Sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    backlogPool: true,
    completedSprints: false,
  });

  // Sprint Creation / Edit Modal State
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null);
  const [sprintFormName, setSprintFormName] = useState('');
  const [sprintFormStartDate, setSprintFormStartDate] = useState('');
  const [sprintFormEndDate, setSprintFormEndDate] = useState('');
  const [sprintFormGoal, setSprintFormGoal] = useState('');
  const [sprintFormStatus, setSprintFormStatus] = useState<'ACTIVE' | 'PLANNED'>('PLANNED');

  // Complete Sprint Modal State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [sprintToComplete, setSprintToComplete] = useState<SprintItem | null>(null);
  const [incompleteTaskDestination, setIncompleteTaskDestination] = useState<string>('backlog');

  // Status Change Confirmation Modal
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    task: TaskDto;
    newStatus: TaskStatus;
  } | null>(null);

  // Staff Task Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetSprintForCreation, setTargetSprintForCreation] = useState<string>('backlog');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestPriority, setRequestPriority] = useState<TaskPriority>('MEDIUM');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const { data: workspaceMembers = [] } = useWorkspaceMembers(workspaceId || null);

  // Load Sprints & Mapping from Storage on mount / project change
  useEffect(() => {
    const loadedSprints = getStoredSprints(projectId);
    const loadedMapping = getStoredTaskSprintMapping(projectId);
    setSprints(loadedSprints);
    setTaskSprintMapping(loadedMapping);

    const initialOpen: Record<string, boolean> = {
      backlogPool: true,
      completedSprints: false,
    };
    loadedSprints.forEach((s) => {
      initialOpen[s.id] = true;
    });
    setOpenSections(initialOpen);
  }, [projectId]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeSprint = sprints.find((s) => s.status === 'ACTIVE');
  const plannedSprints = sprints.filter((s) => s.status === 'PLANNED');
  const completedSprints = sprints.filter((s) => s.status === 'COMPLETED');
  const availableSprintOptions = sprints.filter((s) => s.status !== 'COMPLETED');

  // Staff permission check for task status change
  const canChangeTaskStatus = (task: TaskDto): boolean => {
    if (!isStaff) return true;
    const assigneeEmail = task.assignee?.email;
    return !!assigneeEmail && assigneeEmail === user?.email;
  };

  // Open Create Sprint Modal
  const handleOpenCreateSprintModal = () => {
    const nextNum = sprints.length + 1;
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    setEditingSprintId(null);
    setSprintFormName(`Sprint ${nextNum}`);
    setSprintFormStartDate(fmt(start));
    setSprintFormEndDate(fmt(end));
    setSprintFormGoal('');
    setSprintFormStatus(activeSprint ? 'PLANNED' : 'ACTIVE');
    setIsSprintModalOpen(true);
  };

  // Open Edit Sprint Modal
  const handleOpenEditSprintModal = (sprint: SprintItem) => {
    setEditingSprintId(sprint.id);
    setSprintFormName(sprint.name);
    setSprintFormStartDate(sprint.startDate);
    setSprintFormEndDate(sprint.endDate);
    setSprintFormGoal(sprint.goal || '');
    setSprintFormStatus(sprint.status === 'COMPLETED' ? 'PLANNED' : sprint.status);
    setIsSprintModalOpen(true);
  };

  // Save Sprint (Create or Edit)
  const handleSaveSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintFormName.trim()) {
      toast.error('Vui lòng nhập tên Sprint.');
      return;
    }

    let updatedSprints: SprintItem[];

    if (editingSprintId) {
      // Edit existing
      updatedSprints = sprints.map((s) => {
        if (s.id === editingSprintId) {
          return {
            ...s,
            name: sprintFormName.trim(),
            startDate: sprintFormStartDate,
            endDate: sprintFormEndDate,
            goal: sprintFormGoal.trim(),
          };
        }
        return s;
      });
      toast.success('Đã cập nhật thông tin Sprint thành công!');
    } else {
      // Create new
      const newSprintId = `sprint-${projectId || 'prj'}-${Date.now()}`;
      const newSprint: SprintItem = {
        id: newSprintId,
        name: sprintFormName.trim(),
        startDate: sprintFormStartDate,
        endDate: sprintFormEndDate,
        goal: sprintFormGoal.trim() || 'Chu kỳ phát triển các tính năng mục tiêu',
        status: sprintFormStatus,
      };

      if (sprintFormStatus === 'ACTIVE') {
        // If set to active, make other sprints planned
        updatedSprints = [
          newSprint,
          ...sprints.map((s) => (s.status === 'ACTIVE' ? { ...s, status: 'PLANNED' as const } : s)),
        ];
      } else {
        updatedSprints = [...sprints, newSprint];
      }

      setOpenSections((prev) => ({ ...prev, [newSprintId]: true }));
      toast.success(`Đã tạo mới ${newSprint.name} thành công!`);
    }

    setSprints(updatedSprints);
    saveStoredSprints(updatedSprints, projectId);
    setIsSprintModalOpen(false);
  };

  // Delete Sprint Handler
  const handleDeleteSprint = (sprintId: string) => {
    const sprintToDelete = sprints.find((s) => s.id === sprintId);
    if (!sprintToDelete) return;

    // Return assigned tasks to backlog pool
    const updatedMapping = { ...taskSprintMapping };
    Object.keys(updatedMapping).forEach((taskId) => {
      if (updatedMapping[taskId] === sprintId) {
        delete updatedMapping[taskId];
      }
    });
    setTaskSprintMapping(updatedMapping);
    saveStoredTaskSprintMapping(updatedMapping, projectId);

    const updatedSprints = sprints.filter((s) => s.id !== sprintId);
    setSprints(updatedSprints);
    saveStoredSprints(updatedSprints, projectId);
    toast.success(`Đã xóa ${sprintToDelete.name}. Các công việc đã được hoàn về Backlog.`);
  };

  // Start Sprint Handler
  const handleStartSprint = (sprintId: string) => {
    const updatedSprints = sprints.map((s) => {
      if (s.id === sprintId) {
        return { ...s, status: 'ACTIVE' as const };
      }
      // If there was an active sprint, set to planned or keep
      if (s.status === 'ACTIVE') {
        return { ...s, status: 'PLANNED' as const };
      }
      return s;
    });
    setSprints(updatedSprints);
    saveStoredSprints(updatedSprints, projectId);
    setOpenSections((prev) => ({ ...prev, [sprintId]: true }));
    const target = sprints.find((s) => s.id === sprintId);
    toast.success(`Đã bắt đầu ${target?.name || 'Sprint'} thành công! 🚀`);
  };

  // Open Complete Sprint Modal
  const handleOpenCompleteSprint = (sprint: SprintItem) => {
    setSprintToComplete(sprint);
    if (plannedSprints.length > 0) {
      setIncompleteTaskDestination(plannedSprints[0].id);
    } else {
      setIncompleteTaskDestination('backlog');
    }
    setIsCompleteModalOpen(true);
  };

  // Confirm Complete Sprint Handler
  const handleConfirmCompleteSprint = () => {
    if (!sprintToComplete) return;

    const sprintTasks = getTasksForSprint(sprintToComplete.id);
    const incompleteTasks = sprintTasks.filter(
      (t) => t.status !== 'DONE' && t.status !== 'COMPLETED'
    );

    // Update mapping for incomplete tasks
    const updatedMapping = { ...taskSprintMapping };
    incompleteTasks.forEach((task) => {
      if (incompleteTaskDestination === 'backlog') {
        delete updatedMapping[task.id];
      } else {
        updatedMapping[task.id] = incompleteTaskDestination;
      }
    });
    setTaskSprintMapping(updatedMapping);
    saveStoredTaskSprintMapping(updatedMapping, projectId);

    const updatedSprints = sprints.map((s) =>
      s.id === sprintToComplete.id
        ? {
            ...s,
            status: 'COMPLETED' as const,
            completedAt: new Date().toLocaleDateString('vi-VN'),
          }
        : s
    );
    setSprints(updatedSprints);
    saveStoredSprints(updatedSprints, projectId);

    setIsCompleteModalOpen(false);
    toast.success(`Đã hoàn thành ${sprintToComplete.name} thành công! 🎉`);
    setSprintToComplete(null);
  };

  // Move Task between Sprints and Backlog
  const handleAssignTaskToSprint = (taskId: string, targetSprintId: string) => {
    const updatedMapping = { ...taskSprintMapping };
    if (targetSprintId === 'backlog') {
      delete updatedMapping[taskId];
    } else {
      updatedMapping[taskId] = targetSprintId;
    }
    setTaskSprintMapping(updatedMapping);
    saveStoredTaskSprintMapping(updatedMapping, projectId);

    if (targetSprintId === 'backlog') {
      toast.success('Đã chuyển công việc về danh sách tồn đọng (Backlog).');
    } else {
      const targetSprint = sprints.find((s) => s.id === targetSprintId);
      toast.success(`Đã đưa công việc vào ${targetSprint?.name || 'Sprint'}!`);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Helper to get tasks for a specific sprint
  const getTasksForSprint = (sprintId: string) => {
    return filteredTasks.filter((t) => {
      const assignedSprint = taskSprintMapping[t.id];
      if (assignedSprint === sprintId) return true;
      // Default: if no assignment and sprint is first active sprint and task in progress
      if (
        !assignedSprint &&
        activeSprint &&
        sprintId === activeSprint.id &&
        (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW')
      ) {
        return true;
      }
      return false;
    });
  };

  // Active Sprint Tasks
  const activeSprintTasks = activeSprint ? getTasksForSprint(activeSprint.id) : [];

  // Backlog Pool Tasks
  const backlogPoolTasks = filteredTasks.filter((t) => {
    const isCompleted = t.status === 'DONE' || t.status === 'COMPLETED';
    const assignedSprint = taskSprintMapping[t.id];
    const isAssignedToActiveOrPlanned =
      assignedSprint && sprints.some((s) => s.id === assignedSprint && s.status !== 'COMPLETED');
    const isDefaultActive =
      !assignedSprint && (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW') && !!activeSprint;
    return !isCompleted && !isAssignedToActiveOrPlanned && !isDefaultActive;
  });

  // Calculations for Active Sprint
  const activeDoneCount = activeSprintTasks.filter(
    (t) => t.status === 'DONE' || t.status === 'COMPLETED'
  ).length;
  const activeInProgressCount = activeSprintTasks.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW'
  ).length;
  const activeTodoCount = activeSprintTasks.length - activeDoneCount - activeInProgressCount;
  const activePercent =
    activeSprintTasks.length > 0
      ? Math.round((activeDoneCount / activeSprintTasks.length) * 100)
      : 0;

  // Status Change Request Handler
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
          toast.success('Đã cập nhật trạng thái công việc thành công!');
        },
      }
    );
  };

  // Open Task Creation / Request
  const handleOpenCreateOrRequest = (targetSprint: string = 'backlog') => {
    setTargetSprintForCreation(targetSprint);
    if (isStaff) {
      setRequestTitle('');
      setRequestDesc('');
      setRequestPriority('MEDIUM');
      setShowRequestModal(true);
    } else {
      onOpenCreateTask();
    }
  };

  // Send Staff Task Request
  const handleSendTaskRequest = async () => {
    if (!requestTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề công việc.');
      return;
    }
    setIsSendingRequest(true);
    try {
      const newRequest: TaskRequestItem = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: requestTitle.trim(),
        description: requestDesc.trim() || undefined,
        priority: requestPriority,
        requesterId: user?.id || 'unknown',
        requesterName: user?.fullName || user?.email?.split('@')[0] || 'Nhân viên',
        requesterEmail: user?.email || '',
        workspaceId,
        projectId,
        status: 'PENDING',
        createdAt: new Date().toLocaleString('vi-VN'),
      };

      const updated = [newRequest, ...getStoredTaskRequests()];
      setStoredTaskRequests(updated);

      // Notify Managers / Admins
      const managers = workspaceMembers.filter(
        (m) => m.role === 'ADMIN' || m.role === 'MANAGER' || m.role === 'OWNER'
      );
      const senderName = user?.fullName || user?.email || 'Một thành viên';
      const notificationPayload = {
        title: '📋 Yêu cầu tạo công việc mới',
        message: `${senderName} gửi yêu cầu tạo công việc: "${requestTitle.trim()}"`,
        type: 'SYSTEM',
      };

      if (managers.length > 0) {
        await Promise.allSettled(
          managers.map((m) =>
            apiClient.post('/notifications', { ...notificationPayload, userId: m.userId })
          )
        );
      }

      toast.success('Đã gửi yêu cầu tạo công việc tới Quản lý / Quản trị viên để phê duyệt!');
      setShowRequestModal(false);
    } catch {
      toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsSendingRequest(false);
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const p = priority?.toUpperCase() || 'MEDIUM';
    switch (p) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-500">
            <Flame className="h-3 w-3 animate-pulse" />
            <span>Khẩn cấp</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-500">
            <ArrowUpCircle className="h-3 w-3" />
            <span>Cao</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-slate-500/10 border border-slate-500/30 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            <CircleDot className="h-3 w-3" />
            <span>Thấp</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
            <CircleDot className="h-3 w-3" />
            <span>Trung bình</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status?: TaskStatus) => {
    switch (status) {
      case 'DONE':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
            <CheckCircle className="h-3 w-3" />
            <span>Hoàn thành</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-500">
            <PlayCircle className="h-3 w-3 animate-pulse" />
            <span>Đang làm</span>
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-500">
            <Clock className="h-3 w-3" />
            <span>Đang xem xét</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-slate-500/10 border border-slate-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
            <CircleDot className="h-3 w-3" />
            <span>Cần làm</span>
          </span>
        );
    }
  };

  return (
    <>
      <div className="space-y-6 text-text-primary pb-16">
        {/* 1. TOP METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Sprint Card */}
          <div className="rounded-2xl border border-surface-border bg-surface p-4.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Giai đoạn đang chạy</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <PlayCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-text-primary font-heading">
                {activeSprint ? activeSprint.name : 'Chưa kích hoạt'}
              </span>
              <span className="text-xs font-bold text-blue-500">
                {activeSprint ? 'Đang chạy' : 'Trống'}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              {activeSprint ? `${activeSprint.startDate} – ${activeSprint.endDate}` : 'Bắt đầu Sprint bên dưới'}
            </p>
          </div>

          {/* Sprint Progress Card */}
          <div className="rounded-2xl border border-surface-border bg-surface p-4.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Tiến độ Sprint hiện tại</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-text-primary font-heading">{activePercent}%</span>
              <span className="text-xs text-text-muted">
                ({activeDoneCount}/{activeSprintTasks.length} hoàn tất)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-alt overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${activePercent}%` }}
              />
            </div>
          </div>

          {/* Backlog Pool Card */}
          <div className="rounded-2xl border border-surface-border bg-surface p-4.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Tồn đọng (Backlog)</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-text-primary font-heading">
                {backlogPoolTasks.length}
              </span>
              <span className="text-xs font-bold text-amber-500">chờ lập kế hoạch</span>
            </div>
            <p className="text-[11px] text-text-muted">Sẵn sàng phân bổ vào chu kỳ Sprint</p>
          </div>

          {/* Total Tasks Card */}
          <div className="rounded-2xl border border-surface-border bg-surface p-4.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Tổng số công việc</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <Inbox className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-text-primary font-heading">
                {tasks.length}
              </span>
              <span className="text-xs text-text-muted">trong dự án</span>
            </div>
            <p className="text-[11px] text-text-muted">Theo dõi theo mô hình Agile Scrum</p>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm công việc trong Sprint hoặc Backlog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-alt pl-10 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Mọi độ ưu tiên</option>
              <option value="URGENT">Khẩn cấp</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="TODO">Cần làm</option>
              <option value="IN_PROGRESS">Đang làm</option>
              <option value="IN_REVIEW">Đang xem xét</option>
              <option value="DONE">Hoàn thành</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {canManageSprint && (
              <button
                type="button"
                onClick={handleOpenCreateSprintModal}
                className="flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition active:scale-95 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo Sprint mới</span>
              </button>
            )}

            {canCreateTask && (
              <button
                type="button"
                onClick={() => handleOpenCreateOrRequest('backlog')}
                className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{isStaff ? 'Yêu cầu công việc' : 'Tạo công việc'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. SPRINTS & BACKLOG CONTAINERS */}
        <div className="space-y-6">
          {/* ================= ACTIVE SPRINT ================= */}
          {activeSprint ? (
            <div className="rounded-2xl border-2 border-blue-500/40 bg-surface overflow-hidden shadow-sm transition hover:border-blue-500/60">
              {/* Active Sprint Header */}
              <div className="bg-surface-alt/70 px-5 py-4 border-b border-surface-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(activeSprint.id)}
                      className="rounded-lg p-1 text-text-secondary hover:bg-surface-border hover:text-text-primary transition cursor-pointer"
                    >
                      {openSections[activeSprint.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <PlayCircle className="h-4 w-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-extrabold text-text-primary font-heading">
                            {activeSprint.name}
                          </h3>
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">
                            Đang diễn ra
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {activeSprint.goal || 'Mục tiêu Sprint hiện tại'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5 text-xs text-text-muted">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      <span>
                        {activeSprint.startDate} – {activeSprint.endDate}
                      </span>
                    </div>

                    <div className="rounded-xl border border-surface-border bg-surface px-3 py-1 text-xs font-bold">
                      <span className="text-emerald-500">{activeDoneCount} xong</span>
                      <span className="text-text-muted"> / {activeSprintTasks.length} việc</span>
                    </div>

                    {canManageSprint && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSprintModal(activeSprint)}
                          className="rounded-xl p-1.5 text-text-secondary hover:bg-surface hover:text-text-primary transition cursor-pointer border border-surface-border"
                          title="Chỉnh sửa Sprint"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenCompleteSprint(activeSprint)}
                          className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Hoàn thành Sprint</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 flex items-center space-x-3">
                  <div className="flex-1 h-2 rounded-full bg-surface-border/60 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{
                        width: `${(activeDoneCount / (activeSprintTasks.length || 1)) * 100}%`,
                      }}
                      title="Đã hoàn thành"
                    />
                    <div
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{
                        width: `${(activeInProgressCount / (activeSprintTasks.length || 1)) * 100}%`,
                      }}
                      title="Đang thực hiện"
                    />
                    <div
                      className="bg-slate-400 h-full transition-all duration-300"
                      style={{
                        width: `${(activeTodoCount / (activeSprintTasks.length || 1)) * 100}%`,
                      }}
                      title="Cần làm"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-text-muted whitespace-nowrap">
                    {activePercent}% hoàn tất
                  </span>
                </div>
              </div>

              {/* Task List Inside Active Sprint */}
              {openSections[activeSprint.id] && (
                <div className="divide-y divide-surface-border/50 bg-surface">
                  {activeSprintTasks.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <Inbox className="h-8 w-8 text-text-muted mx-auto opacity-50" />
                      <p className="text-xs font-medium text-text-muted">Sprint này chưa có công việc nào.</p>
                      <p className="text-[11px] text-text-muted">
                        Chọn công việc từ danh sách Backlog bên dưới hoặc bấm thêm công việc trực tiếp vào Sprint.
                      </p>
                    </div>
                  ) : (
                    activeSprintTasks.map((task) => {
                      const key = task.id.substring(0, 6).toUpperCase();
                      const isDone = task.status === 'DONE' || task.status === 'COMPLETED';

                      return (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask?.(task)}
                          className="group flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs transition duration-150 hover:bg-surface-alt/60 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={isDone}
                              disabled={!canChangeTaskStatus(task)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() =>
                                handleRequestStatusChange(task, isDone ? 'TODO' : 'DONE')
                              }
                              className={`h-4 w-4 rounded-md border-surface-border text-primary focus:ring-primary transition ${
                                canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                              }`}
                            />

                            <div className="flex items-center space-x-2 shrink-0">
                              {getPriorityBadge(task.priority)}
                              <span className="font-mono text-[11px] font-bold text-text-muted">
                                #{key}
                              </span>
                            </div>

                            <span
                              className={`font-semibold text-text-primary truncate group-hover:text-primary transition ${
                                isDone ? 'line-through text-text-muted decoration-emerald-500 decoration-2' : ''
                              }`}
                            >
                              {isDone && (
                                <CheckCircle2 className="inline-block mr-1.5 h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              )}
                              {task.title}
                            </span>
                          </div>

                          <div
                            className="flex items-center space-x-2.5 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Move Sprint Selector */}
                            <div
                              className={`flex items-center space-x-1 rounded-xl border border-surface-border bg-surface-alt px-2 py-1 ${
                                canManageSprint ? '' : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <MoveRight className="h-3 w-3 text-primary" />
                              <select
                                value={taskSprintMapping[task.id] || activeSprint.id}
                                disabled={!canManageSprint}
                                onChange={(e) => handleAssignTaskToSprint(task.id, e.target.value)}
                                className={`bg-transparent text-[11px] font-bold text-primary focus:outline-none ${
                                  canManageSprint ? 'cursor-pointer' : 'cursor-not-allowed'
                                }`}
                              >
                                <option value={activeSprint.id} className="bg-surface text-blue-500">
                                  ✓ {activeSprint.name}
                                </option>
                                {plannedSprints.map((ps) => (
                                  <option key={ps.id} value={ps.id} className="bg-surface text-text-primary">
                                    ➔ {ps.name}
                                  </option>
                                ))}
                                <option value="backlog" className="bg-surface text-amber-500">
                                  ➔ Chuyển về Backlog
                                </option>
                              </select>
                            </div>

                            {/* Status Selector */}
                            <select
                              value={task.status || 'IN_PROGRESS'}
                              disabled={!canChangeTaskStatus(task)}
                              onChange={(e) =>
                                handleRequestStatusChange(task, e.target.value as TaskStatus)
                              }
                              className={`rounded-xl border border-surface-border bg-surface px-2.5 py-1 text-[11px] font-bold text-text-primary focus:border-primary focus:outline-none ${
                                canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                              }`}
                            >
                              <option value="TODO">Cần làm</option>
                              <option value="IN_PROGRESS">Đang làm</option>
                              <option value="IN_REVIEW">Đang xem xét</option>
                              <option value="DONE">Hoàn thành</option>
                            </select>

                            {/* Assignee Avatar */}
                            {task.assignee ? (
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs"
                                title={task.assignee.fullName || task.assignee.email}
                              >
                                {(task.assignee.fullName || task.assignee.email).substring(0, 1).toUpperCase()}
                              </div>
                            ) : (
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-text-muted text-[10px] text-text-muted"
                                title="Chưa phân công"
                              >
                                ?
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Inline Add Task Button */}
                  <div className="p-3 bg-surface-alt/20 border-t border-surface-border/50">
                    <button
                      type="button"
                      onClick={() => handleOpenCreateOrRequest(activeSprint.id)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-text-muted hover:text-primary transition cursor-pointer px-2 py-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isStaff ? 'Gửi yêu cầu công việc vào Sprint này' : 'Tạo công việc trong Sprint này'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* No Active Sprint Banner */
            <div className="rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-500 mx-auto">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary font-heading">
                  Hiện tại không có Sprint nào đang chạy
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Bắt đầu một Sprint dự kiến bên dưới hoặc tạo Sprint mới để triển khai chu kỳ công việc.
                </p>
              </div>
              {plannedSprints.length > 0 && canManageSprint && (
                <button
                  type="button"
                  onClick={() => handleStartSprint(plannedSprints[0].id)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition shadow-sm active:scale-95 cursor-pointer"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Bắt đầu {plannedSprints[0].name}</span>
                </button>
              )}
            </div>
          )}

          {/* ================= FUTURE PLANNED SPRINTS ================= */}
          {plannedSprints.map((sprint) => {
            const sprintTasks = getTasksForSprint(sprint.id);
            const isOpen = openSections[sprint.id] ?? true;

            return (
              <div
                key={sprint.id}
                className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-xs transition hover:border-surface-border/80"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-alt/50 px-5 py-3.5 border-b border-surface-border">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(sprint.id)}
                      className="rounded-lg p-1 text-text-secondary hover:bg-surface hover:text-text-primary transition cursor-pointer"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-text-primary font-heading">
                        {sprint.name}
                      </span>
                      <span className="rounded-full bg-surface border border-surface-border px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                        Dự kiến
                      </span>
                    </div>

                    <span className="text-xs text-text-muted">
                      {sprint.startDate} – {sprint.endDate} ({sprintTasks.length} việc)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {canManageSprint && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditSprintModal(sprint)}
                          className="rounded-xl border border-surface-border bg-surface p-1.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary transition cursor-pointer"
                          title="Chỉnh sửa Sprint"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSprint(sprint.id)}
                          className="rounded-xl border border-surface-border bg-surface p-1.5 text-text-muted hover:bg-rose-500/10 hover:text-rose-500 transition cursor-pointer"
                          title="Xóa Sprint"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartSprint(sprint.id)}
                          className="flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition active:scale-95 shadow-xs cursor-pointer"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          <span>Bắt đầu Sprint</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="divide-y divide-surface-border/50 bg-surface">
                    {sprintTasks.length === 0 ? (
                      <div className="p-6 text-center space-y-1.5">
                        <Inbox className="h-6 w-6 text-text-muted mx-auto opacity-40" />
                        <p className="text-xs font-medium text-text-muted">Chưa có công việc nào trong kế hoạch Sprint này.</p>
                      </div>
                    ) : (
                      sprintTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask?.(task)}
                          className="flex items-center justify-between p-3.5 px-5 text-xs hover:bg-surface-alt/40 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            {getPriorityBadge(task.priority)}
                            <span className="font-semibold text-text-primary">{task.title}</span>
                          </div>
                          <div
                            className="flex items-center space-x-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className={`flex items-center space-x-1 rounded-xl border border-surface-border bg-surface-alt px-2 py-0.5 ${
                                canManageSprint ? '' : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <MoveRight className="h-3 w-3 text-primary" />
                              <select
                                value={taskSprintMapping[task.id] || sprint.id}
                                disabled={!canManageSprint}
                                onChange={(e) => handleAssignTaskToSprint(task.id, e.target.value)}
                                className={`bg-transparent text-[10px] font-bold text-primary focus:outline-none ${
                                  canManageSprint ? 'cursor-pointer' : 'cursor-not-allowed'
                                }`}
                              >
                                {availableSprintOptions.map((s) => (
                                  <option key={s.id} value={s.id} className="bg-surface text-text-primary">
                                    {s.id === sprint.id ? `✓ ${s.name}` : `➔ ${s.name}`}
                                  </option>
                                ))}
                                <option value="backlog" className="bg-surface text-amber-500">
                                  ➔ Chuyển về Backlog
                                </option>
                              </select>
                            </div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                      ))
                    )}

                    {/* Inline Add Task to this planned sprint */}
                    <div className="p-3 bg-surface-alt/20 border-t border-surface-border/50">
                      <button
                        type="button"
                        onClick={() => handleOpenCreateOrRequest(sprint.id)}
                        className="flex items-center space-x-1.5 text-xs font-semibold text-text-muted hover:text-primary transition cursor-pointer px-2 py-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Thêm công việc vào kế hoạch Sprint này</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* ================= BACKLOG POOL (TỒN ĐỌNG) ================= */}
          <div className="rounded-2xl border-2 border-amber-500/20 bg-surface overflow-hidden shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/5 px-5 py-4 border-b border-surface-border">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => toggleSection('backlogPool')}
                  className="rounded-lg p-1 text-text-secondary hover:bg-surface hover:text-text-primary transition cursor-pointer"
                >
                  {openSections.backlogPool ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-text-primary font-heading">
                        Danh Sách Công Việc Tồn Đọng (Backlog Pool)
                      </h3>
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                        {backlogPoolTasks.length} công việc
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Các hạng mục công việc đang chờ phân bổ vào chu kỳ Sprint
                    </p>
                  </div>
                </div>
              </div>

              {canCreateTask && (
                <button
                  type="button"
                  onClick={() => handleOpenCreateOrRequest('backlog')}
                  className="flex items-center space-x-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500 hover:text-white transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isStaff ? 'Yêu cầu thêm vào Backlog' : 'Thêm vào Backlog'}</span>
                </button>
              )}
            </div>

            {openSections.backlogPool && (
              <div className="divide-y divide-surface-border/50 bg-surface">
                {backlogPoolTasks.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto opacity-70" />
                    <p className="text-xs font-semibold text-text-primary">Danh sách Backlog đang trống!</p>
                    <p className="text-[11px] text-text-muted">
                      Tất cả công việc đã được đưa vào Sprint hoặc đã hoàn thành.
                    </p>
                  </div>
                ) : (
                  backlogPoolTasks.map((task) => {
                    const key = task.id.substring(0, 6).toUpperCase();

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask?.(task)}
                        className="group flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs transition duration-150 hover:bg-surface-alt/60 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={false}
                            disabled={!canChangeTaskStatus(task)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => handleRequestStatusChange(task, 'DONE')}
                            className={`h-4 w-4 rounded-md border-surface-border text-primary focus:ring-primary transition ${
                              canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                          />

                          <div className="flex items-center space-x-2 shrink-0">
                            {getPriorityBadge(task.priority)}
                            <span className="font-mono text-[11px] font-bold text-text-muted">
                              #{key}
                            </span>
                          </div>

                          <span className="font-semibold text-text-primary truncate group-hover:text-primary transition">
                            {task.title}
                          </span>
                        </div>

                        <div
                          className="flex items-center space-x-2.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Quick Assign to Sprint Selector */}
                          <div
                            className={`flex items-center space-x-1 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1 ${
                              canManageSprint ? '' : 'opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <MoveRight className="h-3.5 w-3.5 text-primary" />
                            <select
                              value={taskSprintMapping[task.id] || 'backlog'}
                              disabled={!canManageSprint}
                              onChange={(e) => handleAssignTaskToSprint(task.id, e.target.value)}
                              className={`bg-transparent text-[11px] font-bold text-primary focus:outline-none ${
                                canManageSprint ? 'cursor-pointer' : 'cursor-not-allowed'
                              }`}
                            >
                              <option value="backlog" className="bg-surface text-text-muted">
                                ➔ Ở lại Backlog
                              </option>
                              {availableSprintOptions.map((s) => (
                                <option key={s.id} value={s.id} className="bg-surface text-text-primary">
                                  ➔ Đưa vào {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {getStatusBadge(task.status)}

                          {task.assignee ? (
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs"
                              title={task.assignee.fullName || task.assignee.email}
                            >
                              {(task.assignee.fullName || task.assignee.email).substring(0, 1).toUpperCase()}
                            </div>
                          ) : (
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-text-muted text-[10px] text-text-muted"
                              title="Chưa phân công"
                            >
                              ?
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* ================= COMPLETED SPRINTS ARCHIVE ================= */}
          {completedSprints.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/20 bg-surface overflow-hidden shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-500/5 px-5 py-3.5 border-b border-surface-border">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => toggleSection('completedSprints')}
                    className="rounded-lg p-1 text-text-secondary hover:bg-surface hover:text-text-primary transition cursor-pointer"
                  >
                    {openSections.completedSprints ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <Archive className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-bold text-text-primary font-heading">
                      Sprint Đã Hoàn Thành ({completedSprints.length})
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                      Lịch sử Scrum
                    </span>
                  </div>
                </div>
              </div>

              {openSections.completedSprints && (
                <div className="divide-y divide-surface-border/50 p-4 space-y-3 bg-surface-alt/10">
                  {completedSprints.map((cs) => {
                    const tasksInSprint = getTasksForSprint(cs.id);
                    const doneCount = tasksInSprint.filter(
                      (t) => t.status === 'DONE' || t.status === 'COMPLETED'
                    ).length;

                    return (
                      <div
                        key={cs.id}
                        className="rounded-xl border border-surface-border bg-surface p-3.5 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-bold text-text-primary">{cs.name}</span>
                            <span className="text-[10px] text-text-muted">
                              ({cs.startDate} – {cs.endDate})
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted">{cs.goal}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-emerald-500">
                            {doneCount}/{tasksInSprint.length} hoàn thành
                          </span>
                          {canManageSprint && (
                            <button
                              type="button"
                              onClick={() => handleStartSprint(cs.id)}
                              className="flex items-center space-x-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Mở lại Sprint</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== SPRINT CREATE / EDIT MODAL ===== */}
        {isSprintModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsSprintModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 text-text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Flag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary font-heading">
                      {editingSprintId ? 'Chỉnh sửa Sprint' : 'Tạo mới chu kỳ Sprint'}
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      Thiết lập mục tiêu và thời gian thực hiện chu kỳ Scrum
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSprintModalOpen(false)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-alt hover:text-text-primary transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSprint} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-text-secondary">Tên Sprint *</label>
                  <input
                    type="text"
                    required
                    value={sprintFormName}
                    onChange={(e) => setSprintFormName(e.target.value)}
                    placeholder="Ví dụ: Sprint 3..."
                    className="w-full rounded-xl border border-surface-border bg-surface-alt px-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-text-secondary">Ngày bắt đầu *</label>
                    <input
                      type="date"
                      required
                      value={sprintFormStartDate}
                      onChange={(e) => setSprintFormStartDate(e.target.value)}
                      className="w-full rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-text-secondary">Ngày kết thúc *</label>
                    <input
                      type="date"
                      required
                      value={sprintFormEndDate}
                      onChange={(e) => setSprintFormEndDate(e.target.value)}
                      className="w-full rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-secondary">Mục tiêu Sprint</label>
                  <textarea
                    rows={3}
                    value={sprintFormGoal}
                    onChange={(e) => setSprintFormGoal(e.target.value)}
                    placeholder="Mục tiêu chính mà nhóm cần đạt được trong Sprint này..."
                    className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 border-t border-surface-border pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsSprintModalOpen(false)}
                    className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition active:scale-95 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingSprintId ? 'Lưu thay đổi' : 'Tạo Sprint'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== COMPLETE SPRINT MODAL ===== */}
        {isCompleteModalOpen && sprintToComplete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsCompleteModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 text-text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h3 className="text-sm font-bold text-text-primary font-heading flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>Hoàn thành {sprintToComplete.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-alt transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {(() => {
                const sTasks = getTasksForSprint(sprintToComplete.id);
                const completedCount = sTasks.filter(
                  (t) => t.status === 'DONE' || t.status === 'COMPLETED'
                ).length;
                const incompleteCount = sTasks.length - completedCount;

                return (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                        <div className="text-xl font-bold text-emerald-500 font-heading">
                          {completedCount}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                          Công việc hoàn thành
                        </div>
                      </div>

                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                        <div className="text-xl font-bold text-amber-500 font-heading">
                          {incompleteCount}
                        </div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
                          Chưa hoàn thành
                        </div>
                      </div>
                    </div>

                    {incompleteCount > 0 ? (
                      <div className="space-y-1.5 rounded-xl border border-surface-border bg-surface-alt p-3">
                        <label className="font-bold text-text-primary block text-[11px]">
                          Chuyển {incompleteCount} công việc chưa hoàn thành đến:
                        </label>
                        <select
                          value={incompleteTaskDestination}
                          onChange={(e) => setIncompleteTaskDestination(e.target.value)}
                          className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                        >
                          {plannedSprints.map((ps) => (
                            <option key={ps.id} value={ps.id}>
                              ➔ {ps.name} (Sprint dự kiến tiếp theo)
                            </option>
                          ))}
                          <option value="backlog">➔ Danh sách tồn đọng (Backlog Pool)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center text-xs text-emerald-500 font-medium">
                        🎉 Xuất sắc! Tất cả công việc trong Sprint này đều đã hoàn thành 100%!
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-end space-x-2 border-t border-surface-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCompleteSprint}
                  className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Xác nhận hoàn thành</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== STATUS CHANGE CONFIRMATION MODAL ===== */}
        {pendingStatusChange && (
          <ConfirmStatusChangeModal
            isOpen={!!pendingStatusChange}
            taskTitle={pendingStatusChange.task.title}
            currentStatus={pendingStatusChange.task.status || 'TODO'}
            newStatus={pendingStatusChange.newStatus}
            onConfirm={handleConfirmStatusChange}
            onClose={() => setPendingStatusChange(null)}
            isLoading={updateStatusMutation.isPending}
          />
        )}

        {/* ===== STAFF TASK REQUEST MODAL ===== */}
        {showRequestModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setShowRequestModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-text-primary font-heading">
                    📎 Gửi yêu cầu tạo công việc
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Yêu cầu sẽ được chuyển tới Quản lý / Quản trị viên để phê duyệt
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-alt hover:text-text-primary transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-text-secondary">
                    Tiêu đề công việc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder="Ví dụ: Triển khai kiểm thử giao diện..."
                    className="w-full rounded-xl border border-surface-border bg-surface-alt px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-secondary">Mô tả ngắn</label>
                  <textarea
                    rows={3}
                    value={requestDesc}
                    onChange={(e) => setRequestDesc(e.target.value)}
                    placeholder="Chi tiết yêu cầu, phạm vi và mục tiêu..."
                    className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-text-secondary">Mức độ ưu tiên đề xuất</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setRequestPriority(p)}
                        className={`rounded-xl border py-2 text-xs font-bold transition cursor-pointer ${
                          requestPriority === p
                            ? 'border-primary bg-primary/10 text-primary shadow-xs'
                            : 'border-surface-border bg-surface-alt text-text-muted hover:bg-surface hover:text-text-primary'
                        }`}
                      >
                        {p === 'URGENT' ? '🔥 Gấp' : p === 'HIGH' ? '⚡ Cao' : p === 'MEDIUM' ? '⚖️ Vừa' : '☕ Thấp'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-[11px] text-blue-500">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Yêu cầu sẽ xuất hiện tại tab <strong>Tổng quan</strong> của dự án. Sau khi được duyệt, công việc sẽ được tự động tạo vào hệ thống.
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2 border-t border-surface-border pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTaskRequest}
                    disabled={isSendingRequest || !requestTitle.trim()}
                    className="flex items-center space-x-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSendingRequest ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>Gửi yêu cầu</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
