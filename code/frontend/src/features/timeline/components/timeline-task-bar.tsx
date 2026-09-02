'use client';

import React, { useState, useRef } from 'react';
import type { TimelineTaskDto } from '../types';

interface TimelineTaskBarProps {
  task: TimelineTaskDto;
  leftOffset: number;
  barWidth: number;
  dayWidth: number;
  startDate: Date;
  onUpdateTimeline: (taskId: string, startDate: Date, dueDate: Date) => void;
  onSelectTask: (task: TimelineTaskDto) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#64748b',
  MEDIUM: '#6366f1',
  HIGH: '#f59e0b',
  URGENT: '#ef4444',
};

export function TimelineTaskBar({
  task,
  leftOffset,
  barWidth,
  dayWidth,
  startDate: timelineStartDate,
  onUpdateTimeline,
  onSelectTask,
}: TimelineTaskBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const dragStartXRef = useRef(0);
  const initialLeftRef = useRef(leftOffset);
  const initialWidthRef = useRef(barWidth);

  const [currentLeft, setCurrentLeft] = useState(leftOffset);
  const [currentWidth, setCurrentWidth] = useState(barWidth);

  // Sync state if props change while not dragging
  React.useEffect(() => {
    if (!isDragging && !isResizingLeft && !isResizingRight) {
      setCurrentLeft(leftOffset);
      setCurrentWidth(barWidth);
    }
  }, [leftOffset, barWidth, isDragging, isResizingLeft, isResizingRight]);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'left' | 'right') => {
    e.stopPropagation();
    dragStartXRef.current = e.clientX;
    initialLeftRef.current = currentLeft;
    initialWidthRef.current = currentWidth;

    if (type === 'move') setIsDragging(true);
    if (type === 'left') setIsResizingLeft(true);
    if (type === 'right') setIsResizingRight(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartXRef.current;

      if (type === 'move') {
        const newLeft = Math.max(0, initialLeftRef.current + deltaX);
        setCurrentLeft(newLeft);
      } else if (type === 'left') {
        const newLeft = Math.max(0, initialLeftRef.current + deltaX);
        const newWidth = Math.max(dayWidth, initialWidthRef.current - deltaX);
        setCurrentLeft(newLeft);
        setCurrentWidth(newWidth);
      } else if (type === 'right') {
        const newWidth = Math.max(dayWidth, initialWidthRef.current + deltaX);
        setCurrentWidth(newWidth);
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      const deltaX = upEvent.clientX - dragStartXRef.current;
      let finalLeft = currentLeft;
      let finalWidth = currentWidth;

      if (type === 'move') {
        finalLeft = Math.max(0, initialLeftRef.current + deltaX);
      } else if (type === 'left') {
        finalLeft = Math.max(0, initialLeftRef.current + deltaX);
        finalWidth = Math.max(dayWidth, initialWidthRef.current - deltaX);
      } else if (type === 'right') {
        finalWidth = Math.max(dayWidth, initialWidthRef.current + deltaX);
      }

      setIsDragging(false);
      setIsResizingLeft(false);
      setIsResizingRight(false);

      // Convert pixel offsets back to Date objects
      const startDaysOffset = Math.round(finalLeft / dayWidth);
      const durationDays = Math.max(1, Math.round(finalWidth / dayWidth));

      const newStartDate = new Date(timelineStartDate);
      newStartDate.setDate(newStartDate.getDate() + startDaysOffset);

      const newDueDate = new Date(newStartDate);
      newDueDate.setDate(newDueDate.getDate() + durationDays);

      onUpdateTimeline(task.id, newStartDate, newDueDate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const accentColor = PRIORITY_COLORS[task.priority] || '#6366f1';

  return (
    <div
      onClick={() => onSelectTask(task)}
      style={{
        left: currentLeft,
        width: Math.max(dayWidth, currentWidth),
        backgroundColor: accentColor,
      }}
      className={`group absolute top-2.5 h-8 cursor-grab active:cursor-grabbing rounded-lg px-2 shadow-md transition-shadow flex items-center justify-between border border-white/20 text-white select-none ${
        isDragging || isResizingLeft || isResizingRight
          ? 'z-30 opacity-90 ring-2 ring-white/50'
          : 'z-10 hover:shadow-lg hover:brightness-110'
      }`}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      {/* Left Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize rounded-l-lg hover:bg-white/30"
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      />

      {/* Bar Content */}
      <span className="truncate text-[11px] font-semibold text-white px-1">
        {task.title}
      </span>

      {/* Right Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize rounded-r-lg hover:bg-white/30"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />
    </div>
  );
}
