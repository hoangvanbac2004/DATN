'use client';

import React from 'react';

export function ProjectCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl border border-white/5 bg-gray-900/40 p-5 backdrop-blur-sm animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-3 rounded-full bg-gray-800" />
              <div className="h-5 w-12 rounded-full bg-gray-800/80" />
            </div>
            <div className="h-4 w-3/4 rounded bg-gray-800" />
            <div className="h-3 w-full rounded bg-gray-800/60" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="h-3 w-20 rounded bg-gray-800/60" />
            <div className="h-6 w-16 rounded-lg bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
