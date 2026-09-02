'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export function AccessDenied({
  title,
  message,
}: AccessDeniedProps) {
  const { t } = useTranslation('error');

  const displayTitle = title || t('accessDenied');
  const displayMessage = message || t('accessDeniedDesc');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-2xl backdrop-blur-md">
        <ShieldAlert className="h-10 w-10 animate-pulse" />
      </div>

      <h1 className="mt-6 text-2xl font-black text-white font-heading tracking-tight sm:text-3xl">
        {displayTitle}
      </h1>

      <p className="mt-2.5 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
        {displayMessage}
      </p>

      <div className="mt-8 flex items-center space-x-4">
        <Link
          href="/workspaces"
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('backHome')}</span>
        </Link>
      </div>
    </div>
  );
}
