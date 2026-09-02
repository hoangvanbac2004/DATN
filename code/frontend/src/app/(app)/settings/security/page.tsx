'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Lock, Laptop } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChangePassword } from '@/features/auth/hooks/use-auth';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu mới không trùng khớp',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function SecurityPage() {
  const { t } = useTranslation('settings');
  const changePasswordMutation = useChangePassword();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Đổi mật khẩu thành công!');
          reset();
          setTimeout(() => setSuccessMsg(null), 3000);
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Change Password */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-surface-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary font-heading">{t('security.changePassword')}</h2>
            <p className="text-[11px] text-text-secondary">{t('security.subtitle')}</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('security.currentPassword')}</label>
            <input
              {...register('currentPassword')}
              type="password"
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            />
            {errors.currentPassword && <p className="text-[11px] text-status-error">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('security.newPassword')}</label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            />
            {errors.newPassword && <p className="text-[11px] text-status-error">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('security.confirmNewPassword')}</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary transition focus:border-primary focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-[11px] text-status-error">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('security.savePasswordBtn')
            )}
          </button>
        </form>
      </div>

      {/* Active Sessions Overview Structure */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary font-heading">Phiên đăng nhập đang hoạt động</h2>
            <p className="text-[11px] text-text-secondary">Thiết bị hiện đang truy cập vào tài khoản TaskFlow của bạn</p>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-alt p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Laptop className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Phiên trình duyệt web hiện tại</p>
              <p className="text-[10px] text-text-muted">Bảo mật JWT Token • Đang hoạt động</p>
            </div>
          </div>
          <span className="rounded-full bg-status-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-status-success border border-status-success/20">
            Thiết bị hiện tại
          </span>
        </div>
      </div>
    </div>
  );
}
