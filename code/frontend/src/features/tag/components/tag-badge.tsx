'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { TagDto } from '../types';

interface TagBadgeProps {
  tag: TagDto;
  onRemove?: (tagId: string) => void;
  size?: 'sm' | 'md';
}

export function TagBadge({ tag, onRemove, size = 'sm' }: TagBadgeProps) {
  const hex = tag.color || '#6366F1';

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center space-x-1 font-medium rounded-full transition shadow-sm ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        backgroundColor: `${hex}25`,
        color: hex,
        border: `1px solid ${hex}40`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: hex }} />
      <span className="truncate max-w-[120px]">{tag.name}</span>

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag.id);
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/20 transition opacity-70 hover:opacity-100"
          title="Remove tag"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
}
