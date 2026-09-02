'use client';

import React from 'react';

export function NotificationListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-start space-x-3 rounded-xl border border-white/5 bg-gray-900/40 p-4 backdrop-blur-sm animate-pulse"
        >
          <div className="h-9 w-9 rounded-xl bg-gray-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-gray-800" />
            <div className="h-3 w-3/4 rounded bg-gray-800/60" />
            <div className="h-2.5 w-16 rounded bg-gray-800/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
