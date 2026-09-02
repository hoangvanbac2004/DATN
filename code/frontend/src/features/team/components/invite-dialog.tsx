'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Mail, Shield, Folder, CheckCircle2, AlertTriangle, Loader2, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/features/project/hooks/use-project';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { InviteMemberPayload, WorkspaceRole } from '../types';

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    payload: InviteMemberPayload,
    callbacks?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => void;
  isLoading?: boolean;
  workspaceId?: string;
}

export function InviteDialog({ isOpen, onClose, onSubmit, isLoading, workspaceId }: InviteDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation('team');
  const { t: tCommon } = useTranslation('common');
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const targetWorkspaceId = workspaceId || activeWorkspace?.id || '';

  const { data: projects = [] } = useProjects(targetWorkspaceId || null);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('MEMBER');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Feedback State: 'IDLE' | 'SUCCESS' | 'ERROR'
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedRole, setSubmittedRole] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setStatus('IDLE');
    setErrorMessage('');
    setEmail('');
    setSelectedProjectId('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) return;

    setSubmittedEmail(targetEmail);
    setSubmittedRole(role === 'ADMIN' ? 'Quản trị viên' : role === 'MANAGER' ? 'Quản lý' : 'Nhân viên');
    setErrorMessage('');

    onSubmit(
      { email: targetEmail, role },
      {
        onSuccess: () => {
          setStatus('SUCCESS');
          setEmail('');
        },
        onError: (err: any) => {
          let msg = err.response?.data?.message || err.message;
          if (!msg) msg = 'Không thể gửi lời mời. Vui lòng kiểm tra địa chỉ Email và thử lại.';
          setErrorMessage(msg);
          setStatus('ERROR');
        },
      }
    );
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl text-text-primary space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary font-heading">
                {t('inviteModalTitle', { defaultValue: 'Mời thành viên tham gia' })}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Thêm đồng nghiệp vào không gian làm việc TaskFlow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl p-2 text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FEEDBACK STATE: SUCCESS */}
        {status === 'SUCCESS' && (
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-text-primary font-heading">
                Đã gửi lời mời tham gia thành công!
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed px-4">
                Đã gửi lời mời tới <strong className="text-primary font-semibold">{submittedEmail}</strong> với vai trò <strong className="text-text-primary font-semibold">{submittedRole}</strong>.
              </p>
              <div className="mx-auto max-w-sm rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                🔔 Thông báo kèm quyền truy cập đã được gửi tới tài khoản của người dùng.
              </div>
            </div>

            <div className="border-t border-surface-border pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK STATE: ERROR */}
        {status === 'ERROR' && (
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-error/10 text-status-error">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-status-error font-heading">
                Không thể gửi lời mời!
              </h4>
              <div className="rounded-xl border border-status-error/20 bg-status-error/5 p-3 text-xs text-status-error text-left">
                {errorMessage}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-surface-border pt-4">
              <button
                type="button"
                onClick={() => setStatus('IDLE')}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition"
              >
                Thử lại
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-surface-border bg-surface-alt px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface hover:text-text-primary transition"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* NORMAL STATE: IDLE (FORM) */}
        {status === 'IDLE' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                {t('emailLabel', { defaultValue: 'Địa chỉ Email' })} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder', { defaultValue: 'nhanvien@congty.com' })}
                  required
                  className="w-full rounded-xl border border-surface-border bg-surface-alt pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            {/* Role Selection (Card grid) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                {t('roleLabel', { defaultValue: 'Vai trò trong Không gian làm việc' })} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('MEMBER')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'MEMBER'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-surface-border bg-surface-alt text-text-secondary hover:bg-surface hover:border-surface-border/80'
                  }`}
                >
                  <span className="text-lg mb-1">🧑‍💻</span>
                  <span className="text-xs font-bold">Nhân viên</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Quyền tiêu chuẩn</span>
                  {role === 'MEMBER' && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('MANAGER')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'MANAGER'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                      : 'border-surface-border bg-surface-alt text-text-secondary hover:bg-surface hover:border-surface-border/80'
                  }`}
                >
                  <span className="text-lg mb-1">👔</span>
                  <span className="text-xs font-bold">Quản lý</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Quản lý dự án</span>
                  {role === 'MANAGER' && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'ADMIN'
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-xs'
                      : 'border-surface-border bg-surface-alt text-text-secondary hover:bg-surface hover:border-surface-border/80'
                  }`}
                >
                  <span className="text-lg mb-1">🛡️</span>
                  <span className="text-xs font-bold">Quản trị viên</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Toàn quyền kiểm soát</span>
                  {role === 'ADMIN' && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Project Selector Assignment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                Phân công vào Dự án cụ thể <span className="text-text-muted font-normal">(Không bắt buộc)</span>
              </label>
              <div className="relative">
                <Folder className="absolute left-3.5 top-3 h-4 w-4 text-text-muted pointer-events-none" />
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-surface-border bg-surface-alt pl-10 pr-10 py-2.5 text-xs font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition cursor-pointer"
                >
                  <option value="" className="bg-surface text-text-muted">
                    -- Chưa phân công dự án (Chỉ vào Không gian làm việc) --
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-surface text-text-primary">
                      📁 {p.name} {p.key ? `(#${p.key})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-3 h-4 w-4 text-text-muted pointer-events-none" />
              </div>
              <p className="text-[11px] text-text-muted flex items-center space-x-1 pt-0.5">
                <span>💡</span>
                <span>Thành viên sẽ được tự động thêm vào dự án đã chọn sau khi tham gia.</span>
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 border-t border-surface-border pt-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-surface-border bg-surface-alt px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface hover:text-text-primary transition"
              >
                {tCommon('actions.cancel', { defaultValue: 'Hủy' })}
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex items-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>{t('actions.sendInvite', { defaultValue: 'Gửi lời mời' })}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

