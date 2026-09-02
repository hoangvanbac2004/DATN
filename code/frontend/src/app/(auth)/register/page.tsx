'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/features/auth/hooks/use-auth';

const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { t: tVal } = useTranslation('validation');
  const registerMutation = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage(null);
    registerMutation.mutate(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error: any) => {
          let msg = error.response?.data?.message;
          if (error.response?.data?.data && typeof error.response.data.data === 'object') {
            const fieldErrors = Object.values(error.response.data.data).join(', ');
            if (fieldErrors) msg = fieldErrors;
          }
          if (!msg) msg = error.message || t('messages.genericError', { defaultValue: 'Registration failed' });
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">{t('createAccount')}</h2>
        <p className="text-xs text-gray-400">{t('registerSubtitle')}</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">{t('labels.fullName')}</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              {...register('fullName')}
              type="text"
              placeholder={t('placeholders.fullName')}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.fullName && <p className="text-[11px] text-red-400">{tVal('minName', { min: 2 })}</p>}
        </div>

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
          <label className="text-xs font-medium text-gray-300">{t('labels.password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              {...register('password')}
              type="password"
              placeholder={t('placeholders.password')}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-400">{tVal('minPassword', { min: 8 })}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">{t('labels.confirmPassword')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder={t('placeholders.password')}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-400">{tVal('passwordMismatch')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {registerMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('actions.register')
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400">
        {t('actions.alreadyHaveAccount')}{' '}
        <Link href={'/login' as any} className="font-medium text-indigo-400 hover:underline">
          {t('actions.login')}
        </Link>
      </div>
    </div>
  );
}
