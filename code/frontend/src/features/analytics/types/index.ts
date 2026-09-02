export type AnalyticsPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface TrendPointDto {
  dateLabel: string;
  completedCount: number;
  createdCount: number;
}

export interface ProductivityOverviewDto {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  pendingTasks: number;
  completionRate: number;
  period: AnalyticsPeriod;
  trendPoints: TrendPointDto[];
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
}
