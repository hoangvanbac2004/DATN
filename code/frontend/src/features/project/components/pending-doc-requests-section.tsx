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
  BookOpen,
  PenTool,
  FileCheck2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import {
  DocApprovalRequestItem,
  getStoredDocRequests,
  setStoredDocRequests,
  approveDocRequest,
  rejectDocRequest,
  deleteDocRequest,
} from '../services/doc-approval-service';
import type { WikiDocItem } from './create-wiki-doc-modal';
import type { WhiteboardItem } from './create-whiteboard-modal';

interface PendingDocRequestsSectionProps {
  projectId?: string;
  workspaceId?: string;
  onApproveDoc?: (doc: WikiDocItem) => void;
  onApproveWhiteboard?: (wb: WhiteboardItem) => void;
}

export function PendingDocRequestsSection({
  projectId,
  workspaceId,
  onApproveDoc,
  onApproveWhiteboard,
}: PendingDocRequestsSectionProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com';
  const isStaff = !isAdmin && !isManager;
  const canManage = isAdmin || isManager;

  const [requests, setRequests] = useState<DocApprovalRequestItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadRequests = () => {
    const all = getStoredDocRequests();
    // Filter for this project if provided
    const filtered = projectId ? all.filter((r) => r.projectId === projectId) : all;
    setRequests(filtered);
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('doc_requests_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('doc_requests_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [projectId]);

  const handleApprove = (req: DocApprovalRequestItem) => {
    const reviewerName = user?.fullName || user?.email || 'Quản lý';
    const approved = approveDocRequest(req.id, reviewerName);
    if (!approved) return;

    if (req.type === 'WIKI') {
      const newDoc: WikiDocItem = {
        id: `wiki-${Date.now()}`,
        title: req.title,
        category: req.category || 'Kỹ thuật',
        version: req.version || 'v1.0',
        summary: req.summary || req.description || '',
        workspaceId: req.workspaceId,
        projectId: req.projectId,
        updatedAt: 'Vừa xong',
        updatedBy: `${req.requesterName} (Duyệt bởi ${reviewerName})`,
      };
      if (onApproveDoc) onApproveDoc(newDoc);
      toast.success(`Đã phê duyệt và xuất bản tài liệu Wiki "${req.title}" vào dự án!`);
    } else {
      const newWb: WhiteboardItem = {
        id: `wb-${Date.now()}`,
        title: req.title,
        status: 'Đang hoạt động',
        description: req.description || 'Bảng vẽ phác thảo sơ đồ cộng tác.',
        workspaceId: req.workspaceId,
        projectId: req.projectId,
        updatedAt: 'Vừa xong',
        activeMembersCount: 1,
      };
      if (onApproveWhiteboard) onApproveWhiteboard(newWb);
      toast.success(`Đã phê duyệt và xuất bản Bảng vẽ "${req.title}" vào dự án!`);
    }

    loadRequests();
  };

  const handleReject = (req: DocApprovalRequestItem) => {
    const reviewerName = user?.fullName || user?.email || 'Quản lý';
    rejectDocRequest(req.id, reviewerName);
    toast.info(`Đã từ chối yêu cầu tạo ${req.type === 'WIKI' ? 'tài liệu Wiki' : 'bảng vẽ'} "${req.title}".`);
    loadRequests();
  };

  const handleDelete = (id: string) => {
    deleteDocRequest(id);
    loadRequests();
    toast.success('Đã xóa bản ghi yêu cầu.');
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const historyRequests = requests.filter((r) => r.status !== 'PENDING');
  const myRequests = requests.filter(
    (r) => r.requesterEmail === user?.email || r.requesterId === user?.id
  );

  // If there are no pending requests and user is not staff with requests, return null
  if (!canManage && (!isStaff || myRequests.length === 0)) return null;
  if (canManage && requests.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* 1. For Admin / Manager: Pending Approval Requests */}
      {canManage && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4.5 transition shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-sm font-bold text-text-primary">
                    Yêu cầu duyệt Tài liệu Wiki & Bảng vẽ
                  </h3>
                  {pendingRequests.length > 0 ? (
                    <span className="animate-pulse rounded-full bg-indigo-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                      {pendingRequests.length} yêu cầu cần duyệt
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-alt border border-surface-border px-2.5 py-0.5 text-[10px] font-medium text-text-muted">
                      0 yêu cầu mới
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Kiểm duyệt tài liệu Wiki và Bảng vẽ do Nhân viên (Staff) tạo trước khi xuất bản vào Dự án
                </p>
              </div>
            </div>

            {historyRequests.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-text-secondary hover:bg-surface-alt transition shadow-xs cursor-pointer"
              >
                {showHistory ? 'Ẩn lịch sử' : `Xem lịch sử đã xử lý (${historyRequests.length})`}
              </button>
            )}
          </div>

          {/* Pending List */}
          {pendingRequests.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface p-4 shadow-sm hover:border-indigo-500/40 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {req.type === 'WIKI' ? (
                          <span className="inline-flex items-center space-x-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500 dark:text-blue-400">
                            <BookOpen className="h-3 w-3" />
                            <span>Wiki Doc</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500 dark:text-purple-400">
                            <PenTool className="h-3 w-3" />
                            <span>Bảng vẽ</span>
                          </span>
                        )}
                        <h4 className="font-bold text-xs text-text-primary truncate">
                          {req.title}
                        </h4>
                      </div>
                      <span className="shrink-0 text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {req.createdAt}
                      </span>
                    </div>

                    {(req.summary || req.description) && (
                      <p className="mt-2 text-[11px] text-text-secondary line-clamp-2 bg-surface-alt/60 p-2.5 rounded-lg border border-surface-border/50 leading-relaxed">
                        {req.summary || req.description}
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
                      onClick={() => handleReject(req)}
                      className="flex items-center space-x-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Từ chối</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(req)}
                      className="flex items-center space-x-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Phê duyệt & Xuất bản</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 py-2 text-center text-xs text-text-muted">
              Hiện tại không có yêu cầu duyệt tài liệu hoặc bảng vẽ nào.
            </div>
          )}

          {/* Processed History */}
          {showHistory && historyRequests.length > 0 && (
            <div className="mt-4 pt-3 border-t border-surface-border">
              <h5 className="text-[11px] font-bold text-text-muted mb-2">
                Lịch sử yêu cầu đã xử lý ({historyRequests.length})
              </h5>
              <div className="space-y-2">
                {historyRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-surface-border text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className={
                          req.status === 'APPROVED'
                            ? 'text-emerald-500 font-bold'
                            : 'text-rose-500 font-bold'
                        }
                      >
                        {req.status === 'APPROVED' ? '✓ Đã duyệt' : '✕ Đã từ chối'}
                      </span>
                      <span className="font-semibold text-text-primary truncate">{req.title}</span>
                      <span className="text-text-muted text-[10px]">
                        ({req.type === 'WIKI' ? 'Wiki' : 'Bảng vẽ'}) bởi {req.requesterName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-text-muted">
                        {req.reviewedAt || req.createdAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(req.id)}
                        className="p-1 text-text-muted hover:text-rose-500 transition cursor-pointer"
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
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4.5 transition shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Yêu cầu Tài liệu & Bảng vẽ của bạn ({myRequests.length})
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
                  <div className="flex items-center space-x-1.5 min-w-0">
                    {req.type === 'WIKI' ? (
                      <span className="text-[10px] bg-blue-500/10 text-blue-500 rounded px-1.5 py-0.5 font-bold">
                        Wiki
                      </span>
                    ) : (
                      <span className="text-[10px] bg-purple-500/10 text-purple-500 rounded px-1.5 py-0.5 font-bold">
                        Bảng vẽ
                      </span>
                    )}
                    <span className="font-bold text-text-primary truncate">{req.title}</span>
                  </div>
                  {req.status === 'PENDING' && (
                    <span className="shrink-0 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                      ⏳ Chờ duyệt
                    </span>
                  )}
                  {req.status === 'APPROVED' && (
                    <span className="shrink-0 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">
                      ✓ Đã duyệt
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="shrink-0 rounded-md bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                      ✕ Từ chối
                    </span>
                  )}
                </div>
                {(req.summary || req.description) && (
                  <p className="mt-1.5 text-[11px] text-text-muted line-clamp-1">
                    {req.summary || req.description}
                  </p>
                )}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-text-muted pt-1.5 border-t border-surface-border/50">
                  <span>Gửi lúc: {req.createdAt}</span>
                  {req.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(req.id)}
                      className="text-rose-500 hover:underline cursor-pointer"
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
