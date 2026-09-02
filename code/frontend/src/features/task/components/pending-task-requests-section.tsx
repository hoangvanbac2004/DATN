'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Clock,
  UserCheck,
  X,
  Check,
  Trash2,
  Send,
} from 'lucide-react';
import type { TaskPriority } from '@/features/task/types';
import { useCreateTask } from '@/features/task/hooks/use-task';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';

export interface TaskRequestItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  workspaceId?: string;
  projectId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const TASK_REQUESTS_KEY = 'taskflow_task_requests_store';

export function getStoredTaskRequests(): TaskRequestItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TASK_REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setStoredTaskRequests(requests: TaskRequestItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASK_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('task_requests_updated'));
  } catch {}
}

interface PendingTaskRequestsSectionProps {
  projectId?: string;
  workspaceId?: string;
}

export function PendingTaskRequestsSection({ projectId, workspaceId }: PendingTaskRequestsSectionProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com';
  const isStaff = !isAdmin && !isManager;
  const canManage = isAdmin || isManager;

  const [taskRequests, setTaskRequests] = useState<TaskRequestItem[]>([]);
  const [showProcessedRequests, setShowProcessedRequests] = useState(false);

  const createTaskMutation = useCreateTask(projectId || '');

  useEffect(() => {
    setTaskRequests(getStoredTaskRequests());
    const handleUpdate = () => {
      setTaskRequests(getStoredTaskRequests());
    };
    window.addEventListener('task_requests_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('task_requests_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getPriorityBadge = (priority?: string) => {
    const p = priority?.toUpperCase() || 'MEDIUM';
    switch (p) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
            🔥 Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            ⚡ Cao
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center rounded-md border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            ☕ Thấp
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
            ⚖️ Trung bình
          </span>
        );
    }
  };

  const handleApproveRequest = async (req: TaskRequestItem) => {
    try {
      if (projectId || req.projectId) {
        await createTaskMutation.mutateAsync({
          title: req.title,
          description: req.description,
          priority: req.priority,
          status: 'TODO',
        });
      }

      const all = getStoredTaskRequests();
      const updated = all.map((item) =>
        item.id === req.id
          ? {
              ...item,
              status: 'APPROVED' as const,
              reviewedBy: user?.fullName || user?.email || 'Quản lý',
              reviewedAt: new Date().toLocaleString('vi-VN'),
            }
          : item
      );
      setStoredTaskRequests(updated);
      setTaskRequests(updated);

      if (req.requesterId && req.requesterId !== 'unknown') {
        try {
          await apiClient.post('/notifications', {
            title: '✅ Yêu cầu công việc đã được phê duyệt',
            message: `Công việc "${req.title}" bạn yêu cầu đã được phê duyệt và tạo thành công!`,
            userId: req.requesterId,
            type: 'SYSTEM',
          });
        } catch {}
      }

      toast.success(`Đã phê duyệt và tạo công việc "${req.title}" thành công!`);
    } catch {
      toast.error('Không thể tạo công việc. Vui lòng thử lại.');
    }
  };

  const handleRejectRequest = async (req: TaskRequestItem) => {
    const all = getStoredTaskRequests();
    const updated = all.map((item) =>
      item.id === req.id
        ? {
            ...item,
            status: 'REJECTED' as const,
            reviewedBy: user?.fullName || user?.email || 'Quản lý',
            reviewedAt: new Date().toLocaleString('vi-VN'),
          }
        : item
    );
    setStoredTaskRequests(updated);
    setTaskRequests(updated);

    if (req.requesterId && req.requesterId !== 'unknown') {
      try {
        await apiClient.post('/notifications', {
          title: '❌ Yêu cầu công việc bị từ chối',
          message: `Yêu cầu tạo công việc "${req.title}" của bạn đã bị từ chối.`,
          userId: req.requesterId,
          type: 'SYSTEM',
        });
      } catch {}
    }

    toast.info(`Đã từ chối yêu cầu tạo công việc "${req.title}".`);
  };

  const handleDeleteRequest = (id: string) => {
    const all = getStoredTaskRequests();
    const updated = all.filter((item) => item.id !== id);
    setStoredTaskRequests(updated);
    setTaskRequests(updated);
    toast.success('Đã xóa bản ghi yêu cầu.');
  };

  const pendingRequests = taskRequests.filter((r) => r.status === 'PENDING');
  const processedRequests = taskRequests.filter((r) => r.status !== 'PENDING');
  const myRequests = taskRequests.filter(
    (r) => r.requesterEmail === user?.email || r.requesterId === user?.id
  );

  return (
    <div className="space-y-4">
      {/* 1. For Admin/Manager: Pending Approval Requests List */}
      {canManage && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4.5 transition shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-sm font-bold text-text-primary">
                    Yêu cầu tạo công việc chờ phê duyệt
                  </h3>
                  {pendingRequests.length > 0 ? (
                    <span className="animate-pulse rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold text-black">
                      {pendingRequests.length} yêu cầu cần duyệt
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-alt border border-surface-border px-2.5 py-0.5 text-[10px] font-medium text-text-muted">
                      0 yêu cầu mới
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Phê duyệt hoặc từ chối các yêu cầu tạo công việc từ nhân viên (Staff)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowProcessedRequests(!showProcessedRequests)}
                className="rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-text-secondary hover:bg-surface-alt transition shadow-xs"
              >
                {showProcessedRequests ? 'Ẩn lịch sử' : 'Xem lịch sử đã xử lý'}
              </button>
            </div>
          </div>

          {/* Pending List */}
          {pendingRequests.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface p-4 shadow-sm hover:border-amber-500/40 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {getPriorityBadge(req.priority)}
                        <h4 className="font-bold text-xs text-text-primary truncate">
                          {req.title}
                        </h4>
                      </div>
                      <span className="shrink-0 text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {req.createdAt}
                      </span>
                    </div>

                    {req.description && (
                      <p className="mt-2 text-[11px] text-text-secondary line-clamp-2 bg-surface-alt/60 p-2.5 rounded-lg border border-surface-border/50">
                        {req.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center space-x-2 text-[11px] text-text-muted">
                      <UserCheck className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Người gửi: <strong className="text-text-primary">{req.requesterName}</strong>{' '}
                        ({req.requesterEmail})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end space-x-2 pt-3 border-t border-surface-border">
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(req)}
                      className="flex items-center space-x-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Từ chối</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveRequest(req)}
                      className="flex items-center space-x-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Phê duyệt & Tạo việc</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 py-2 text-center text-xs text-text-muted">
              Hiện tại không có yêu cầu nào đang chờ phê duyệt.
            </div>
          )}

          {/* Processed History List */}
          {showProcessedRequests && processedRequests.length > 0 && (
            <div className="mt-4 pt-3 border-t border-surface-border">
              <h5 className="text-[11px] font-bold text-text-muted mb-2">
                Lịch sử yêu cầu đã xử lý ({processedRequests.length})
              </h5>
              <div className="space-y-2">
                {processedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-surface-border text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className={
                          req.status === 'APPROVED'
                            ? 'text-emerald-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {req.status === 'APPROVED' ? '✓ Đã duyệt' : '✕ Đã từ chối'}
                      </span>
                      <span className="font-semibold text-text-primary truncate">{req.title}</span>
                      <span className="text-text-muted text-[10px]">
                        bởi {req.requesterName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-text-muted">
                        {req.reviewedAt || req.createdAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(req.id)}
                        className="p-1 text-text-muted hover:text-rose-400 transition"
                        title="Xóa bản ghi"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. For Staff: My Sent Requests Status */}
      {isStaff && myRequests.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4.5 transition shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Yêu cầu công việc của bạn ({myRequests.length})
              </h3>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-surface-border bg-surface p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-text-primary truncate">{req.title}</span>
                  {req.status === 'PENDING' && (
                    <span className="shrink-0 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      ⏳ Chờ duyệt
                    </span>
                  )}
                  {req.status === 'APPROVED' && (
                    <span className="shrink-0 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      ✓ Đã duyệt
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="shrink-0 rounded-md bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
                      ✕ Từ chối
                    </span>
                  )}
                </div>
                {req.description && (
                  <p className="mt-1.5 text-[11px] text-text-muted line-clamp-1">
                    {req.description}
                  </p>
                )}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-text-muted pt-1.5 border-t border-surface-border/50">
                  <span>Gửi lúc: {req.createdAt}</span>
                  {req.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="text-rose-400 hover:underline"
                    >
                      Hủy yêu cầu
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
