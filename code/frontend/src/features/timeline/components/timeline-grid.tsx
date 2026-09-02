'use client';

import React from 'react';
import type { DateScaleMode } from '../types';

interface TimelineGridProps {
  dates: Date[];
  scaleMode: DateScaleMode;
  columnWidth: number;
}

export function TimelineGrid({ dates, scaleMode, columnWidth }: TimelineGridProps) {
  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const formatHeaderLabel = (date: Date) => {
    if (scaleMode === 'days') {
      return {
        top: date.toLocaleDateString(undefined, { weekday: 'short' }),
        bottom: date.getDate().toString(),
      };
    } else if (scaleMode === 'weeks') {
      return {
        top: `W${getWeekNumber(date)}`,
        bottom: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    } else {
      return {
        top: date.getFullYear().toString(),
        bottom: date.toLocaleDateString(undefined, { month: 'short' }),
      };
    }
  };

  return (
    <div className="flex border-b border-white/10 bg-[#111827]/40">
      {dates.map((date, index) => {
        const label = formatHeaderLabel(date);
        const today = isToday(date);

        return (
          <div
            key={index}
            style={{ width: columnWidth, minWidth: columnWidth }}
            className={`flex flex-col items-center justify-center border-r border-white/5 py-2 text-[10px] ${
              today ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-gray-400'
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider text-gray-500">{label.top}</span>
            <span className={`mt-0.5 ${today ? 'text-indigo-300 font-bold' : 'text-white'}`}>
              {label.bottom}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
