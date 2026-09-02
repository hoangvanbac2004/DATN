'use client';

import React from 'react';
import type { WhiteboardElementDto } from '../types';

interface ShapeElementProps {
  element: WhiteboardElementDto;
  isSelected?: boolean;
  onSelect: () => void;
  onChangeContent: (content: string) => void;
}

export function ShapeElement({
  element,
  isSelected,
  onSelect,
  onChangeContent,
}: ShapeElementProps) {
  const isCircle = element.type === 'SHAPE_CIRCLE';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex || 1,
      }}
      className={`absolute cursor-move border-2 border-indigo-500/80 bg-indigo-950/40 p-4 backdrop-blur-md transition-all flex items-center justify-center ${
        isCircle ? 'rounded-full' : 'rounded-2xl'
      } ${isSelected ? 'ring-2 ring-indigo-400 scale-[1.02]' : ''}`}
    >
      <input
        type="text"
        value={element.content || ''}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder="Shape text..."
        className="w-full bg-transparent text-center text-xs font-bold text-white placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
}
