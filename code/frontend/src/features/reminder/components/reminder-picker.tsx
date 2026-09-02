'use client';

import React, { useState } from 'react';
import { Bell, Plus, Calendar } from 'lucide-react';
import { useCreateReminder } from '../hooks/use-reminder';

interface ReminderPickerProps {
  taskId: string;
}

export function ReminderPicker({ taskId }: ReminderPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [datetime, setDatetime] = useState('');
  const createReminder = useCreateReminder(taskId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime) return;

    const isoStr = new Date(datetime).toISOString();
    createReminder.mutate(
      { remindAt: isoStr, type: 'SYSTEM' },
      {
        onSuccess: () => {
          setDatetime('');
          setIsOpen(false);
        },
      }
    );
  };

  const handleQuickPreset = (minutesAhead: number) => {
    const target = new Date(Date.now() + minutesAhead * 60 * 1000);
    createReminder.mutate(
      { remindAt: target.toISOString(), type: 'SYSTEM' },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition"
      >
        <Bell className="h-3.5 w-3.5 text-indigo-400" />
        <span>Add Reminder</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-64 rounded-xl border border-white/10 bg-[#111827] p-3 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-white flex items-center">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-indigo-400" /> Schedule Reminder
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              &times;
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => handleQuickPreset(15)}
              className="rounded bg-white/5 px-2 py-1 text-[10px] text-gray-300 hover:bg-indigo-600 hover:text-white transition"
            >
              +15m
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(60)}
              className="rounded bg-white/5 px-2 py-1 text-[10px] text-gray-300 hover:bg-indigo-600 hover:text-white transition"
            >
              +1 Hour
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(24 * 60)}
              className="rounded bg-white/5 px-2 py-1 text-[10px] text-gray-300 hover:bg-indigo-600 hover:text-white transition"
            >
              Tomorrow
            </button>
          </div>

          {/* Custom Date Time Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!datetime || createReminder.isPending}
              className="flex w-full items-center justify-center space-x-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Set Reminder</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
