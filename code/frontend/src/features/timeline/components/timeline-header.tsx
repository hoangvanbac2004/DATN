'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, GitCommit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DateScaleMode } from '../types';

interface TimelineHeaderProps {
  scaleMode: DateScaleMode;
  onScaleModeChange: (mode: DateScaleMode) => void;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenDependencyDialog: () => void;
  dateRangeText: string;
}

export function TimelineHeader({
  scaleMode,
  onScaleModeChange,
  onToday,
  onPrev,
  onNext,
  onOpenDependencyDialog,
  dateRangeText,
}: TimelineHeaderProps) {
  const { t } = useTranslation('timeline');
  const { t: tCal } = useTranslation('calendar');

  const scaleLabels: Record<DateScaleMode, string> = {
    days: t('views.day'),
    weeks: t('views.week'),
    months: t('views.month'),
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4">
      {/* Date Navigation */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToday}
          className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{tCal('today')}</span>
        </button>

        <div className="flex items-center rounded-xl border border-white/10 bg-[#111827]/70 p-0.5">
          <button
            onClick={onPrev}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNext}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <span className="text-xs font-bold text-white font-heading">{dateRangeText}</span>
      </div>

      {/* Controls & Scale Switcher */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenDependencyDialog}
          className="flex items-center space-x-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/20"
        >
          <GitCommit className="h-3.5 w-3.5" />
          <span>{t('addDependency')}</span>
        </button>

        {/* Date Scale Toggle */}
        <div className="flex items-center rounded-xl border border-white/10 bg-[#111827]/70 p-1">
          {(['days', 'weeks', 'months'] as DateScaleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onScaleModeChange(mode)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                scaleMode === mode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {scaleLabels[mode]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
