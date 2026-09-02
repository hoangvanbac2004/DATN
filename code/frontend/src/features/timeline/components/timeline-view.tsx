'use client';

import React, { useState, useMemo } from 'react';
import { Loader2, Calendar } from 'lucide-react';
import type { DateScaleMode, TimelineTaskDto } from '../types';
import type { TaskDto } from '@/features/task/types';
import { useProjectTimeline, useUpdateTaskTimeline, useCreateDependency } from '../hooks/use-timeline';
import { TimelineHeader } from './timeline-header';
import { TimelineGrid } from './timeline-grid';
import { TimelineTaskBar } from './timeline-task-bar';
import { AddDependencyDialog } from './add-dependency-dialog';
import { TaskDetailModal } from '@/features/task/components/task-detail-modal';

interface TimelineViewProps {
  projectId: string;
}

export function TimelineView({ projectId }: TimelineViewProps) {
  const { data: tasks = [], isLoading } = useProjectTimeline(projectId);
  const updateTimeline = useUpdateTaskTimeline(projectId);
  const createDependency = useCreateDependency(projectId);

  const [scaleMode, setScaleMode] = useState<DateScaleMode>('days');
  const [baseDate, setBaseDate] = useState(() => new Date());

  const [isDepDialogOpen, setIsDepDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TimelineTaskDto | null>(null);

  const columnWidth = scaleMode === 'days' ? 60 : scaleMode === 'weeks' ? 100 : 140;
  const numColumns = 30;

  const dates = useMemo(() => {
    const arr: Date[] = [];
    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < numColumns; i++) {
      const d = new Date(start);
      if (scaleMode === 'days') {
        d.setDate(d.getDate() + i);
      } else if (scaleMode === 'weeks') {
        d.setDate(d.getDate() + i * 7);
      } else {
        d.setMonth(d.getMonth() + i);
      }
      arr.push(d);
    }
    return arr;
  }, [baseDate, scaleMode, numColumns]);

  const dateRangeText = useMemo(() => {
    if (dates.length === 0) return '';
    const first = dates[0];
    const last = dates[dates.length - 1];
    return `${first.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${last.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [dates]);

  const handleToday = () => setBaseDate(new Date());

  const handlePrev = () => {
    const d = new Date(baseDate);
    if (scaleMode === 'days') d.setDate(d.getDate() - 7);
    else if (scaleMode === 'weeks') d.setDate(d.getDate() - 28);
    else d.setMonth(d.getMonth() - 3);
    setBaseDate(d);
  };

  const handleNext = () => {
    const d = new Date(baseDate);
    if (scaleMode === 'days') d.setDate(d.getDate() + 7);
    else if (scaleMode === 'weeks') d.setDate(d.getDate() + 28);
    else d.setMonth(d.getMonth() + 3);
    setBaseDate(d);
  };

  const handleUpdateTimeline = (taskId: string, newStart: Date, newDue: Date) => {
    updateTimeline.mutate({
      taskId,
      data: {
        startDate: newStart.toISOString(),
        dueDate: newDue.toISOString(),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TimelineHeader
        scaleMode={scaleMode}
        onScaleModeChange={setScaleMode}
        onToday={handleToday}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenDependencyDialog={() => setIsDepDialogOpen(true)}
        dateRangeText={dateRangeText}
      />

      {tasks.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-8 text-center backdrop-blur-md">
          <Calendar className="h-8 w-8 text-indigo-400" />
          <h3 className="mt-3 text-sm font-semibold text-white font-heading">No tasks on timeline</h3>
          <p className="mt-1 text-xs text-gray-400">Add tasks to project to view their schedule</p>
        </div>
      ) : (
        <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/60 backdrop-blur-md">
          {/* Left Sidebar: Task Names */}
          <div className="w-56 shrink-0 border-r border-white/10 bg-[#111827]/90 z-20">
            <div className="border-b border-white/10 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Task Name
            </div>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="h-13 flex items-center px-3 border-b border-white/5 hover:bg-white/5 cursor-pointer text-xs font-medium text-white truncate"
              >
                {task.title}
              </div>
            ))}
          </div>

          {/* Right Area: Scrollable Timeline Grid */}
          <div className="flex-1 overflow-x-auto relative">
            <TimelineGrid dates={dates} scaleMode={scaleMode} columnWidth={columnWidth} />

            {/* Task Rows & Bars */}
            <div className="relative">
              {tasks.map((task) => {
                const taskStart = task.startDate ? new Date(task.startDate) : dates[0];
                const taskDue = task.dueDate ? new Date(task.dueDate) : new Date(taskStart.getTime() + 86400000);

                const timelineStart = dates[0];
                const diffMs = taskStart.getTime() - timelineStart.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                const durationMs = taskDue.getTime() - taskStart.getTime();
                const durationDays = Math.max(1, durationMs / (1000 * 60 * 60 * 24));

                const dayWidth = columnWidth / (scaleMode === 'days' ? 1 : scaleMode === 'weeks' ? 7 : 30);
                const leftOffset = Math.max(0, diffDays * dayWidth);
                const barWidth = Math.max(dayWidth, durationDays * dayWidth);

                return (
                  <div key={task.id} className="relative h-13 border-b border-white/5">
                    <TimelineTaskBar
                      task={task}
                      leftOffset={leftOffset}
                      barWidth={barWidth}
                      dayWidth={dayWidth}
                      startDate={timelineStart}
                      onUpdateTimeline={handleUpdateTimeline}
                      onSelectTask={setSelectedTask}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <AddDependencyDialog
        tasks={tasks}
        isOpen={isDepDialogOpen}
        onClose={() => setIsDepDialogOpen(false)}
        onSubmit={(payload) => createDependency.mutate(payload)}
        isLoading={createDependency.isPending}
      />

      <TaskDetailModal
        task={selectedTask as TaskDto | null}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
