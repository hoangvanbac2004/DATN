'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const getColorStyles = () => {
    switch (color) {
      case 'indigo':
        return 'from-indigo-600/20 to-indigo-950/30 border-indigo-500/20 text-indigo-400';
      case 'emerald':
        return 'from-emerald-600/20 to-emerald-950/30 border-emerald-500/20 text-emerald-400';
      case 'rose':
        return 'from-rose-600/20 to-rose-950/30 border-rose-500/20 text-rose-400';
      case 'amber':
        return 'from-amber-600/20 to-amber-950/30 border-amber-500/20 text-amber-400';
      case 'purple':
        return 'from-purple-600/20 to-purple-950/30 border-purple-500/20 text-purple-400';
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 space-y-2 transition hover:border-white/20 ${getColorStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">{icon}</div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-2xl font-black text-white font-heading">{value}</h3>
        {subtitle && <p className="text-[11px] text-gray-400 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
