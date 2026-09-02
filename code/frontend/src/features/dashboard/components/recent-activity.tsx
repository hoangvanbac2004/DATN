'use client';

import React from 'react';
import { Activity, CheckCircle2, PlusCircle, Clock, PlayCircle, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ActivityItemDto } from '../types';

interface RecentActivityProps {
  activities: ActivityItemDto[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const { t: tDash } = useTranslation('dashboard');

  const formatTimeAgo = (timestamp?: string) => {
    if (!timestamp) return 'Vừa xong';
    const diffSec = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (diffSec < 60) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'TASK_IN_PROGRESS':
        return <PlayCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <PlusCircle className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-xs space-y-4 text-text-primary">
      <div className="flex items-center space-x-2.5 border-b border-surface-border pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 shadow-xs">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-text-primary font-heading">
            {tDash('activity.title', { defaultValue: 'Nhật ký Hoạt động Gần đây' })}
          </h3>
          <p className="text-[11px] text-text-secondary">
            {tDash('activity.subtitle', { defaultValue: 'Các thao tác cập nhật công việc và dự án trong Workspace' })}
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted italic space-y-1">
          <Clock3 className="h-5 w-5 mx-auto text-text-muted opacity-60" />
          <p>{tDash('activity.noActivity', { defaultValue: 'Chưa có nhật ký hoạt động nào gần đây' })}</p>
        </div>
      ) : (
        <div className="divide-y divide-surface-border/40 space-y-1">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start space-x-3 pt-3 pb-2 first:pt-1">
              <div className="mt-0.5 shrink-0">
                {getActionIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate font-heading hover:text-primary transition">
                  {act.title}
                </p>
                <p className="text-[11px] text-text-secondary truncate mt-0.5">
                  {act.description}
                </p>
              </div>
              <span className="text-[10px] text-text-muted font-medium shrink-0 pt-0.5">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
