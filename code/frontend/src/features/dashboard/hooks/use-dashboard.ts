import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

export const DASHBOARD_QUERY_KEYS = {
  summary: ['dashboard-summary'] as const,
  today: ['dashboard-today'] as const,
  upcoming: ['dashboard-upcoming'] as const,
  overdue: ['dashboard-overdue'] as const,
  productivity: ['dashboard-productivity'] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: dashboardService.getSummary,
  });
}

export function useTodayTasks() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.today,
    queryFn: dashboardService.getTodayTasks,
  });
}

export function useUpcomingTasks() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.upcoming,
    queryFn: dashboardService.getUpcomingTasks,
  });
}

export function useOverdueTasks() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overdue,
    queryFn: dashboardService.getOverdueTasks,
  });
}

export function useProductivityStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.productivity,
    queryFn: dashboardService.getProductivityStats,
  });
}
