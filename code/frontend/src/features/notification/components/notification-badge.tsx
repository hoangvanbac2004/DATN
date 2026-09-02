'use client';

import React from 'react';
import { useUnreadNotificationCount } from '../hooks/use-notification';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const { data } = useUnreadNotificationCount();
  const count = data?.unreadCount || 0;

  if (count <= 0) return null;

  return (
    <span
      className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
