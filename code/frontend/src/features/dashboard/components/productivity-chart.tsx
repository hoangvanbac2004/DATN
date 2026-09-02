'use client';

import React from 'react';
import { BarChart3, TrendingUp, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProductivityStatsDto } from '../types';

interface ProductivityChartProps {
  stats: ProductivityStatsDto[];
  isStaff?: boolean;
}

export function ProductivityChart({ stats, isStaff }: ProductivityChartProps) {
  const { t: tDash } = useTranslation('dashboard');

  const totalCompleted = stats.reduce((acc, s) => acc + (s.completedCount || 0), 0);
  const totalCreated = stats.reduce((acc, s) => acc + (s.createdCount || 0), 0);

  const rawMax = Math.max(...stats.map((s) => Math.max(s.completedCount || 0, s.createdCount || 0, 0)));
  const maxVal = Math.max(rawMax, 3); // Scale base

  const getWeekdayLabel = (index: number) => {
    const labels = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];
    return labels[index] || `Th ${index + 2}`;
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-xs space-y-5 text-text-primary">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary font-heading flex items-center space-x-2">
              <span>{tDash('productivity.title', { defaultValue: 'Tóm tắt Năng suất Làm việc' })}</span>
              {isStaff && (
                <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Cá nhân
                </span>
              )}
            </h3>
            <p className="text-xs text-text-secondary">
              {isStaff
                ? 'Thống kê chi tiết công việc của bạn được thêm mới và hoàn thành theo tuần (Thứ 2 - Chủ nhật)'
                : tDash('productivity.subtitle', {
                    defaultValue:
                      'Thống kê chi tiết công việc tạo mới và hoàn thành theo tuần (Thứ 2 - Chủ nhật)',
                  })}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent High-Visibility Summary Cards Row */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Total Created Big Card */}
        <div className="flex items-center space-x-3.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">
              {isStaff ? 'Công việc của bạn Được thêm mới (Tuần này)' : 'Tổng công việc Tạo mới (Tuần này)'}
            </p>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-primary font-heading">{totalCreated}</span>
              <span className="text-[11px] font-bold text-primary/80">công việc</span>
            </div>
          </div>
        </div>

        {/* Total Completed Big Card */}
        <div className="flex items-center space-x-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">
              {isStaff ? 'Công việc của bạn Đã hoàn thành (Tuần này)' : 'Tổng công việc Đã hoàn thành (Tuần này)'}
            </p>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-500 font-heading">{totalCompleted}</span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">công việc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart with High Contrast Bars & Explicit Count Badges */}
      <div className="rounded-xl border border-surface-border/80 bg-surface-alt/30 p-4 space-y-3">
        {/* Legend */}
        <div className="flex items-center justify-between text-xs font-semibold px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Biểu đồ tuần này (Thứ 2 - Chủ nhật):</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <div className="h-3 w-3 rounded-md bg-primary" />
              <span className="text-xs font-bold text-primary">Tạo mới ({totalCreated})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="h-3 w-3 rounded-md bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-500">Hoàn thành ({totalCompleted})</span>
            </div>
          </div>
        </div>

        {/* 7-Day Columns (Mon - Sun) */}
        <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 relative">
          {stats.map((s, idx) => {
            const completedCount = s.completedCount || 0;
            const createdCount = s.createdCount || 0;

            const completedHeight = Math.min(Math.round((completedCount / maxVal) * 100), 100);
            const createdHeight = Math.min(Math.round((createdCount / maxVal) * 100), 100);

            const dateParts = s.date.split('-');
            const dateObj = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
            const dateLabel = getWeekdayLabel(idx);
            const dayMonth = `${dateParts[2]}/${dateParts[1]}`;
            const isToday = new Date().toDateString() === dateObj.toDateString();

            return (
              <div
                key={s.date}
                className={`flex flex-col items-center justify-end h-full rounded-xl p-1.5 transition ${
                  isToday ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface-alt/60'
                }`}
              >
                {/* Bars Area */}
                <div className="flex items-end justify-center space-x-1.5 h-28 w-full pb-1">
                  {/* Created Bar (Tạo mới) */}
                  <div className="flex flex-col items-center justify-end h-full w-4 sm:w-5">
                    <span
                      className={`text-[10px] font-extrabold mb-1 font-mono transition ${
                        createdCount > 0 ? 'text-primary scale-110 font-bold' : 'text-text-muted/40'
                      }`}
                    >
                      {createdCount}
                    </span>
                    <div
                      style={{ height: `${createdCount > 0 ? Math.max(createdHeight, 18) : 4}%` }}
                      className={`w-full rounded-md transition-all duration-300 ${
                        createdCount > 0
                          ? 'bg-primary shadow-sm hover:brightness-125 ring-1 ring-primary/40'
                          : 'bg-surface-border/50'
                      }`}
                      title={`${dateLabel} (${dayMonth}) - Tạo mới: ${createdCount} việc`}
                    />
                  </div>

                  {/* Completed Bar (Hoàn thành) */}
                  <div className="flex flex-col items-center justify-end h-full w-4 sm:w-5">
                    <span
                      className={`text-[10px] font-extrabold mb-1 font-mono transition ${
                        completedCount > 0 ? 'text-emerald-500 scale-110 font-bold' : 'text-text-muted/40'
                      }`}
                    >
                      {completedCount}
                    </span>
                    <div
                      style={{ height: `${completedCount > 0 ? Math.max(completedHeight, 18) : 4}%` }}
                      className={`w-full rounded-md transition-all duration-300 ${
                        completedCount > 0
                          ? 'bg-emerald-500 shadow-sm hover:brightness-125 ring-1 ring-emerald-500/40'
                          : 'bg-surface-border/50'
                      }`}
                      title={`${dateLabel} (${dayMonth}) - Hoàn thành: ${completedCount} việc`}
                    />
                  </div>
                </div>

                {/* Day label */}
                <div className="text-center pt-1 border-t border-surface-border/60 w-full">
                  <span className={`text-[10px] font-extrabold capitalize block ${isToday ? 'text-primary' : 'text-text-primary'}`}>
                    {isToday ? 'Hôm nay' : dateLabel}
                  </span>
                  <span className="text-[9px] text-text-muted block font-mono">
                    {dayMonth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
