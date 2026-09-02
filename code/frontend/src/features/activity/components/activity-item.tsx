'use client';

import React from 'react';
import {
  CheckSquare, Folder, MessageSquare, Users, FileText, LayoutDashboard, Zap, Globe,
} from 'lucide-react';
import type { ActivityLogDto } from '../types';

interface ActivityItemProps {
  activity: ActivityLogDto;
}

function getEntityIcon(entityType: string) {
  switch (entityType) {
    case 'TASK':        return <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />;
    case 'PROJECT':     return <Folder className="h-3.5 w-3.5 text-emerald-400" />;
    case 'COMMENT':     return <MessageSquare className="h-3.5 w-3.5 text-sky-400" />;
    case 'MEMBER':      return <Users className="h-3.5 w-3.5 text-amber-400" />;
    case 'WIKI':        return <FileText className="h-3.5 w-3.5 text-violet-400" />;
    case 'WHITEBOARD':  return <LayoutDashboard className="h-3.5 w-3.5 text-pink-400" />;
    case 'AUTOMATION':  return <Zap className="h-3.5 w-3.5 text-orange-400" />;
    default:            return <Globe className="h-3.5 w-3.5 text-gray-400" />;
  }
}

function getEntityColor(entityType: string) {
  switch (entityType) {
    case 'TASK':       return 'bg-indigo-500/10 border-indigo-500/20';
    case 'PROJECT':    return 'bg-emerald-500/10 border-emerald-500/20';
    case 'COMMENT':    return 'bg-sky-500/10 border-sky-500/20';
    case 'MEMBER':     return 'bg-amber-500/10 border-amber-500/20';
    case 'WIKI':       return 'bg-violet-500/10 border-violet-500/20';
    case 'WHITEBOARD': return 'bg-pink-500/10 border-pink-500/20';
    default:           return 'bg-white/5 border-white/10';
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const userName = activity.user?.fullName || activity.user?.email || 'Unknown User';
  const colorClass = getEntityColor(activity.entityType);

  return (
    <div className="group relative flex items-start gap-4 py-3">
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}>
          {getEntityIcon(activity.entityType)}
        </div>
        {/* Vertical connector line drawn by parent */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* User Avatar */}
            {activity.user?.avatarUrl ? (
              <img
                src={activity.user.avatarUrl}
                alt={userName}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[9px] font-bold text-white">
                {getInitials(userName)}
              </div>
            )}
            <p className="text-xs text-white">
              <span className="font-semibold">{userName}</span>{' '}
              <span className="text-gray-400">{formatAction(activity.action)}</span>
            </p>
            {/* Entity Type Badge */}
            <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${colorClass}`}>
              {activity.entityType}
            </span>
          </div>
          <span className="shrink-0 text-[10px] text-gray-600 group-hover:text-gray-400 transition">
            {formatTime(activity.createdAt)}
          </span>
        </div>

        {/* Details */}
        {activity.details && (
          <p className="mt-1 text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {activity.details}
          </p>
        )}
      </div>
    </div>
  );
}
