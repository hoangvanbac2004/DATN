'use client';

import React from 'react';

interface OnlineIndicatorProps {
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function OnlineIndicator({ isOnline = true, size = 'sm', label }: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  return (
    <div className="flex items-center space-x-1.5 inline-flex">
      <span className="relative flex">
        {isOnline && (
          <span
            className={`absolute inline-flex animate-ping rounded-full bg-emerald-400 opacity-75 ${sizeClasses[size]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-gray-500'
          } ${sizeClasses[size]}`}
        />
      </span>
      {label && (
        <span className="text-[11px] font-medium text-gray-300">
          {isOnline ? label : 'Offline'}
        </span>
      )}
    </div>
  );
}
