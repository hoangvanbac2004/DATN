'use client';

import React from 'react';
import { SearchResultItem } from './search-result-item';
import type { GlobalSearchResultDto } from '../types';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from 'react-i18next';

interface SearchResultsProps {
  data?: GlobalSearchResultDto;
  isLoading: boolean;
  onSelectResult?: () => void;
  onPageChange: (page: number) => void;
}

export function SearchResults({ data, isLoading, onSelectResult, onPageChange }: SearchResultsProps) {
  const { t } = useTranslation('search');

  if (isLoading) {
    return (
      <div className="space-y-2 py-4">
        <div className="h-14 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-14 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-14 animate-pulse rounded-xl bg-surface-alt" />
      </div>
    );
  }

  const items = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={t('noResultsTitle')}
        description={t('noResultsDesc')}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item) => (
          <SearchResultItem key={item.id} item={item} onSelect={onSelectResult} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-border pt-3 text-xs text-text-secondary">
          <span>
            {t('pagination', { total: totalElements, page: page + 1, totalPages })}
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="rounded p-1 border border-surface-border hover:bg-surface-alt disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={data?.last}
              onClick={() => onPageChange(page + 1)}
              className="rounded p-1 border border-surface-border hover:bg-surface-alt disabled:opacity-30 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
