'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Loader2, X, Plus, Folder, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useWorkspaces, useWorkspaceMembers } from '@/features/workspace/hooks/use-workspace';
import { useProjects } from '@/features/project/hooks/use-project';
import { useCreateWorkspaceTask, useCreateTask } from '../hooks/use-task';
import type { TaskPriority, TaskStatus } from '../types';
import {
  SprintItem,
  getStoredSprints,
  getStoredTaskSprintMapping,
  saveStoredTaskSprintMapping,
} from '@/features/project/services/sprint-service';
import { filterAssigneesForProject, filterProjectsForUser, getUserProjectRole } from '@/features/project/services/project-member-service';

import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const taskSchema = z.object({
  title: z.string().min(1, 'Tên công việc không được để trống'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface GlobalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function GlobalTaskModal({ isOpen, onClose, defaultProjectId }: GlobalTaskModalProps) {
  const [mounted, setMounted] = useState(false);
  const { t: tTask } = useTranslation('task');
  const { t: tCommon } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (activeWorkspace?.id) {
      setSelectedWorkspaceId(activeWorkspace.id);
    } else if (workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [activeWorkspace, workspaces]);

  const workspaceId = selectedWorkspaceId || activeWorkspace?.id || workspaces[0]?.id || '';
  const { data: members = [] } = useWorkspaceMembers(workspaceId || null);
  const { data: rawProjects = [] } = useProjects(workspaceId || null);
  const projects = useMemo(() => {
    return filterProjectsForUser(rawProjects, currentUser);
  }, [rawProjects, currentUser?.id, currentUser?.email]);

  useEffect(() => {
    if (defaultProjectId) {
      setSelectedProjectId(defaultProjectId);
    }
  }, [defaultProjectId]);

  const effectiveProjectId = selectedProjectId || defaultProjectId || (projects.length > 0 ? projects[0].id : '');

  const userProjectRole = getUserProjectRole(effectiveProjectId, currentUser);
  const isAdmin = userProjectRole === 'ADMIN';
  const isManager = userProjectRole === 'MANAGER';
  const isStaff = !isAdmin && !isManager;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string>('backlog');
  const [projectSprints, setProjectSprints] = useState<SprintItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const targetProjId = effectiveProjectId;
    const sprints = getStoredSprints(targetProjId || undefined);
    setProjectSprints(sprints);
    const active = sprints.find((s) => s.status === 'ACTIVE');
    if (active) {
      setSelectedSprintId(active.id);
    } else {
      setSelectedSprintId('backlog');
    }
  }, [effectiveProjectId, isOpen]);

  const eligibleAssignees = useMemo(() => {
    return filterAssigneesForProject(members, effectiveProjectId);
  }, [members, effectiveProjectId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      assigneeId: '',
    },
  });

  const createWorkspaceTaskMutation = useCreateWorkspaceTask(workspaceId);
  // Dùng project-level API khi đã chọn projectId cụ thể
  const createProjectTaskMutation = useCreateTask(selectedProjectId || defaultProjectId || '');

  if (!isOpen || !mounted) return null;

  const onSubmit = (data: TaskFormData) => {
    setErrorMessage(null);

    if (!workspaceId) {
      setErrorMessage('Vui lòng chọn Workspace hợp lệ.');
      return;
    }

    const dueDateInstant = data.dueDate ? new Date(data.dueDate).toISOString() : undefined;
    const effectiveProjectId = selectedProjectId || defaultProjectId || '';

    // NẾU LÀ STAFF: Không được tạo trực tiếp vào DB/bảng Kanban, mà phải gửi yêu cầu phê duyệt
    if (isStaff) {
      try {
        const targetSprintObj = projectSprints.find((s) => s.id === selectedSprintId);
        const sprintDisplayName =
          selectedSprintId === 'backlog'
            ? 'Backlog'
            : targetSprintObj?.name || 'Sprint';

        const newRequest = {
          id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          priority: data.priority as TaskPriority,
          requesterId: currentUser?.id || 'unknown',
          requesterName: currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Nhân viên',
          requesterEmail: currentUser?.email || '',
          workspaceId,
          projectId: effectiveProjectId || undefined,
          sprintId: selectedSprintId || 'backlog',
          sprintName: sprintDisplayName,
          status: 'PENDING' as const,
          createdAt: new Date().toLocaleString('vi-VN'),
        };

        const existingRaw = typeof window !== 'undefined' ? localStorage.getItem('taskflow_task_requests_store') : null;
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = [newRequest, ...existing];
        if (typeof window !== 'undefined') {
          localStorage.setItem('taskflow_task_requests_store', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('task_requests_updated'));
        }

        // Notify managers
        const managers = members.filter(
          (m) => m.role === 'ADMIN' || m.role === 'MANAGER' || m.role === 'OWNER'
        );
        const senderName = currentUser?.fullName || currentUser?.email || 'Nhân viên';
        const notificationPayload = {
          title: '📋 Yêu cầu tạo công việc mới',
          message: `${senderName} gửi yêu cầu tạo công việc: "${data.title.trim()}" (Ưu tiên: ${data.priority})`,
          type: 'SYSTEM',
        };

        if (managers.length > 0) {
          Promise.allSettled(
            managers.map((m) =>
              apiClient.post('/notifications', { ...notificationPayload, userId: m.userId })
            )
          );
        }

        toast.success('Đã gửi yêu cầu tạo công việc. Admin/Manager cần phê duyệt trước khi công việc xuất hiện trên bảng Kanban!');
        reset();
        onClose();
        return;
      } catch (err) {
        toast.error('Có lỗi khi gửi yêu cầu. Vui lòng thử lại.');
        return;
      }
    }

    const taskPayload = {
      title: data.title,
      description: data.description || undefined,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority,
      dueDate: dueDateInstant,
      assigneeId: data.assigneeId || undefined,
    };

    const onSuccess = (createdTask: any) => {
      if (createdTask?.id && effectiveProjectId && selectedSprintId && selectedSprintId !== 'backlog') {
        const mapping = getStoredTaskSprintMapping(effectiveProjectId);
        mapping[createdTask.id] = selectedSprintId;
        saveStoredTaskSprintMapping(mapping, effectiveProjectId);
      }
      reset();
      onClose();
    };
    const onError = (err: any) => {
      setErrorMessage(err.response?.data?.message || tCommon('messages.genericError'));
    };

    if (effectiveProjectId) {
      // Gọi trực tiếp POST /projects/{projectId}/tasks để đúng dự án
      createProjectTaskMutation.mutate(taskPayload, { onSuccess, onError });
    } else {
      // Fallback: tạo vào workspace nếu không chọn dự án
      createWorkspaceTaskMutation.mutate(taskPayload, { onSuccess, onError });
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 text-text-primary max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary font-heading">
                {isStaff ? 'Yêu cầu tạo công việc mới' : tTask('createTask', { defaultValue: 'Tạo công việc mới' })}
              </h2>
              <p className="text-[11px] text-text-secondary">
                {isStaff ? 'Gửi đề xuất công việc tới Quản lý để phê duyệt' : 'Tạo công việc và chỉ định thuộc dự án nào'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Workspace & Project Pickers Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Workspace Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Chọn Workspace *</label>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => {
                  setSelectedWorkspaceId(e.target.value);
                  setSelectedProjectId('');
                }}
                required
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-bold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="">-- Chọn Workspace --</option>
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id} className="bg-surface text-text-primary font-medium">
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Picker (Scrum Project Assignment) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Chọn Dự án *</label>
              <select
                value={effectiveProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-bold text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                {projects.length === 0 && (
                  <option value="">-- Không có dự án nào --</option>
                )}
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-surface text-text-primary font-medium">
                    {p.name} {p.key ? `#${p.key}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              {isStaff ? 'Tên công việc đề xuất *' : 'Tên công việc *'}
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder={isStaff ? 'Ví dụ: Đề xuất cập nhật lại quy trình tài liệu' : 'Ví dụ: Thiết kế giao diện Dashboard'}
              className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
            {errors.title && <p className="text-[11px] text-status-error">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              {isStaff ? 'Mô tả chi tiết & Lý do đề xuất' : 'Mô tả công việc'}
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder={isStaff ? 'Nêu chi tiết nội dung công việc và lý do đề xuất...' : 'Chi tiết công việc và yêu cầu...'}
              className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
          </div>

          {/* Assignee Dropdown Picker */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                {tTask('fields.assignee', { defaultValue: 'Người thực hiện' })}
              </label>
              {effectiveProjectId && (
                <span className="text-[10px] text-text-muted">
                  (Chỉ thành viên của dự án này)
                </span>
              )}
            </div>
            <select
              {...register('assigneeId')}
              className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-surface text-text-muted">-- Chưa phân công --</option>
              {eligibleAssignees.map((m: any) => (
                <option key={m.userId} value={m.userId} className="bg-surface text-text-primary">
                  {m.fullName || m.email}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Độ ưu tiên</label>
              <select
                {...register('priority')}
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="URGENT">Khẩn cấp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Trạng thái</label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="TODO">Cần làm</option>
                <option value="IN_PROGRESS">Đang làm</option>
                <option value="IN_REVIEW">Đang xem xét</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Due Date & Sprint Row - ALWAYS VISIBLE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Hạn chót</label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary transition focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary flex items-center space-x-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>{isStaff ? 'Đề xuất vào Sprint' : 'Chu kỳ Sprint'}</span>
              </label>
              <select
                value={selectedSprintId}
                onChange={(e) => setSelectedSprintId(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-alt p-2.5 text-xs font-bold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="backlog" className="bg-surface text-amber-500 font-semibold">
                  Chờ trong Backlog (Chưa đưa vào Sprint)
                </option>
                {projectSprints.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface text-text-primary">
                    {s.name} {s.status === 'ACTIVE' ? '(Đang chạy)' : s.status === 'PLANNED' ? '(Kế hoạch)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt hover:text-text-primary transition"
            >
              {tCommon('actions.cancel', { defaultValue: 'Hủy' })}
            </button>
            <button
              type="submit"
              disabled={createWorkspaceTaskMutation.isPending || createProjectTaskMutation.isPending}
              className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition active:scale-95 disabled:opacity-50"
            >
              {(createWorkspaceTaskMutation.isPending || createProjectTaskMutation.isPending) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>{isStaff ? 'Gửi đề xuất công việc' : 'Tạo công việc'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
