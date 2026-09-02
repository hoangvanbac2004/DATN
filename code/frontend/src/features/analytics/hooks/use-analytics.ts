import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics-service';
import type { AnalyticsPeriod } from '../types';

export const ANALYTICS_QUERY_KEYS = {
  overview: (period: AnalyticsPeriod, workspaceId?: string, projectId?: string) =>
    ['analytics-overview', period, workspaceId, projectId] as const,
};

export function useProductivityAnalytics(
  period: AnalyticsPeriod = 'WEEKLY',
  workspaceId?: string,
  projectId?: string
) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(period, workspaceId, projectId),
    queryFn: () => analyticsService.getProductivityOverview(period, workspaceId, projectId),
    staleTime: 30000,
  });
}
