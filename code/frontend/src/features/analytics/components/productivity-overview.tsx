'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp, AlertTriangle } from 'lucide-react';
import type { AnalyticsPeriod } from '../types';
import { useProductivityAnalytics } from '../hooks/use-analytics';
import { StatCard } from './stat-card';
import { TrendChart } from './trend-chart';
import { StatusDonutChart } from './status-donut-chart';

interface ProductivityOverviewProps {
  workspaceId?: string;
  projectId?: string;
}

export function ProductivityOverview({ workspaceId, projectId }: ProductivityOverviewProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('WEEKLY');
  const { data, isLoading } = useProductivityAnalytics(period, workspaceId, projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-gray-900/60" />
          <div className="h-28 animate-pulse rounded-2xl bg-gray-900/60" />
          <div className="h-28 animate-pulse rounded-2xl bg-gray-900/60" />
          <div className="h-28 animate-pulse rounded-2xl bg-gray-900/60" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-gray-900/60" />
      </div>
    );
  }

  const overview = data || {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    period: 'WEEKLY' as AnalyticsPeriod,
    trendPoints: [],
    statusBreakdown: {},
    priorityBreakdown: {},
  };

  const periodOptions: { label: string; value: AnalyticsPeriod }[] = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-heading">Productivity Overview</h2>
          <p className="text-xs text-gray-400">Track task completion velocity and performance metrics</p>
        </div>

        <div className="flex items-center space-x-1 rounded-xl border border-white/10 bg-gray-950/60 p-1">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                period === opt.value
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={overview.totalTasks}
          subtitle="All active & completed"
          icon={<ListTodo className="h-5 w-5" />}
          color="indigo"
        />

        <StatCard
          title="Completed Tasks"
          value={overview.completedTasks}
          subtitle={`${overview.completionRate}% completion rate`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="emerald"
        />

        <StatCard
          title="Overdue Tasks"
          value={overview.overdueTasks}
          subtitle="Past due date"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="rose"
        />

        <StatCard
          title="Pending Tasks"
          value={overview.pendingTasks}
          subtitle="In progress & review"
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart points={overview.trendPoints} />
        </div>
        <div className="lg:col-span-1">
          <StatusDonutChart
            statusBreakdown={overview.statusBreakdown}
            totalTasks={overview.totalTasks}
          />
        </div>
      </div>
    </div>
  );
}
