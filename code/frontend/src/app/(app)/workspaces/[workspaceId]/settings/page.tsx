'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Trash2, Settings, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useDeleteWorkspace,
  useUpdateWorkspace,
  useWorkspaceDetails,
} from '@/features/workspace/hooks/use-workspace';
import { TeamSettings } from '@/features/team/components/team-settings';

const updateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Tên không gian làm việc phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
});

type UpdateWorkspaceFormData = z.infer<typeof updateWorkspaceSchema>;

export default function WorkspaceSettingsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const router = useRouter();
  const { t: tWs } = useTranslation('workspace');
  const { t: tCommon } = useTranslation('common');

  const { data: workspace, isLoading } = useWorkspaceDetails(workspaceId);

  const updateMutation = useUpdateWorkspace(workspaceId);
  const deleteMutation = useDeleteWorkspace();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    values: {
      name: workspace?.name || '',
      description: workspace?.description || '',
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center text-xs text-text-muted py-12">
        Không tìm thấy không gian làm việc hoặc không có quyền truy cập.
      </div>
    );
  }

  const isOwner = workspace.userRole === 'OWNER';

  const onSubmit = (data: UpdateWorkspaceFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    updateMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Đã lưu thay đổi không gian làm việc thành công!');
          setTimeout(() => setSuccessMsg(null), 3000);
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Cập nhật không gian làm việc thất bại.');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(workspaceId, {
      onSuccess: () => {
        router.push('/workspaces' as any);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-surface-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-text-primary font-heading">
          Cài đặt không gian làm việc
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Quản lý thông tin chung, danh sách thành viên và phân quyền không gian làm việc
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Information Settings */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-surface-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary font-heading">Thông tin chung</h2>
              <p className="text-[11px] text-text-secondary">Cập nhật tên và mô tả không gian làm việc</p>
            </div>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-2 rounded-lg border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">
              <Check className="h-4 w-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Tên Workspace</label>
              <input
                {...register('name')}
                type="text"
                className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
              />
              {errors.name && <p className="text-[11px] text-status-error">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Mô tả</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </form>
        </div>

        {/* Team Collaboration Component */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs">
          <TeamSettings workspaceId={workspaceId} />
        </div>
      </div>

      {/* Danger Zone (Owner Only) */}
      {isOwner && (
        <div className="rounded-2xl border border-status-error/30 bg-status-error/5 p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-status-error flex items-center font-heading">
                <ShieldAlert className="mr-2 h-4 w-4" /> Vùng nguy hiểm (Danger Zone)
              </h3>
              <p className="text-xs text-text-secondary">
                Xóa không gian làm việc này. Tất cả thành viên sẽ mất quyền truy cập.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-status-error/10 px-4 py-2 text-xs font-semibold text-status-error border border-status-error/30 hover:bg-status-error hover:text-white transition active:scale-95 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 text-text-primary">
            <h3 className="text-base font-bold text-text-primary font-heading">Xác nhận xóa Workspace</h3>
            <p className="text-xs text-text-secondary">
              Bạn có chắc chắn muốn xóa <span className="font-bold text-text-primary">{workspace.name}</span> không? Hành động này có thể xem xét lại qua quy trình lưu trữ.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="rounded-lg border border-surface-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-alt"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center rounded-lg bg-status-error px-3 py-1.5 text-xs font-semibold text-white hover:bg-status-error/90"
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
