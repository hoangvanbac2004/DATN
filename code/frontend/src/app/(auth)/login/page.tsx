'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/features/auth/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { t: tVal } = useTranslation('validation');
  const loginMutation = useLogin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || t('messages.genericError', { defaultValue: 'Login failed' });
        setErrorMessage(msg);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">{t('welcomeBack')}</h2>
        <p className="text-xs text-gray-400">{t('loginSubtitle')}</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">{t('labels.email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              {...register('email')}
              type="email"
              placeholder={t('placeholders.email')}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-400">{tVal('invalidEmail')}</p>}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">{t('labels.password')}</label>
            <Link
              href={'/forgot-password' as any}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              {t('actions.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              {...register('password')}
              type="password"
              placeholder={t('placeholders.password')}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-400">{tVal('required')}</p>}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('actions.login')
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400">
        {t('actions.dontHaveAccount')}{' '}
        <Link href={'/register' as any} className="font-medium text-indigo-400 hover:underline">
          {t('actions.register')}
        </Link>
      </div>
    </div>
  );
}
