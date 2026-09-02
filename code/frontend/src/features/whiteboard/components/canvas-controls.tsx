'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isPanMode: boolean;
  onTogglePanMode: () => void;
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isPanMode,
  onTogglePanMode,
}: CanvasControlsProps) {
  const percentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-1.5 rounded-2xl border border-white/10 bg-[#111827]/80 p-2 shadow-2xl backdrop-blur-md">
      <button
        onClick={onTogglePanMode}
        className={`rounded-xl p-2 transition ${
          isPanMode ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
        }`}
        title="Pan Canvas (Space + Drag)"
      >
        <Move className="h-4 w-4" />
      </button>

      <div className="h-4 w-px bg-white/10" />

      <button
        onClick={onZoomOut}
        className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <button
        onClick={onResetZoom}
        className="px-2 py-1 text-xs font-mono font-bold text-gray-300 hover:text-white transition"
        title="Reset Zoom (100%)"
      >
        {percentage}%
      </button>

      <button
        onClick={onZoomIn}
        className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="h-4 w-px bg-white/10" />

      <button
        onClick={onResetZoom}
        className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
        title="Fit View"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
