'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, FolderKanban, Tag, MessageSquare } from 'lucide-react';
import type { SearchResultItemDto } from '../types';
import { useTranslation } from 'react-i18next';

interface SearchResultItemProps {
  item: SearchResultItemDto;
  onSelect?: () => void;
}

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const { t } = useTranslation('search');

  const getTypeBadge = () => {
    switch (item.type) {
      case 'TASK':
        return (
          <span className="flex items-center space-x-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            <CheckSquare className="h-3 w-3" />
            <span>{t('tabTasks').toUpperCase()}</span>
          </span>
        );
      case 'PROJECT':
        return (
          <span className="flex items-center space-x-1 rounded bg-status-success/10 px-1.5 py-0.5 text-[10px] font-bold text-status-success">
            <FolderKanban className="h-3 w-3" />
            <span>{t('tabProjects').toUpperCase()}</span>
          </span>
        );
      case 'TAG':
        return (
          <span className="flex items-center space-x-1 rounded bg-status-warning/10 px-1.5 py-0.5 text-[10px] font-bold text-status-warning">
            <Tag className="h-3 w-3" />
            <span>{t('tabTags').toUpperCase()}</span>
          </span>
        );
      case 'COMMENT':
        return (
          <span className="flex items-center space-x-1 rounded bg-status-info/10 px-1.5 py-0.5 text-[10px] font-bold text-status-info">
            <MessageSquare className="h-3 w-3" />
            <span>{t('tabComments').toUpperCase()}</span>
          </span>
        );
    }
  };

  return (
    <Link
      href={item.link as any}
      onClick={onSelect}
      className="group flex items-start justify-between rounded-xl border border-surface-border bg-surface-alt p-3 text-xs transition hover:border-primary/50 hover:bg-surface-alt/80"
    >
      <div className="space-y-1 min-w-0 flex-1 pr-3">
        <div className="flex items-center space-x-2">
          {getTypeBadge()}
          <h4 className="font-bold text-text-primary group-hover:text-primary transition truncate">{item.title}</h4>
        </div>

        {item.description && (
          <p className="text-[11px] text-text-secondary line-clamp-2">{item.description}</p>
        )}
      </div>

      {item.createdAt && (
        <span className="text-[10px] text-text-muted shrink-0">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      )}
    </Link>
  );
}
