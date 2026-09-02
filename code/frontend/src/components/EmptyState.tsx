'use client';

import { FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  const { t } = useTranslation('common');

  const displayTitle = title || t('emptyState.title');
  const displayDescription = description || t('emptyState.description');

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-surface-border p-8 text-center">
      <FolderOpen className="h-12 w-12 text-gray-500 mb-4" />
      <h3 className="text-lg font-medium text-white">{displayTitle}</h3>
      <p className="text-sm text-gray-400 mt-1">{displayDescription}</p>
    </div>
  );
}
