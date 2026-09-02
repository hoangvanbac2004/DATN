import type { TaskDto } from '@/features/task/types';

export type DateScaleMode = 'days' | 'weeks' | 'months';

export interface TaskDependencyDto {
  id: string;
  predecessorId: string;
  successorId: string;
  dependencyType: string;
  createdAt: string;
}

export interface UpdateTaskTimelinePayload {
  startDate: string;
  dueDate: string;
}

export interface CreateDependencyPayload {
  predecessorId: string;
  successorId: string;
  dependencyType?: string;
}

export interface TimelineTaskDto extends TaskDto {
  startDate?: string;
  durationDays?: number;
  dependencies?: TaskDependencyDto[];
}
