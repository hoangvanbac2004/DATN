'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useTaskReminders, useDismissReminder, useDeleteReminder } from '../hooks/use-reminder';
import { ReminderBadge } from './reminder-badge';
import { ReminderPicker } from './reminder-picker';

interface ReminderListProps {
  taskId: string;
}

export function ReminderList({ taskId }: ReminderListProps) {
  const { data: reminders = [], isLoading } = useTaskReminders(taskId);
  const dismissReminder = useDismissReminder(taskId);
  const deleteReminder = useDeleteReminder(taskId);

  const handleDismiss = (id: string) => {
    dismissReminder.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteReminder.mutate(id);
  };

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-gray-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Reminders ({reminders.length})
          </h3>
        </div>

        <ReminderPicker taskId={taskId} />
      </div>

      {isLoading ? (
        <div className="h-8 animate-pulse rounded-lg bg-gray-900/60" />
      ) : (
        <div className="space-y-1.5 pt-1">
          {reminders.map((reminder) => (
            <ReminderBadge
              key={reminder.id}
              reminder={reminder}
              onDismiss={handleDismiss}
              onDelete={handleDelete}
            />
          ))}

          {reminders.length === 0 && (
            <p className="text-center py-2 text-xs text-gray-500 italic">No scheduled reminders for this task.</p>
          )}
        </div>
      )}
    </div>
  );
}
