'use client';

import React from 'react';
import { Skeleton, SkeletonAvatar, SkeletonLine } from '@/components/ui/skeleton';

export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
      </div>
      <div className="space-y-4 pl-4 border-l border-white/10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <SkeletonAvatar size="sm" />
            <div className="space-y-1.5 flex-1">
              <SkeletonLine width="w-1/2" height="h-4" />
              <SkeletonLine width="w-3/4" height="h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
