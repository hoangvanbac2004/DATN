'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation('error');

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">{t('notFound')}</h2>
      <p className="text-gray-400 mt-2">{t('notFoundDesc')}</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
