'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  AlertCircle,
  TrendingUp,
  MoveRight,
  Flame,
  ArrowUpCircle,
  CircleDot,
  CheckCircle,
  Inbox,
  Sparkles,
  Archive,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  UserCheck,
  FileText,
  Trash2,
  ShieldCheck,
  Send
} from 'lucide-react';
import type { TaskDto, TaskPriority, TaskStatus } from '@/features/task/types';
import { useUpdateTaskStatus } from '@/features/task/hooks/use-task';
import { useAuthStore } from '@/store/auth-store';
import { ConfirmStatusChangeModal } from '@/features/task/components/confirm-status-change-modal';
import { useWorkspaceMembers } from '@/features/workspace/hooks/use-workspace';
import { apiClient } from '@/lib/api-client';
import {
  PendingTaskRequestsSection,
  getStoredTaskRequests,
  setStoredTaskRequests,
  type TaskRequestItem,
} from '@/features/task/components/pending-task-requests-section';

interface WorkspaceBacklogTabProps {
  tasks: TaskDto[];
  isLoading: boolean;
  projectId?: string;
  workspaceId?: string;
  onOpenCreateTask: () => void;
  onSelectTask?: (task: TaskDto) => void;
}

interface SprintItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  status: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
  completedAt?: string;
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



  // Staff chỉ được đổi trạng thái nếu họ là người được giao việc
  const canChangeTaskStatus = (task: TaskDto): boolean => {
    if (!isStaff) return true; // Admin/Manager luôn có quyền
    const assigneeEmail = task.assignee?.email;
    return !!assigneeEmail && assigneeEmail === user?.email;
  };

  // Task Request Modal State (for Staff)
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestPriority, setRequestPriority] = useState<TaskPriority>('MEDIUM');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // Fetch workspace members to find Admin/Manager to notify
  const { data: workspaceMembers = [] } = useWorkspaceMembers(workspaceId || null);

  const handleOpenCreateOrRequest = () => {
    if (isStaff) {
      setRequestTitle('');
      setRequestDesc('');
      setRequestPriority('MEDIUM');
      setShowRequestModal(true);
    } else {
      onOpenCreateTask();
    }
  };

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

      // Gửi notification tới tất cả Admin/Manager trong workspace
      const managers = workspaceMembers.filter(
        (m) => m.role === 'ADMIN' || m.role === 'MANAGER' || m.role === 'OWNER'
      );
      const senderName = user?.fullName || user?.email || 'Một thành viên';
      const notificationPayload = {
        title: '📋 Yêu cầu tạo công việc mới',
        message: `${senderName} gửi yêu cầu tạo công việc: "${requestTitle.trim()}" (Ưu tiên: ${requestPriority})`,
        type: 'SYSTEM',
      };

      if (managers.length > 0) {
        await Promise.allSettled(
          managers.map((m) =>
            apiClient.post('/notifications', { ...notificationPayload, userId: m.userId })
          )
        );
      }

      toast.success(`Đã gửi yêu cầu tạo công việc. Admin/Manager sẽ xem và phê duyệt!`);
      setShowRequestModal(false);
    } catch {
      toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsSendingRequest(false);
    }
  };



  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  
  // Real Sprints State (Scrum Sprint Management)
  const [sprints, setSprints] = useState<SprintItem[]>([
    { 
      id: 'sprint-1', 
      name: 'Sprint 1 (Giai đoạn hiện tại)', 
      startDate: '10/08', 
      endDate: '24/08', 
      goal: 'Hoàn thiện giao diện cốt lõi & chức năng phân công công việc',
      status: 'ACTIVE' 
    },
    { 
      id: 'sprint-2', 
      name: 'Sprint 2 (Kế hoạch tiếp theo)', 
      startDate: '25/08', 
      endDate: '08/09', 
      goal: 'Kiểm thử toàn diện, tối ưu hiệu năng & báo cáo thống kê',
      status: 'PLANNED' 
    },
  ]);

  // Section Collapse State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'sprint-1': true,
    'sprint-2': true,
    backlogPool: true,
    completedSprints: false,
  });

  // Task to Sprint Assignment mapping state
  const [taskSprintMapping, setTaskSprintMapping] = useState<Record<string, string>>({});

  // Status Change Confirmation Modal State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    task: TaskDto;
    newStatus: TaskStatus;
  } | null>(null);

  // Complete Sprint Modal State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [sprintToComplete, setSprintToComplete] = useState<SprintItem | null>(null);
  const [incompleteTaskDestination, setIncompleteTaskDestination] = useState<string>('next-sprint');

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get active sprint
  const activeSprint = sprints.find((s) => s.status === 'ACTIVE');
  const plannedSprints = sprints.filter((s) => s.status === 'PLANNED');
  const completedSprints = sprints.filter((s) => s.status === 'COMPLETED');

  // Create New Sprint Handler
  const handleCreateNewSprint = () => {
    const newSprintNumber = sprints.length + 1;
    const newSprint: SprintItem = {
      id: `sprint-${Date.now()}`,
      name: `Sprint ${newSprintNumber}`,
      startDate: '10/09',
      endDate: '24/09',
      goal: 'Các hạng mục công việc mục tiêu cho chu kỳ mới',
      status: 'PLANNED',
    };
    setSprints((prev) => [...prev, newSprint]);
    setOpenSections((prev) => ({ ...prev, [newSprint.id]: true }));
    toast.success(`Đã tạo mới Sprint ${newSprintNumber}!`);
  };

  // Start Sprint Handler
  const handleStartSprint = (sprintId: string) => {
    setSprints((prev) =>
      prev.map((s) => {
        if (s.id === sprintId) {
          return { ...s, status: 'ACTIVE' };
        }
        // If there was another active sprint, we can keep or adjust
        return s;
      })
    );
    setOpenSections((prev) => ({ ...prev, [sprintId]: true }));
    const targetSprint = sprints.find((s) => s.id === sprintId);
    toast.success(`Đã bắt đầu ${targetSprint?.name || 'Sprint'} thành công!`);
  };

  // Open Complete Sprint Modal
  const handleOpenCompleteSprint = (sprint: SprintItem) => {
    setSprintToComplete(sprint);
    // Set default destination for incomplete tasks: next planned sprint or backlog
    if (plannedSprints.length > 0) {
      setIncompleteTaskDestination(plannedSprints[0].id);
    } else {
      setIncompleteTaskDestination('backlog');
    }
    setIsCompleteModalOpen(true);
  };

  // Confirm Complete Sprint
  const handleConfirmCompleteSprint = () => {
    if (!sprintToComplete) return;

    const sprintTasks = getTasksForSprint(sprintToComplete.id);
    const incompleteTasks = sprintTasks.filter(
      (t) => t.status !== 'DONE' && t.status !== 'COMPLETED'
    );

    // Update task sprint mapping for incomplete tasks
    setTaskSprintMapping((prev) => {
      const updated = { ...prev };
      incompleteTasks.forEach((task) => {
        if (incompleteTaskDestination === 'backlog') {
          delete updated[task.id];
        } else {
          updated[task.id] = incompleteTaskDestination;
        }
      });
      return updated;
    });

    // Mark sprint as COMPLETED
    setSprints((prev) =>
      prev.map((s) =>
        s.id === sprintToComplete.id
          ? {
              ...s,
              status: 'COMPLETED',
              completedAt: new Date().toLocaleDateString('vi-VN'),
            }
          : s
      )
    );

    setIsCompleteModalOpen(false);
    toast.success(`Đã hoàn thành ${sprintToComplete.name} thành công! 🎉`);
    setSprintToComplete(null);
  };

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Helper to get tasks for any sprint
  const getTasksForSprint = (sprintId: string) => {
    return filteredTasks.filter((t) => {
      const assignedSprint = taskSprintMapping[t.id];
      if (assignedSprint === sprintId) return true;
      // Default: if no assignment and sprint is sprint-1 and task is in progress, assign to active
      if (!assignedSprint && sprintId === 'sprint-1' && (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW')) {
        return true;
      }
      return false;
    });
  };

  // Active Sprint Tasks
  const activeSprintTasks = activeSprint ? getTasksForSprint(activeSprint.id) : [];

  // Backlog Pool Tasks (uncompleted tasks without sprint)
  const backlogPoolTasks = filteredTasks.filter((t) => {
    const isCompleted = t.status === 'DONE' || t.status === 'COMPLETED';
    const assignedSprint = taskSprintMapping[t.id];
    const isAssignedToActiveOrPlanned = assignedSprint && sprints.some(s => s.id === assignedSprint && s.status !== 'COMPLETED');
    const isDefaultActive = !assignedSprint && (t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW') && !!activeSprint;
    return !isCompleted && !isAssignedToActiveOrPlanned && !isDefaultActive;
  });

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getPriorityBadge = (priority?: string) => {
    const p = priority?.toUpperCase() || 'MEDIUM';
    switch (p) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
            <Flame className="h-3 w-3 text-red-500 animate-pulse" />
            <span>Khẩn cấp</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            <ArrowUpCircle className="h-3 w-3 text-amber-500" />
            <span>Cao</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-slate-500/10 border border-slate-500/30 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            <CircleDot className="h-3 w-3 text-slate-400" />
            <span>Thấp</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
            <CircleDot className="h-3 w-3 text-blue-400" />
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
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span>Hoàn thành</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">
            <PlayCircle className="h-3 w-3 text-blue-400 animate-pulse" />
            <span>Đang làm</span>
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>Đang xem xét</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-slate-500/10 border border-slate-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
            <CircleDot className="h-3 w-3 text-slate-400" />
            <span>Cần làm</span>
          </span>
        );
    }
  };

  // Status Change Request Handler
  const handleRequestStatusChange = (task: TaskDto, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    if (!canChangeTaskStatus(task)) {
      toast.error('Bạn không có quyền thay đổi trạng thái công việc này.');
      return;
    }
    setPendingStatusChange({ task, newStatus });
  };

  // Confirm Status Mutation Execution
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

  // Move Task between Backlog and Sprint
  const handleAssignTaskToSprint = (taskId: string, sprintId: string) => {
    setTaskSprintMapping((prev) => {
      if (sprintId === 'backlog') {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      }
      return {
        ...prev,
        [taskId]: sprintId,
      };
    });
    const targetSprint = sprints.find((s) => s.id === sprintId);
    toast.success(
      sprintId === 'backlog'
        ? 'Đã chuyển công việc về danh sách Backlog'
        : `Đã đưa công việc vào ${targetSprint?.name || 'Sprint'}!`
    );
  };

  // Calculations for Active Sprint Progress
  const activeDoneCount = activeSprintTasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length;
  const activeInProgressCount = activeSprintTasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
  const activeTodoCount = activeSprintTasks.length - activeDoneCount - activeInProgressCount;
  const activePercent = activeSprintTasks.length > 0 ? Math.round((activeDoneCount / activeSprintTasks.length) * 100) : 0;

  // Active or non-completed sprint options for task dropdown
  const availableSprintOptions = sprints.filter((s) => s.status !== 'COMPLETED');

  return (
    <>
    <div className="space-y-6 text-text-primary pb-16">
      
      {/* 1. TOP SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Giai đoạn đang chạy</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <PlayCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-heading">
              {activeSprint ? activeSprint.name.split(' ')[0] + ' ' + (activeSprint.name.split(' ')[1] || '') : 'Không có'}
            </span>
            <span className="text-xs font-semibold text-blue-400">
              {activeSprint ? 'Đang hoạt động' : 'Chưa kích hoạt'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            {activeSprint ? `${activeSprint.startDate} – ${activeSprint.endDate}` : 'Chọn Sprint để bắt đầu'}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Tiến độ Sprint hiện tại</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-heading">{activePercent}%</span>
            <span className="text-xs text-text-muted">({activeDoneCount}/{activeSprintTasks.length} việc)</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${activePercent}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Tồn đọng (Backlog)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-heading">{backlogPoolTasks.length}</span>
            <span className="text-xs text-amber-400 font-medium">Chưa đưa vào Sprint</span>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">Sẵn sàng lập kế hoạch</p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Tổng công việc</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-heading">{tasks.length}</span>
            <span className="text-xs text-text-muted">trong toàn dự án</span>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">Đang theo dõi Scrum</p>
        </div>
      </div>

      {/* 2. SEARCH & ACTION TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc trong Sprint hoặc Backlog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-alt pl-10 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition shadow-inner"
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          {canManageSprint && (
            <button
              type="button"
              onClick={handleCreateNewSprint}
              className="flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition active:scale-95 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo Sprint mới</span>
            </button>
          )}

          {canCreateTask && (
            <button
              type="button"
              onClick={handleOpenCreateOrRequest}
              className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{isStaff ? 'Yêu cầu công việc' : 'Tạo công việc'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TASK APPROVAL REQUESTS SECTION ================= */}
      <PendingTaskRequestsSection projectId={projectId} workspaceId={workspaceId} />

      {/* 3. SPRINTS & BACKLOG CONTAINERS */}
      <div className="space-y-6">
        
        {/* ================= ACTIVE SPRINT ================= */}
        {activeSprint ? (
          <div className="rounded-2xl border-2 border-blue-500/30 bg-surface overflow-hidden shadow-lg transition duration-200 hover:border-blue-500/50">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-950/40 via-surface-alt/70 to-surface-alt px-5 py-4 border-b border-surface-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => toggleSection(activeSprint.id)}
                    className="rounded-lg p-1 text-text-secondary hover:bg-white/10 hover:text-white transition"
                  >
                    {openSections[activeSprint.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                      <PlayCircle className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-white font-heading tracking-wide">
                          {activeSprint.name}
                        </h3>
                        <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
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
                    <Calendar className="h-3.5 w-3.5 text-blue-400" />
                    <span>{activeSprint.startDate} – {activeSprint.endDate}</span>
                  </div>

                  <div className="rounded-xl border border-surface-border bg-surface px-3 py-1 text-xs font-bold">
                    <span className="text-emerald-400">{activeDoneCount} xong</span>
                    <span className="text-text-muted"> / {activeSprintTasks.length} việc</span>
                  </div>

                  {canManageSprint && (
                    <button
                      type="button"
                      onClick={() => handleOpenCompleteSprint(activeSprint)}
                      className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition active:scale-95 shadow-md"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Hoàn thành Sprint</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mini Visual Progress Bar */}
              <div className="mt-3.5 flex items-center space-x-3">
                <div className="flex-1 h-2 rounded-full bg-surface-border/50 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(activeDoneCount / (activeSprintTasks.length || 1)) * 100}%` }} title="Đã hoàn thành" />
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(activeInProgressCount / (activeSprintTasks.length || 1)) * 100}%` }} title="Đang thực hiện" />
                  <div className="bg-slate-600 h-full transition-all duration-300" style={{ width: `${(activeTodoCount / (activeSprintTasks.length || 1)) * 100}%` }} title="Cần làm" />
                </div>
                <span className="text-[11px] font-bold text-text-muted whitespace-nowrap">
                  {activePercent}% hoàn tất
                </span>
              </div>
            </div>

            {/* Task List Inside Active Sprint */}
            {openSections[activeSprint.id] && (
              <div className="divide-y divide-surface-border/50 bg-surface/60">
                {activeSprintTasks.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Inbox className="h-8 w-8 text-text-muted mx-auto opacity-50" />
                    <p className="text-xs font-medium text-text-muted">Sprint này chưa có công việc nào.</p>
                    <p className="text-[11px] text-text-muted">Hãy chọn công việc từ danh sách Backlog bên dưới để đưa vào Sprint này.</p>
                  </div>
                ) : (
                  activeSprintTasks.map((task) => {
                    const key = task.id.substring(0, 6).toUpperCase();
                    const dueDateFormatted = formatDueDate(task.dueDate);
                    const isDone = task.status === 'DONE' || task.status === 'COMPLETED';

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask?.(task)}
                        className="group flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-xs transition duration-150 hover:bg-surface-alt/70 cursor-pointer"
                      >
                        {/* Left: Checkbox + Key + Priority + Title */}
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isDone}
                            disabled={!canChangeTaskStatus(task)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() =>
                              handleRequestStatusChange(task, isDone ? 'TODO' : 'DONE')
                            }
                            title={!canChangeTaskStatus(task) ? 'Bạn không có quyền thay đổi trạng thái' : undefined}
                            className={`h-4 w-4 rounded-md border-surface-border text-primary focus:ring-primary transition ${
                              canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                          />

                          <div className="flex items-center space-x-2 shrink-0">
                            {getPriorityBadge(task.priority)}
                            <span className="font-mono text-[11px] font-bold text-text-muted">#{key}</span>
                          </div>

                          <span
                            className={`font-semibold text-text-primary truncate group-hover:text-primary transition ${
                              isDone ? 'line-through text-text-muted decoration-emerald-500 decoration-2' : ''
                            }`}
                          >
                            {isDone && <CheckCircle2 className="inline-block mr-1.5 h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                            {task.title}
                          </span>
                        </div>

                        {/* Right: Due Date + Move Sprint + Status Picker + Assignee */}
                        <div className="flex items-center space-x-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {dueDateFormatted && (
                            <div className="flex items-center space-x-1 rounded-lg border border-surface-border bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                              <Calendar className="h-3 w-3 text-blue-400" />
                              <span>{dueDateFormatted}</span>
                            </div>
                          )}

                          {/* Quick Sprint Switcher */}
                          <div
                            className={`flex items-center space-x-1 rounded-xl border px-2 py-1 ${
                              canManageSprint
                                ? 'border-primary/20 bg-primary/5'
                                : 'border-surface-border bg-surface-alt opacity-50 cursor-not-allowed'
                            }`}
                            title={!canManageSprint ? 'Chỉ Admin/Manager mới có thể chuyển sprint' : undefined}
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
                              <option value={activeSprint.id} className="bg-[#111827] text-blue-400">
                                ✓ {activeSprint.name}
                              </option>
                              {plannedSprints.map((ps) => (
                                <option key={ps.id} value={ps.id} className="bg-[#111827] text-amber-400">
                                  ➔ {ps.name}
                                </option>
                              ))}
                              <option value="backlog" className="bg-[#111827] text-slate-300">
                                ➔ Chuyển về Backlog
                              </option>
                            </select>
                          </div>

                          {/* Status Switcher */}
                          <select
                            value={task.status || 'IN_PROGRESS'}
                            disabled={!canChangeTaskStatus(task)}
                            onChange={(e) =>
                              handleRequestStatusChange(task, e.target.value as TaskStatus)
                            }
                            title={!canChangeTaskStatus(task) ? 'Bạn không có quyền thay đổi trạng thái' : undefined}
                            className={`rounded-xl border border-surface-border bg-surface px-2.5 py-1 text-[11px] font-bold text-text-primary focus:border-primary focus:outline-none shadow-xs ${
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
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-1 ring-primary/30"
                              title={task.assignee.fullName || task.assignee.email}
                            >
                              {(task.assignee.fullName || task.assignee.email).substring(0, 1).toUpperCase()}
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-text-muted text-[10px] text-text-muted" title="Chưa phân công">
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
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 mx-auto">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">Hiện tại không có Sprint nào đang chạy</h3>
              <p className="text-xs text-text-muted mt-1">Hãy bắt đầu một Sprint từ danh sách dự kiến bên dưới hoặc tạo Sprint mới.</p>
            </div>
            {plannedSprints.length > 0 && canManageSprint && (
              <button
                type="button"
                onClick={() => handleStartSprint(plannedSprints[0].id)}
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md active:scale-95"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Bắt đầu {plannedSprints[0].name}</span>
              </button>
            )}
          </div>
        )}

        {/* ================= FUTURE PLANNED SPRINTS (Sprint 2, 3...) ================= */}
        {plannedSprints.map((sprint) => {
          const sprintTasks = getTasksForSprint(sprint.id);
          const isOpen = openSections[sprint.id] ?? true;

          return (
            <div key={sprint.id} className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-sm transition duration-200 hover:border-surface-border/80">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-alt/50 px-5 py-3.5 border-b border-surface-border">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => toggleSection(sprint.id)}
                    className="rounded-lg p-1 text-text-secondary hover:bg-white/10 hover:text-white transition"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-text-primary font-heading tracking-wide">
                      {sprint.name}
                    </span>
                    <span className="rounded-full bg-surface border border-surface-border px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                      Dự kiến
                    </span>
                  </div>

                  <span className="text-xs text-text-muted">
                    {sprint.startDate} – {sprint.endDate} ({sprintTasks.length} công việc)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {canManageSprint && (
                    <button
                      type="button"
                      onClick={() => handleStartSprint(sprint.id)}
                      className="flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition active:scale-95 shadow-xs"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>Bắt đầu Sprint</span>
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="p-4 bg-surface-alt/10">
                  {sprintTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border p-6 text-center space-y-1.5">
                      <Inbox className="h-6 w-6 text-text-muted opacity-40" />
                      <p className="text-xs font-medium text-text-muted">Chưa có công việc nào trong kế hoạch Sprint này.</p>
                      <p className="text-[11px] text-text-muted">Lập kế hoạch bằng cách chọn công việc từ danh sách Backlog bên dưới.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-surface-border/50">
                      {sprintTasks.map((task) => (
                        <div 
                          key={task.id} 
                          onClick={() => onSelectTask?.(task)}
                          className="flex items-center justify-between p-3 text-xs hover:bg-surface-alt/40 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(task.priority)}
                            <span className="font-semibold text-text-primary">{task.title}</span>
                          </div>
                          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                            <div
                              className={`flex items-center space-x-1 rounded-xl border px-2 py-0.5 ${
                                canManageSprint
                                  ? 'border-primary/20 bg-primary/5'
                                  : 'border-surface-border bg-surface-alt opacity-50 cursor-not-allowed'
                              }`}
                              title={!canManageSprint ? 'Chỉ Admin/Manager mới có thể chuyển sprint' : undefined}
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
                                  <option key={s.id} value={s.id} className="bg-[#111827] text-white">
                                    {s.id === sprint.id ? `✓ ${s.name}` : `➔ ${s.name}`}
                                  </option>
                                ))}
                                <option value="backlog" className="bg-[#111827] text-slate-300">
                                  ➔ Chuyển về Backlog
                                </option>
                              </select>
                            </div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ================= COMPLETED SPRINTS ARCHIVE ================= */}
        {completedSprints.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-surface overflow-hidden shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/10 px-5 py-3.5 border-b border-surface-border">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => toggleSection('completedSprints')}
                  className="rounded-lg p-1 text-text-secondary hover:bg-white/10 hover:text-white transition"
                >
                  {openSections.completedSprints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                <div className="flex items-center space-x-2">
                  <Archive className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-text-primary font-heading tracking-wide">
                    Sprint Đã Hoàn Thành ({completedSprints.length})
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    Lịch sử Scrum
                  </span>
                </div>
              </div>
            </div>

            {openSections.completedSprints && (
              <div className="divide-y divide-surface-border/50 p-4 space-y-3 bg-surface-alt/10">
                {completedSprints.map((cs) => {
                  const tasksInSprint = getTasksForSprint(cs.id);
                  const doneCount = tasksInSprint.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length;

                  return (
                    <div key={cs.id} className="rounded-xl border border-surface-border bg-surface p-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-bold text-text-primary">{cs.name}</span>
                          <span className="text-[10px] text-text-muted">({cs.startDate} – {cs.endDate})</span>
                        </div>
                        <p className="text-[11px] text-text-muted">{cs.goal}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-emerald-400">
                          {doneCount}/{tasksInSprint.length} hoàn thành
                        </span>
                        {canManageSprint && (
                          <button
                            type="button"
                            onClick={() => handleStartSprint(cs.id)}
                            className="flex items-center space-x-1 text-[11px] font-bold text-primary hover:underline"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Mở lại</span>
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

        {/* ================= BACKLOG POOL (TỒN ĐỌNG) ================= */}
        <div className="rounded-2xl border-2 border-amber-500/20 bg-surface overflow-hidden shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-950/20 via-surface-alt/80 to-surface-alt px-5 py-4 border-b border-surface-border">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => toggleSection('backlogPool')}
                className="rounded-lg p-1 text-text-secondary hover:bg-white/10 hover:text-white transition"
              >
                {openSections.backlogPool ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              <div className="flex items-center space-x-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-extrabold text-white font-heading tracking-wide">
                      Danh Sách Công Việc Tồn Đọng (Backlog)
                    </h3>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                      {backlogPoolTasks.length} công việc
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Các hạng mục công việc đang chờ phân bổ vào Sprint
                  </p>
                </div>
              </div>
            </div>

            {canCreateTask && (
              <button
                type="button"
                onClick={handleOpenCreateOrRequest}
                className="flex items-center space-x-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-white transition active:scale-95 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>{isStaff ? 'Yêu cầu thêm vào Backlog' : 'Thêm vào Backlog'}</span>
              </button>
            )}
          </div>

          {openSections.backlogPool && (
            <div className="divide-y divide-surface-border/50 bg-surface/70">
              {backlogPoolTasks.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto opacity-70" />
                  <p className="text-xs font-semibold text-text-primary">Danh sách Backlog đang trống!</p>
                  <p className="text-[11px] text-text-muted">Tất cả công việc đã được đưa vào Sprint hoặc đã hoàn thành.</p>
                </div>
              ) : (
                backlogPoolTasks.map((task) => {
                  const key = task.id.substring(0, 6).toUpperCase();
                  const dueDateFormatted = formatDueDate(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask?.(task)}
                      className="group flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-xs transition duration-150 hover:bg-surface-alt/70 cursor-pointer"
                    >
                      {/* Left Side: Checkbox + Priority + Task Key + Title */}
                      <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={false}
                          disabled={!canChangeTaskStatus(task)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleRequestStatusChange(task, 'DONE')}
                          title={!canChangeTaskStatus(task) ? 'Bạn không có quyền thay đổi trạng thái' : undefined}
                          className={`h-4 w-4 rounded-md border-surface-border text-primary focus:ring-primary transition ${
                            canChangeTaskStatus(task) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                          }`}
                        />

                        <div className="flex items-center space-x-2 shrink-0">
                          {getPriorityBadge(task.priority)}
                          <span className="font-mono text-[11px] font-bold text-text-muted">#{key}</span>
                        </div>

                        <span className="font-semibold text-text-primary truncate group-hover:text-primary transition">
                          {task.title}
                        </span>
                      </div>

                      {/* Right Side: Quick Action (Move to Sprint) + Status + Assignee */}
                      <div className="flex items-center space-x-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Quick Sprint Assignment Selector */}
                        <div
                          className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1 ${
                            canManageSprint
                              ? 'border-primary/30 bg-primary/10'
                              : 'border-surface-border bg-surface-alt opacity-50 cursor-not-allowed'
                          }`}
                          title={!canManageSprint ? 'Chỉ Admin/Manager mới có thể chuyển sprint' : undefined}
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
                            <option value="backlog" className="bg-[#111827] text-white">Chờ trong Backlog</option>
                            {availableSprintOptions.map((s) => (
                              <option 
                                key={s.id} 
                                value={s.id} 
                                className={s.status === 'ACTIVE' ? 'bg-[#111827] text-blue-400' : 'bg-[#111827] text-amber-400'}
                              >
                                ➔ Đưa vào {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Picker */}
                        <select
                          value={task.status || 'TODO'}
                          disabled={!canChangeTaskStatus(task)}
                          onChange={(e) => handleRequestStatusChange(task, e.target.value as TaskStatus)}
                          title={!canChangeTaskStatus(task) ? 'Bạn không có quyền thay đổi trạng thái' : undefined}
                          className={`rounded-xl border border-surface-border bg-surface px-2.5 py-1 text-[11px] font-bold text-text-primary focus:border-primary focus:outline-none shadow-xs ${
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
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-1 ring-primary/30"
                            title={task.assignee.fullName || task.assignee.email}
                          >
                            {(task.assignee.fullName || task.assignee.email).substring(0, 1).toUpperCase()}
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-text-muted text-[10px] text-text-muted" title="Chưa phân công">
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

      </div>

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

      {/* Complete Sprint Modal */}
      {isCompleteModalOpen && sprintToComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl text-text-primary space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-3 border-b border-surface-border pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary font-heading">
                  Hoàn Thành {sprintToComplete.name}
                </h3>
                <p className="text-xs text-text-muted">
                  Đóng chu kỳ Sprint và xử lý các hạng mục công việc
                </p>
              </div>
            </div>

            {/* Sprint Summary Metrics */}
            {(() => {
              const sprintTasks = getTasksForSprint(sprintToComplete.id);
              const completedCount = sprintTasks.filter(
                (t) => t.status === 'DONE' || t.status === 'COMPLETED'
              ).length;
              const incompleteCount = sprintTasks.length - completedCount;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                      <div className="text-2xl font-black text-emerald-400 font-heading">
                        {completedCount}
                      </div>
                      <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                        Công việc đã hoàn thành
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                      <div className="text-2xl font-black text-amber-400 font-heading">
                        {incompleteCount}
                      </div>
                      <div className="text-xs font-semibold text-amber-300 mt-0.5">
                        Công việc chưa xong
                      </div>
                    </div>
                  </div>

                  {incompleteCount > 0 ? (
                    <div className="space-y-2 rounded-xl border border-surface-border bg-surface-alt/50 p-3.5 text-xs">
                      <label className="font-bold text-text-primary block">
                        Chuyển {incompleteCount} công việc chưa hoàn thành đến:
                      </label>
                      <select
                        value={incompleteTaskDestination}
                        onChange={(e) => setIncompleteTaskDestination(e.target.value)}
                        className="w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
                      >
                        {plannedSprints.map((ps) => (
                          <option key={ps.id} value={ps.id}>
                            ➔ {ps.name} (Sprint dự kiến tiếp theo)
                          </option>
                        ))}
                        <option value="backlog">➔ Danh sách tồn đọng (Backlog Pool)</option>
                      </select>
                      <p className="text-[11px] text-text-muted">
                        Các công việc chưa hoàn tất sẽ tự động được điều chuyển để tiếp tục thực hiện.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center text-xs text-emerald-400 font-medium">
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
                className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmCompleteSprint}
                className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 active:scale-95"
              >
                <Check className="h-4 w-4" />
                <span>Xác Nhận Hoàn Thành Sprint</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* ===== TASK REQUEST MODAL (for Staff) ===== */}
    {showRequestModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => setShowRequestModal(false)}
      >
        <div
          className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-text-primary">📎 Gửi yêu cầu tạo công việc</h2>
              <p className="mt-0.5 text-[11px] text-text-muted">
                Yêu cầu của bạn sẽ được gửi tới Admin / Manager để phê duyệt.
              </p>
            </div>
            <button
              onClick={() => setShowRequestModal(false)}
              className="ml-4 shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-text-secondary">
                Tiêu đề công việc <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                placeholder="Ví dụ: Xây dựng API đăng nhập..."
                className="w-full rounded-xl border border-surface-border bg-surface-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSendTaskRequest()}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-text-secondary">
                Mô tả ngắn <span className="text-text-muted font-normal">(tùy chọn)</span>
              </label>
              <textarea
                value={requestDesc}
                onChange={(e) => setRequestDesc(e.target.value)}
                placeholder="Mô tả chi tiết yêu cầu, mục tiêu hoặc mức độ ưu tiên..."
                rows={3}
                className="w-full resize-none rounded-xl border border-surface-border bg-surface-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-text-secondary">
                Mức độ ưu tiên đề xuất
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRequestPriority(p)}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      requestPriority === p
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-surface-border bg-surface-alt text-text-muted hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {p === 'URGENT' ? '🔥 Khẩn cấp' : p === 'HIGH' ? '⚡ Cao' : p === 'MEDIUM' ? '⚖️ Vừa' : '☕ Thấp'}
                  </button>
                ))}
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <p className="text-[11px] text-blue-300">
                Yêu cầu sẽ xuất hiện ngay trên danh sách chờ duyệt của Quản trị viên (Admin/Manager). Khi được phê duyệt, công việc sẽ tự động tạo vào Backlog.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSendTaskRequest}
              disabled={isSendingRequest || !requestTitle.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
    )}
    </>
  );
}


