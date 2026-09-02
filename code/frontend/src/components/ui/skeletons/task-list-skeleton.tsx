'use client';

import React from 'react';

export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-gray-900/40 p-3.5 backdrop-blur-sm animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 rounded border border-white/10 bg-gray-800" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-48 rounded bg-gray-800" />
              <div className="h-2.5 w-24 rounded bg-gray-800/60" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 rounded-md bg-gray-800" />
            <div className="h-6 w-6 rounded-full bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
