'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SearchEntityType } from '../types';

interface FilterPanelProps {
  selectedType: SearchEntityType;
  onSelectType: (type: SearchEntityType) => void;
  sortBy: 'relevance' | 'date' | 'title';
  onSelectSortBy: (sort: 'relevance' | 'date' | 'title') => void;
  counts?: {
    tasks: number;
    projects: number;
    tags: number;
    comments: number;
  };
}

export function FilterPanel({
  selectedType,
  onSelectType,
  sortBy,
  onSelectSortBy,
  counts,
}: FilterPanelProps) {
  const { t } = useTranslation('search');

  const tabs: { label: string; value: SearchEntityType; count?: number }[] = [
    { label: t('tabAll'), value: 'ALL' },
    { label: t('tabTasks'), value: 'TASK', count: counts?.tasks },
    { label: t('tabProjects'), value: 'PROJECT', count: counts?.projects },
    { label: t('tabTags'), value: 'TAG', count: counts?.tags },
    { label: t('tabComments'), value: 'COMMENT', count: counts?.comments },
  ];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onSelectType(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedType === tab.value
                ? 'bg-menu-active text-menu-activeText font-bold shadow-xs'
                : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] text-primary">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sorting Selector */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-text-secondary">{t('sortBy')}</span>
        <select
          value={sortBy}
          onChange={(e) => onSelectSortBy(e.target.value as any)}
          className="rounded-lg border border-surface-border bg-surface-alt px-2.5 py-1 text-xs text-text-primary outline-none focus:border-primary"
        >
          <option value="relevance" className="bg-surface text-text-primary">{t('sortRelevance')}</option>
          <option value="date" className="bg-surface text-text-primary">{t('sortDate')}</option>
          <option value="title" className="bg-surface text-text-primary">{t('sortTitle')}</option>
        </select>
      </div>
    </div>
  );
}
