'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Sparkles,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/features/notification/hooks/use-notification';
import { useAcceptInvitation } from '@/features/workspace/hooks/use-workspace';
import { NotificationItem } from '@/features/notification/components/notification-item';
import { NotificationListSkeleton } from '@/components/ui/skeletons/notification-list-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/store/auth-store';
import {
  PendingTaskRequestsSection,
  getStoredTaskRequests,
  type TaskRequestItem,
} from '@/features/task/components/pending-task-requests-section';
import {
  PendingDocRequestsSection,
} from '@/features/project/components/pending-doc-requests-section';
import {
  getStoredDocRequests,
  type DocApprovalRequestItem,
} from '@/features/project/services/doc-approval-service';

type NotificationTab = 'all' | 'unread' | 'approvals';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [page, setPage] = useState(0);
  const router = useRouter();
  const { t: tNav } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com';
  const isStaff = !isAdmin && !isManager;

  const [taskRequests, setTaskRequests] = useState<TaskRequestItem[]>([]);
  const [docRequests, setDocRequests] = useState<DocApprovalRequestItem[]>([]);

  // Load task and doc approval requests
  useEffect(() => {
    const update = () => {
      setTaskRequests(getStoredTaskRequests());
      setDocRequests(getStoredDocRequests());
    };
    update();
    window.addEventListener('task_requests_updated', update);
    window.addEventListener('doc_requests_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('task_requests_updated', update);
      window.removeEventListener('doc_requests_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const pendingTaskCount = isAdmin || isManager
    ? taskRequests.filter((r) => r.status === 'PENDING').length
    : taskRequests.filter(
        (r) => (r.requesterEmail === user?.email || r.requesterId === user?.id) && r.status === 'PENDING'
      ).length;

  const pendingDocCount = isAdmin || isManager
    ? docRequests.filter((r) => r.status === 'PENDING').length
    : docRequests.filter(
        (r) => (r.requesterEmail === user?.email || r.requesterId === user?.id) && r.status === 'PENDING'
      ).length;

  const totalPendingApprovals = pendingTaskCount + pendingDocCount;

  const unreadOnly = activeTab === 'unread';
  const { data, isLoading } = useNotifications(page, 15, unreadOnly);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const acceptInvitation = useAcceptInvitation();

  const notifications = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const handleNotificationClick = (id: string, link?: string, isRead?: boolean) => {
    if (!isRead) {
      markRead.mutate(id);
    }

    if (link) {
      if (link.startsWith('/invite/')) {
        const token = link.replace('/invite/', '');
        acceptInvitation.mutate(token, {
          onSuccess: (wsMember) => {
            if (wsMember?.workspaceId) {
              router.push(`/workspaces/${wsMember.workspaceId}`);
            } else {
              router.push('/workspaces');
            }
          },
        });
      } else {
        router.push(link as any);
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 text-text-primary">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-text-primary font-heading flex items-center space-x-2">
              <span>Trung tâm Thông báo</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {activeTab === 'approvals' ? totalPendingApprovals : totalElements}
              </span>
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Theo dõi phê duyệt yêu cầu, thông báo phân công và các cập nhật mới nhất
            </p>
          </div>
        </div>

        {activeTab !== 'approvals' && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            className="flex items-center space-x-2 rounded-xl border border-surface-border bg-surface-alt px-4 py-2 text-xs font-bold text-text-primary hover:bg-surface hover:border-primary/40 transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 text-primary" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        )}
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 rounded-xl border border-surface-border bg-surface-alt p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setPage(0);
            }}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Tất cả thông báo
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('unread');
              setPage(0);
            }}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Chưa đọc
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('approvals');
            }}
            className={`flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Duyệt yêu cầu</span>
            {totalPendingApprovals > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  activeTab === 'approvals'
                    ? 'bg-white text-primary'
                    : 'bg-rose-500 text-white animate-pulse'
                }`}
              >
                {totalPendingApprovals}
              </span>
            )}
          </button>
        </div>

        {activeTab !== 'approvals' && totalPages > 1 && (
          <div className="flex items-center space-x-2 text-xs text-text-secondary font-medium">
            <span>
              Trang {page + 1} / {totalPages} ({totalElements} thông báo)
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg p-1.5 border border-surface-border bg-surface hover:bg-surface-alt disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={data?.last}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg p-1.5 border border-surface-border bg-surface hover:bg-surface-alt disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Banner if user is on notification tab and has pending approvals */}
      {activeTab !== 'approvals' && totalPendingApprovals > 0 && (
        <div
          onClick={() => setActiveTab('approvals')}
          className="cursor-pointer flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 transition hover:bg-primary/15 shadow-xs"
        >
          <div className="flex items-center space-x-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary flex items-center space-x-2">
                <span>
                  {isAdmin || isManager
                    ? `Bạn có ${totalPendingApprovals} yêu cầu đang chờ phê duyệt`
                    : `Bạn có ${totalPendingApprovals} yêu cầu công việc & tài liệu đang được xử lý`}
                </span>
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                  Mới
                </span>
              </h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Bấm để xem và xử lý các yêu cầu tạo công việc, tài liệu Wiki và bảng vẽ
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center space-x-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition shrink-0"
          >
            <span>Xem ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* APPROVAL REQUESTS TAB CONTENT */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Task Approval Requests */}
          <PendingTaskRequestsSection />

          {/* Section 2: Wiki Doc & Whiteboard Approval Requests */}
          <PendingDocRequestsSection />
        </div>
      )}

      {/* MAIN NOTIFICATION STREAM (When activeTab is 'all' or 'unread') */}
      {activeTab !== 'approvals' && (
        <>
          {isLoading ? (
            <NotificationListSkeleton count={4} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Bạn đã xem hết thông báo!"
              description={
                unreadOnly
                  ? 'Không có thông báo chưa đọc nào.'
                  : 'Hiện tại chưa có thông báo mới nào dành cho bạn.'
              }
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const isInvitation =
                  notification.type === 'WORKSPACE_INVITATION' &&
                  notification.link?.startsWith('/invite/');
                const token = isInvitation ? notification.link?.replace('/invite/', '') : null;

                return (
                  <div
                    key={notification.id}
                    className={`group relative rounded-2xl border transition p-4 space-y-3 ${
                      !notification.isRead
                        ? 'border-primary/40 bg-primary/5 hover:bg-primary/10 shadow-xs'
                        : 'border-surface-border bg-surface hover:bg-surface-alt/60'
                    }`}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkRead={(id) => markRead.mutate(id)}
                      onDelete={(id) => deleteNotification.mutate(id)}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.link,
                          notification.isRead
                        )
                      }
                    />

                    {/* Interactive Action Card for Workspace Invitations */}
                    {isInvitation && token && (
                      <div className="ml-11 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/10 p-3">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-primary">
                          <UserPlus className="h-4 w-4" />
                          <span>Lời mời tham gia Workspace này đang chờ bạn xác nhận!</span>
                        </div>

                        <button
                          type="button"
                          disabled={acceptInvitation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptInvitation.mutate(token, {
                              onSuccess: (wsMember) => {
                                if (!notification.isRead) {
                                  markRead.mutate(notification.id);
                                }
                                if (wsMember?.workspaceId) {
                                  router.push(`/workspaces/${wsMember.workspaceId}`);
                                } else {
                                  router.push('/workspaces');
                                }
                              },
                            });
                          }}
                          className="flex items-center space-x-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary-hover active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>
                            {acceptInvitation.isPending ? 'Đang xác nhận...' : 'Đồng ý tham gia'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
