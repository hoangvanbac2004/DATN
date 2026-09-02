'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">{t('forgotPasswordTitle')}</h2>
        <p className="text-xs text-gray-400">
          {t('forgotPasswordSubtitle')}
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs text-gray-300">
            {t('messages.resetSent')}{' '}
            <span className="font-semibold text-white">{email}</span>.
          </p>
          <Link
            href={'/login' as any}
            className="inline-flex items-center text-xs font-medium text-indigo-400 hover:underline"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> {t('actions.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">{t('labels.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('placeholders.email')}
                className="w-full rounded-lg border border-white/10 bg-gray-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
          >
            {t('actions.sendResetLink')}
          </button>

          <div className="text-center">
            <Link
              href={'/login' as any}
              className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> {t('actions.backToLogin')}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
