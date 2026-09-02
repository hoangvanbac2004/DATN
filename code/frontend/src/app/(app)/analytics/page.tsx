'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ProductivityOverview } from '@/features/analytics/components/productivity-overview';

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Top Page Title */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-heading">Productivity Analytics</h1>
          <p className="text-xs text-gray-400">Comprehensive task completion velocity and performance insights</p>
        </div>
      </div>

      {/* Main Productivity Overview Component */}
      <ProductivityOverview />
    </div>
  );
}
