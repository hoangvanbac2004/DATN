'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { ActivityGroup } from '../types';
import { ActivityItem } from './activity-item';

interface ActivityTimelineProps {
  groups: ActivityGroup[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export function ActivityTimeline({
  groups,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: ActivityTimelineProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (groups.length === 0) return null;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.dateLabel}>
          {/* Date Group Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {group.dateLabel}
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Items with timeline line */}
          <div className="relative pl-2">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

            <div className="space-y-0 divide-y divide-white/5">
              {group.items.map((item) => (
                <ActivityItem key={item.id} activity={item} />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="flex items-center justify-center py-6">
        {isFetchingNextPage ? (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more…</span>
          </div>
        ) : !hasNextPage ? (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>All activities loaded</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
