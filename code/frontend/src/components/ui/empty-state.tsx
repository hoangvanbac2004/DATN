'use client';

import React from 'react';
import { LucideIcon, FolderPlus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderPlus,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-alt/50 p-8 text-center backdrop-blur-md transition-all ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-text-primary font-heading">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-text-secondary">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
