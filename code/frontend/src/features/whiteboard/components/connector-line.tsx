'use client';

import React from 'react';
import type { WhiteboardElementDto } from '../types';

interface ConnectorLineProps {
  element: WhiteboardElementDto;
  allElements: WhiteboardElementDto[];
  isSelected?: boolean;
  onSelect: () => void;
}

export function ConnectorLine({
  element,
  allElements,
  isSelected,
  onSelect,
}: ConnectorLineProps) {
  const startEl = allElements.find((e) => e.id === element.startElementId);
  const endEl = allElements.find((e) => e.id === element.endElementId);

  const x1 = startEl ? startEl.x + startEl.width / 2 : element.x;
  const y1 = startEl ? startEl.y + startEl.height / 2 : element.y;

  const x2 = endEl ? endEl.x + endEl.width / 2 : element.x + element.width;
  const y2 = endEl ? endEl.y + endEl.height / 2 : element.y + element.height;

  return (
    <g onClick={onSelect} className="cursor-pointer">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isSelected ? '#818cf8' : '#6366f1'}
        strokeWidth={isSelected ? 4 : 3}
        strokeDasharray="6,6"
        markerEnd="url(#arrowhead)"
      />
      <circle cx={x1} cy={y1} r={5} fill="#6366f1" />
      <circle cx={x2} cy={y2} r={5} fill="#6366f1" />
    </g>
  );
}
