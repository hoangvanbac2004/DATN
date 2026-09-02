'use client';

import React from 'react';
import { Skeleton, SkeletonLine } from '@/components/ui/skeleton';

export function ProjectGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-[#111827]/60 p-5 space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <SkeletonLine width="w-2/3" height="h-4" />
              <SkeletonLine width="w-1/3" height="h-3" />
            </div>
          </div>
          <SkeletonLine width="w-full" height="h-3" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
