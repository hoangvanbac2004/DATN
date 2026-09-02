'use client';

import React, { useState, useEffect } from 'react';
import { useUnreadNotificationCount } from '../hooks/use-notification';
import { useAuthStore } from '@/store/auth-store';
import { getStoredTaskRequests } from '@/features/task/components/pending-task-requests-section';
import { getStoredDocRequests } from '@/features/project/services/doc-approval-service';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const { data } = useUnreadNotificationCount();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'admin@gmail.com';
  const isManager = user?.roles?.includes('ROLE_MANAGER') || user?.email === 'manager@gmail.com';

  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const calc = () => {
      const tasks = getStoredTaskRequests();
      const docs = getStoredDocRequests();
      if (isAdmin || isManager) {
        const pendingTasks = tasks.filter((r) => r.status === 'PENDING').length;
        const pendingDocs = docs.filter((r) => r.status === 'PENDING').length;
        setRequestCount(pendingTasks + pendingDocs);
      } else {
        const myPending = [
          ...tasks.filter(
            (r) => (r.requesterEmail === user?.email || r.requesterId === user?.id) && r.status === 'PENDING'
          ),
          ...docs.filter(
            (r) => (r.requesterEmail === user?.email || r.requesterId === user?.id) && r.status === 'PENDING'
          ),
        ].length;
        setRequestCount(myPending);
      }
    };

    calc();
    window.addEventListener('task_requests_updated', calc);
    window.addEventListener('doc_requests_updated', calc);
    window.addEventListener('storage', calc);
    return () => {
      window.removeEventListener('task_requests_updated', calc);
      window.removeEventListener('doc_requests_updated', calc);
      window.removeEventListener('storage', calc);
    };
  }, [isAdmin, isManager, user]);

  const count = (data?.unreadCount || 0) + requestCount;

  if (count <= 0) return null;

  return (
    <span
      className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
