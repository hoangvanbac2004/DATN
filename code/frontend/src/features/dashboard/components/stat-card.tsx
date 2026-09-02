'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  badgeColor?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, badgeColor = 'bg-primary/10 text-primary' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-sm transition hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary">{title}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${badgeColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-text-primary font-heading tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-text-muted">{subtitle}</p>
    </div>
  );
}
