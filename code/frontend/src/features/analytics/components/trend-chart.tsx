'use client';

import React from 'react';
import type { TrendPointDto } from '../types';

interface TrendChartProps {
  points: TrendPointDto[];
  height?: number;
}

export function TrendChart({ points, height = 220 }: TrendChartProps) {
  if (!points || points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-gray-500 italic">
        No trend data available for this period.
      </div>
    );
  }

  const maxVal = Math.max(1, ...points.map((p) => Math.max(p.completedCount, p.createdCount)));
  const width = 600;
  const padding = 40;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth;

  const completedCoords = points.map((p, i) => ({
    x: padding + i * stepX,
    y: height - padding - (p.completedCount / maxVal) * usableHeight,
  }));

  const createdCoords = points.map((p, i) => ({
    x: padding + i * stepX,
    y: height - padding - (p.createdCount / maxVal) * usableHeight,
  }));

  const buildPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, point, i) => (i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`), '');
  };

  const completedPath = buildPath(completedCoords);
  const createdPath = buildPath(createdCoords);

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-gray-950/40 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Productivity Velocity Trend</h4>
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            <span className="text-gray-300">Created</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - padding - ratio * usableHeight;
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={padding - 10} y={y + 3} fill="#6B7280" fontSize="9" textAnchor="end">
                  {Math.round(ratio * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Created line */}
          <path d={createdPath} fill="none" stroke="#818CF8" strokeWidth="2" strokeDasharray="4 4" opacity={0.8} />

          {/* Completed line */}
          <path d={completedPath} fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />

          {/* Points */}
          {completedCoords.map((pt, i) => (
            <circle key={`c-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#34D399" className="transition hover:r-6" />
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => {
            const x = padding + i * stepX;
            return (
              <text key={`l-${i}`} x={x} y={height - 10} fill="#9CA3AF" fontSize="9" textAnchor="middle">
                {p.dateLabel}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
