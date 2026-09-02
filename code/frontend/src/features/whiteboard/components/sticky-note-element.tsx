'use client';

import React from 'react';
import type { WhiteboardElementDto } from '../types';

interface StickyNoteElementProps {
  element: WhiteboardElementDto;
  isSelected?: boolean;
  onSelect: () => void;
  onChangeContent: (content: string) => void;
}

export function StickyNoteElement({
  element,
  isSelected,
  onSelect,
  onChangeContent,
}: StickyNoteElementProps) {
  let bgColor = '#fef08a'; // Default yellow
  try {
    if (element.styleJson) {
      const parsed = JSON.parse(element.styleJson);
      if (parsed.bg) bgColor = parsed.bg;
    }
  } catch {
    // Fallback
  }

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
        backgroundColor: bgColor,
        zIndex: element.zIndex || 1,
      }}
      className={`absolute cursor-move rounded-2xl p-4 shadow-xl transition-all border ${
        isSelected ? 'ring-2 ring-indigo-500 border-indigo-400 scale-[1.02]' : 'border-black/10'
      }`}
    >
      <textarea
        value={element.content || ''}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder="Type note..."
        className="h-full w-full resize-none bg-transparent font-sans text-xs font-semibold text-gray-900 placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
}
