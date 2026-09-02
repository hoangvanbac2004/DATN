'use client';

import React from 'react';
import { Bell, BellOff, CheckCircle2, Clock } from 'lucide-react';
import type { ReminderDto, ReminderStatus } from '../types';

interface ReminderBadgeProps {
  reminder: ReminderDto;
  onDismiss?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ReminderBadge({ reminder, onDismiss, onDelete }: ReminderBadgeProps) {
  const dateObj = new Date(reminder.remindAt);
  const formatted = dateObj.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusStyles = (status: ReminderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
      case 'TRIGGERED':
        return 'border-amber-500/40 bg-amber-500/15 text-amber-300 animate-pulse';
      case 'DISMISSED':
        return 'border-white/10 bg-gray-900/60 text-gray-500';
      case 'CANCELLED':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border-white/10 bg-gray-900 text-gray-400';
    }
  };

  return (
    <div className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs transition ${getStatusStyles(reminder.status)}`}>
      <div className="flex items-center space-x-2 truncate">
        {reminder.status === 'TRIGGERED' ? (
          <Bell className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        ) : reminder.status === 'DISMISSED' ? (
          <BellOff className="h-3.5 w-3.5 text-gray-500 shrink-0" />
        ) : (
          <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
        )}

        <span className="font-medium truncate">{formatted}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
          {reminder.status}
        </span>
      </div>

      <div className="flex items-center space-x-1 ml-2">
        {reminder.status === 'PENDING' && onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(reminder.id)}
            className="rounded p-0.5 hover:bg-white/10 hover:text-white transition"
            title="Dismiss reminder"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(reminder.id)}
            className="rounded p-0.5 hover:bg-red-500/20 hover:text-red-400 transition"
            title="Delete reminder"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
