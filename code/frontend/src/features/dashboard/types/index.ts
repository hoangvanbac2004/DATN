import type { TaskDto } from '@/features/task/types';

export interface ActivityItemDto {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardSummaryDto {
  todayTasksCount: number;
  upcomingTasksCount: number;
  overdueTasksCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completionRate: number;
  recentActivities: ActivityItemDto[];
}

export interface ProductivityStatsDto {
  date: string;
  completedCount: number;
  createdCount: number;
}
