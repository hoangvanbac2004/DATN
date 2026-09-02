'use client';

import React from 'react';

interface StatusDonutChartProps {
  statusBreakdown: Record<string, number>;
  totalTasks: number;
}

export function StatusDonutChart({ statusBreakdown, totalTasks }: StatusDonutChartProps) {
  const statusColors: Record<string, string> = {
    TODO: '#60A5FA',
    IN_PROGRESS: '#F59E0B',
    IN_REVIEW: '#A855F7',
    COMPLETED: '#10B981',
    CANCELLED: '#EF4444',
  };

  const statusLabels: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    IN_REVIEW: 'In Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  const entries = Object.entries(statusBreakdown).filter(([_, count]) => count > 0);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-gray-950/40 p-4">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Status Distribution</h4>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
            {totalTasks === 0 ? (
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
            ) : (
              entries.reduce(
                (acc, [status, count], i) => {
                  const percentage = count / totalTasks;
                  const strokeDasharray = `${percentage * 251.2} 251.2`;
                  const strokeDashoffset = -acc.offset;
                  acc.offset += percentage * 251.2;

                  acc.elements.push(
                    <circle
                      key={status}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={statusColors[status] || '#9CA3AF'}
                      strokeWidth="12"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  );
                  return acc;
                },
                { offset: 0, elements: [] as React.ReactNode[] }
              ).elements
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-white font-heading">{totalTasks}</span>
            <span className="text-[10px] text-gray-400 font-medium">Tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 flex-1 min-w-0">
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = statusBreakdown[key] || 0;
            const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
            return (
              <div key={key} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColors[key] }}
                  />
                  <span className="text-gray-300 truncate">{label}</span>
                </div>
                <span className="font-semibold text-white ml-2">
                  {count} <span className="text-gray-500 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
