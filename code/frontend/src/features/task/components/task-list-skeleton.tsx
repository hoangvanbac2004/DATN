'use client';

import React from 'react';
import { Skeleton, SkeletonAvatar, SkeletonLine } from '@/components/ui/skeleton';

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827]/60 p-4"
        >
          <div className="flex items-center space-x-3.5 flex-1">
            <Skeleton className="h-5 w-5 rounded-md" />
            <div className="space-y-1.5 flex-1 max-w-md">
              <SkeletonLine width="w-3/4" height="h-4" />
              <SkeletonLine width="w-1/2" height="h-3" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <SkeletonAvatar size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
