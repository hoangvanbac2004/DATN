import { useInfiniteQuery } from '@tanstack/react-query';
import { activityService } from '../services/activity-service';
import type { ActivityLogDto, ActivityGroup } from '../types';

export const activityKeys = {
  all: ['activity'] as const,
  user:      (entityType?: string) => [...activityKeys.all, 'user', entityType] as const,
  project:   (projectId: string, entityType?: string) => [...activityKeys.all, 'project', projectId, entityType] as const,
  workspace: (workspaceId: string, entityType?: string) => [...activityKeys.all, 'workspace', workspaceId, entityType] as const,
};

const PAGE_SIZE = 20;

export function useUserActivityFeed(entityType?: string) {
  return useInfiniteQuery({
    queryKey: activityKeys.user(entityType),
    queryFn: ({ pageParam = 0 }) => activityService.getUserActivities(pageParam, PAGE_SIZE, entityType),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });
}

export function useProjectActivityFeed(projectId: string, entityType?: string) {
  return useInfiniteQuery({
    queryKey: activityKeys.project(projectId, entityType),
    queryFn: ({ pageParam = 0 }) => activityService.getProjectActivities(projectId, pageParam, PAGE_SIZE, entityType),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: Boolean(projectId),
  });
}

export function useWorkspaceActivityFeed(workspaceId: string, entityType?: string) {
  return useInfiniteQuery({
    queryKey: activityKeys.workspace(workspaceId, entityType),
    queryFn: ({ pageParam = 0 }) => activityService.getWorkspaceActivities(workspaceId, pageParam, PAGE_SIZE, entityType),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: Boolean(workspaceId),
  });
}

/** Groups flat ActivityLogDto list by relative date labels (Today, Yesterday, or full date). */
export function groupActivitiesByDate(items: ActivityLogDto[]): ActivityGroup[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups: Map<string, ActivityLogDto[]> = new Map();

  for (const item of items) {
    const date = new Date(item.createdAt);
    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const yestOnly = yesterday.toDateString();

    let label: string;
    if (dateOnly === todayOnly) {
      label = 'Today';
    } else if (dateOnly === yestOnly) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }

  return Array.from(groups.entries()).map(([dateLabel, items]) => ({ dateLabel, items }));
}
